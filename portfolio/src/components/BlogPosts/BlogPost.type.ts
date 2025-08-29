export interface Category {
  id: number;
  name: string;
}

export interface BlogPost {
  id: number;
  author: string;
  title: string;
  excerpt: string;
  readTime?: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  image?: string;
  slug?: string;
  publishedAt: string;
  updatedAt?: string;
}

export interface BlogPostProps {
  title?: string;
  subtitle?: string;
  maxPosts?: number;
  showFeatured?: boolean;
  showCategories?: boolean;
}
