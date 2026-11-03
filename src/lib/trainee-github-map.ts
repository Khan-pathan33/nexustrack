/**
 * Authoritative GitHub Profile & Repository Mapping for Active Trainees (Batch 3 & Batch 4)
 */

export interface TraineeGithubConfig {
  traineeName: string;
  username: string;
  githubUrl: string;
  defaultRepo: string;
  batchNumber: string;
}

export const BATCH_3_GITHUB_MAPPINGS: Record<string, TraineeGithubConfig> = {
  'Althaf Syed': {
    traineeName: 'Althaf Syed',
    username: 'MahammadAlthaf2002',
    githubUrl: 'https://github.com/MahammadAlthaf2002',
    defaultRepo: 'NYBINFOTECH-1',
    batchNumber: '3',
  },
  'Bala Krishna Parimi': {
    traineeName: 'Bala Krishna Parimi',
    username: 'Balakrishna3142',
    githubUrl: 'https://github.com/Balakrishna3142',
    defaultRepo: 'NYB',
    batchNumber: '3',
  },
  'Chandra Shekar K': {
    traineeName: 'Chandra Shekar K',
    username: 'kammarichandra',
    githubUrl: 'https://github.com/kammarichandra',
    defaultRepo: 'Daily-status-update',
    batchNumber: '3',
  },
  'Girish C': {
    traineeName: 'Girish C',
    username: 'GirishNYBinfotech',
    githubUrl: 'https://github.com/GirishNYBinfotech',
    defaultRepo: 'NYB_INFOTECH',
    batchNumber: '3',
  },
  'Sana Sulthana': {
    traineeName: 'Sana Sulthana',
    username: 'SanaSulthana2325',
    githubUrl: 'https://github.com/SanaSulthana2325',
    defaultRepo: 'NYB',
    batchNumber: '3',
  },
  'Tejaswar Rao': {
    traineeName: 'Tejaswar Rao',
    username: 'Teja1911',
    githubUrl: 'https://github.com/Teja1911',
    defaultRepo: 'NYB',
    batchNumber: '3',
  },
};

export const BATCH_4_GITHUB_MAPPINGS: Record<string, TraineeGithubConfig> = {
  'Jose Amala Kishor': {
    traineeName: 'Jose Amala Kishor',
    username: 'JoseAmalaKishor007',
    githubUrl: 'https://github.com/JoseAmalaKishor007/NYB_DailyTask',
    defaultRepo: 'NYB_DailyTask',
    batchNumber: '4',
  },
  'Nikhil Kumar Kurapati': {
    traineeName: 'Nikhil Kumar Kurapati',
    username: 'nikhil3454',
    githubUrl: 'https://github.com/nikhil3454/NYB_Infotech_FrontEnd',
    defaultRepo: 'NYB_Infotech_FrontEnd',
    batchNumber: '4',
  },
  'Ramesh Kumar A': {
    traineeName: 'Ramesh Kumar A',
    username: 'Ramesh-kumar109',
    githubUrl: 'https://github.com/Ramesh-kumar109/NYB_daliy_task',
    defaultRepo: 'NYB_daliy_task',
    batchNumber: '4',
  },
  'Adithya Ram': {
    traineeName: 'Adithya Ram',
    username: 'AdithyaRamDarisi',
    githubUrl: 'https://github.com/AdithyaRamDarisi/React2',
    defaultRepo: 'React2',
    batchNumber: '4',
  },
  'Adinarayana Meesala': {
    traineeName: 'Adinarayana Meesala',
    username: 'adinarayanameesala6304',
    githubUrl: 'https://github.com/adinarayanameesala6304',
    defaultRepo: 'Daily_Basis_React',
    batchNumber: '4',
  },
  'Snehith Reddy Challa': {
    traineeName: 'Snehith Reddy Challa',
    username: 'SnehithReddy',
    githubUrl: 'https://github.com/SnehithReddy',
    defaultRepo: 'NYB',
    batchNumber: '4',
  },
  'Sruthi Badavath': {
    traineeName: 'Sruthi Badavath',
    username: 'sruthibadavath',
    githubUrl: 'https://github.com/sruthibadavath',
    defaultRepo: 'NYB',
    batchNumber: '4',
  },
};

export const ALL_TRAINEE_GITHUB_MAPPINGS: Record<string, TraineeGithubConfig> = {
  ...BATCH_3_GITHUB_MAPPINGS,
  ...BATCH_4_GITHUB_MAPPINGS,
};

/**
 * Retrieve GitHub mapping by trainee name and optional batch
 */
export function getTraineeGithubInfo(name: string, batch?: string): TraineeGithubConfig | null {
  if (!name) return null;
  const normalized = name.trim().toLowerCase();

  const searchPool =
    batch === '4'
      ? BATCH_4_GITHUB_MAPPINGS
      : batch === '3'
      ? BATCH_3_GITHUB_MAPPINGS
      : ALL_TRAINEE_GITHUB_MAPPINGS;

  for (const [key, config] of Object.entries(searchPool)) {
    if (
      key.toLowerCase() === normalized ||
      normalized.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(normalized)
    ) {
      return config;
    }
  }

  // Fallback to checking all mappings if batch-specific lookup didn't match
  if (batch) {
    for (const [key, config] of Object.entries(ALL_TRAINEE_GITHUB_MAPPINGS)) {
      if (
        key.toLowerCase() === normalized ||
        normalized.includes(key.toLowerCase()) ||
        key.toLowerCase().includes(normalized)
      ) {
        return config;
      }
    }
  }

  return null;
}
