export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  subscriptionStatus: 'FREE' | 'ACTIVE' | 'PAST_DUE';
  creditsRemaining: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AIProfile {
  profession: string | null;
  tone: string | null;
  targetAudience: string | null;
  writingStyle: string | null;
}

export interface GeneratePostRequest {
  topic: string;
  length?: 'short' | 'medium' | 'long';
}

export interface Post {
  id: string;
  userId: string;
  topic: string;
  generatedContent: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedPosts {
  posts: Post[];
  pagination: Pagination;
}

export interface PostsQuery {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'topic';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
