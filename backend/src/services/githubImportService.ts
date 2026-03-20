import axios from 'axios';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export interface GithubImportResult {
  name: string;
  description: string;
  repoUrl: string;
  stars: number;
  licenseName: string;
  licenseUrl: string;
  homepage: string;
  developerName: string;
  releaseDate: Date;
}

export const importGithubGame = async (repoFullName: string): Promise<GithubImportResult> => {
  const headers = env.githubToken ? { Authorization: `Bearer ${env.githubToken}` } : undefined;
  const { data } = await axios.get(`https://api.github.com/repos/${repoFullName}`, { headers });

  const licenseKey = data.license?.key?.toLowerCase?.() ?? '';
  const allowedLicenses = ['mit', 'apache-2.0', 'bsd-3-clause', 'bsd-2-clause', 'mpl-2.0'];
  if (!allowedLicenses.includes(licenseKey)) {
    throw new ApiError(400, 'Repository license is not eligible for commercial portal embedding');
  }

  return {
    name: data.name,
    description: data.description ?? 'Imported HTML5 game from GitHub.',
    repoUrl: data.html_url,
    stars: data.stargazers_count,
    licenseName: data.license?.spdx_id ?? 'Unknown',
    licenseUrl: data.html_url + '/blob/main/LICENSE',
    homepage: data.homepage || data.html_url,
    developerName: data.owner?.login ?? 'Open Source Developer',
    releaseDate: new Date(data.pushed_at)
  };
};
