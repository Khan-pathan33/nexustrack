import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import User from '@/models/User';

const LOCAL_USERS_FILE = path.join(process.cwd(), 'local_users.json');

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  batch: string;
  batchName: string;
  role: string;
  emailUser: string;
  emailPass?: string;
  emailProvider?: 'gmail' | 'outlook' | 'both' | 'custom';
  gmailUser?: string;
  gmailPass?: string;
  outlookUser?: string;
  outlookPass?: string;
  imapHost?: string;
  imapPort?: number;
  smtpHost?: string;
  smtpPort?: number;
  excelFilename: string;
  excelPassword?: string;
  sharepointUrl?: string;
  tlEmail?: string;
  hasCompletedOnboarding: boolean;
  createdAt?: string;
}

function loadLocalUsers(): StoredUser[] {
  try {
    if (fs.existsSync(LOCAL_USERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_USERS_FILE, 'utf8'));
      if (Array.isArray(data)) return data;
    }
  } catch (e) {
    console.warn('Could not read local_users.json:', e);
  }
  return [];
}

function saveLocalUsers(users: StoredUser[]) {
  try {
    fs.writeFileSync(LOCAL_USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not save local_users.json:', e);
  }
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const normalized = email.toLowerCase().trim();

  // Try MongoDB
  if (isMongoConfigured()) {
    try {
      const conn = await connectToDatabase();
      if (conn) {
        const mongoUser = await User.findOne({ email: normalized }).lean();
        if (mongoUser) {
          return {
            id: mongoUser._id.toString(),
            name: mongoUser.name,
            email: mongoUser.email,
            password: mongoUser.password,
            batch: mongoUser.batch || '3',
            batchName: mongoUser.batchName || `Batch ${mongoUser.batch || '3'}`,
            role: mongoUser.role || 'coordinator',
            emailUser: mongoUser.emailUser || mongoUser.email,
            emailPass: mongoUser.emailPass,
            emailProvider: mongoUser.emailProvider || 'both',
            gmailUser: mongoUser.gmailUser || (mongoUser.email?.includes('gmail') ? mongoUser.email : ''),
            gmailPass: mongoUser.gmailPass || (mongoUser.email?.includes('gmail') ? mongoUser.emailPass : ''),
            outlookUser: mongoUser.outlookUser || (mongoUser.email?.includes('nybinfotech') ? mongoUser.email : ''),
            outlookPass: mongoUser.outlookPass || (mongoUser.email?.includes('nybinfotech') ? mongoUser.emailPass : ''),
            imapHost: mongoUser.imapHost || (mongoUser.emailProvider === 'outlook' ? 'outlook.office365.com' : 'imap.gmail.com'),
            imapPort: mongoUser.imapPort || 993,
            smtpHost: mongoUser.smtpHost || (mongoUser.emailProvider === 'outlook' ? 'smtp.office365.com' : 'smtp.gmail.com'),
            smtpPort: mongoUser.smtpPort || (mongoUser.emailProvider === 'outlook' ? 587 : 465),
            excelFilename: mongoUser.excelFilename || `Technical Team batch-${mongoUser.batch || '3'}_Daily_Status_Report.xlsx`,
            excelPassword: mongoUser.excelPassword,
            sharepointUrl: mongoUser.sharepointUrl,
            tlEmail: mongoUser.tlEmail,
            hasCompletedOnboarding: Boolean(mongoUser.hasCompletedOnboarding),
          };
        }
      }
    } catch (e) {
      console.warn('MongoDB findUserByEmail error, checking local store:', e);
    }
  }

  // Fallback to local store
  const localUsers = loadLocalUsers();
  const match = localUsers.find((u) => u.email.toLowerCase() === normalized);
  return match || null;
}

export async function createNewUser(userData: {
  name: string;
  email: string;
  password: string;
  batch?: string;
  role?: string;
  emailUser?: string;
}): Promise<StoredUser> {
  const normalized = userData.email.toLowerCase().trim();
  const cleanBatch = String(userData.batch || '3').replace(/batch/gi, '').trim() || '3';
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const excelFilename = `Technical Team batch-${cleanBatch}_Daily_Status_Report.xlsx`;

  const newUserData: StoredUser = {
    id: `coord-${Date.now()}`,
    name: userData.name.trim(),
    email: normalized,
    password: hashedPassword,
    batch: cleanBatch,
    batchName: `Batch ${cleanBatch} - Trainee Operations`,
    role: userData.role || 'coordinator',
    emailUser: (userData.emailUser || normalized).trim(),
    excelFilename,
    excelPassword: `nyb_batch${cleanBatch}_secure`,
    hasCompletedOnboarding: false,
    createdAt: new Date().toISOString(),
  };

  // Try MongoDB
  if (isMongoConfigured()) {
    try {
      const conn = await connectToDatabase();
      if (conn) {
        const created = await User.create(newUserData);
        newUserData.id = created._id.toString();
      }
    } catch (e) {
      console.warn('MongoDB create user error, saving to local store:', e);
    }
  }

  // Save to local store as well for maximum reliability
  const localUsers = loadLocalUsers();
  const filtered = localUsers.filter((u) => u.email.toLowerCase() !== normalized);
  filtered.push(newUserData);
  saveLocalUsers(filtered);

  return newUserData;
}

export async function updateUserByEmail(
  email: string,
  updateFields: Partial<StoredUser>
): Promise<boolean> {
  const normalized = email.toLowerCase().trim();

  // Try MongoDB
  if (isMongoConfigured()) {
    try {
      const conn = await connectToDatabase();
      if (conn) {
        await User.findOneAndUpdate({ email: normalized }, { $set: updateFields });
      }
    } catch (e) {
      console.warn('MongoDB updateUserByEmail error:', e);
    }
  }

  // Update local store
  const localUsers = loadLocalUsers();
  const idx = localUsers.findIndex((u) => u.email.toLowerCase() === normalized);
  if (idx !== -1) {
    localUsers[idx] = { ...localUsers[idx], ...updateFields };
    saveLocalUsers(localUsers);
    return true;
  }
  return false;
}
