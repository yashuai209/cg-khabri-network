export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  category: string;
  is_featured: number;
  tags?: string;
  seo_title?: string;
  seo_description?: string;
  sponsor_name?: string;
  sponsor_link?: string;
  sponsor_image?: string;
  external_link?: string;
  views?: number;
  likes?: number;
  shares?: number;
  clicks?: number;
  comment_count?: number;
  created_at: string;
}

export type Category = 'State' | 'National' | 'Sports' | 'Technology' | 'Entertainment';

export const CATEGORIES: Category[] = ['State', 'National', 'Sports', 'Technology', 'Entertainment'];
