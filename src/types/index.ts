export interface User {
  id: string;
  email: string;
  subscriptionStatus: 'FREE' | 'ACTIVE' | 'PAST_DUE';
  creditsRemaining: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GeneratePostRequest {
  topic: string;
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

export interface ApiError {
  message: string;
  statusCode: number;
}
