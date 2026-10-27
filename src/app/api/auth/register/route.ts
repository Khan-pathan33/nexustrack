import { NextResponse } from 'next/server';
import { findUserByEmail, createNewUser } from '@/lib/user-store';

export async function POST(req: Request) {
  try {
    const { name, email, password, batch, role, emailUser } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 400 });
    }

    // Extract clean batch number (e.g. "Batch 5" -> "5", "5" -> "5")
    const cleanBatch = String(batch || '3').replace(/batch/gi, '').trim() || '3';

    const newUser = await createNewUser({
      name: name.trim(),
      email: normalizedEmail,
      password,
      batch: cleanBatch,
      role: role || 'coordinator',
      emailUser: (emailUser || normalizedEmail).trim(),
    });

    return NextResponse.json({
      success: true,
      message: `Coordinator account created for Batch ${cleanBatch}! Please sign in to activate your workspace.`,
      batch: cleanBatch,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        batch: newUser.batch,
        role: newUser.role,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
