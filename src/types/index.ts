export interface Program {
  id: string;
  title: string;
  badge: string;
  shortDescription: string;
  fullDescription: string;
  impactTarget: string;
  iconName: string;
  sdgAlignment: number[];
  highlights: string[];
  category: 'education' | 'tech' | 'entrepreneurship' | 'health' | 'community';
  featured?: boolean;
  status?: 'active' | 'upcoming' | 'draft';
  displayOrder?: number;
  slug?: string;
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  location: string;
  category: 'executive' | 'mentor' | 'patron';
  bio?: string;
  organization?: string;
  avatarUrl: string;
  featured?: boolean;
}

export interface FocusArea {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'skills' | 'empowerment' | 'wellness' | 'governance';
}

export interface ImpactMetric {
  id: string;
  value: string;
  numberValue: number;
  label: string;
  unit: string;
  target2035: string;
  description: string;
  iconName: string;
}

export interface SDGGoal {
  id: number;
  code: string;
  title: string;
  description: string;
  color: string;
  iconName: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'events' | 'workshops' | 'vip_visits' | 'community' | 'awards';
  date: string;
  imageUrl: string;
  location: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  program: string;
  quote: string;
  avatarUrl: string;
  impactAchieved: string;
}

export interface IndustryExpertVideo {
  id: string;
  name: string;
  role: string;
  location: string;
  title: string;
  videoType?: 'youtube' | 'instagram';
  youtubeId?: string;
  youtubeUrl?: string;
  instagramCode?: string;
  instagramUrl?: string;
  thumbnailUrl?: string;
  avatarUrl: string;
  category: string;
  duration?: string;
}

export interface CMSNewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  coverImage: string;
}

export interface CMSProviderConfig {
  provider: 'mock' | 'strapi' | 'sanity' | 'contentful';
  endpoint?: string;
  apiKey?: string;
  isReady: boolean;
}

export interface VolunteerFormData {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  occupation: string;
  skills: string[];
  interestAreas: string[];
  weeklyHours: string;
  motivation: string;
}

export interface PartnerFormData {
  organizationName: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  organizationType: 'corporate_csr' | 'educational_institution' | 'ngo' | 'healthcare' | 'philanthropist' | 'other';
  website?: string;
  cityState: string;
  interestPrograms?: string[];
  proposedContribution: string;
  comments?: string;
}
