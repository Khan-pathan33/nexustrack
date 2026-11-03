/**
 * Authoritative GitHub Profile & Repository Mapping for Active Trainees
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

/**
 * Retrieve GitHub mapping by trainee name (case & whitespace insensitive)
 */
export function getTraineeGithubInfo(name: string): TraineeGithubConfig | null {
  if (!name) return null;
  const normalized = name.trim().toLowerCase();
  for (const [key, config] of Object.entries(BATCH_3_GITHUB_MAPPINGS)) {
    if (key.toLowerCase() === normalized || normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
      return config;
    }
  }
  return null;
}
