import configData from '../../config.json';

export interface SiteConfig {
  site: {
    name: string;
    description: string;
    heroImage: string;
  };
  social: {
    x: string;
    bluesky: string;
    linkedin: string;
    youtube: string;
    facebook: string;
    instagram: string;
  };
}

export const config: SiteConfig = configData;