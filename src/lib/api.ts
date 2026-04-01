import type { AuthResponse, Post, ApiResponse, GeneratePostRequest, User, PaginatedPosts, PostsQuery } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sessione scaduta');
  }

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || `Errore ${res.status}`);
  }

  return json.data;
}

export const api = {
  auth: {
    async login(email: string, password: string): Promise<AuthResponse> {
      const data = await request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      return data;
    },

    async register(email: string, password: string): Promise<AuthResponse> {
      const data = await request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      return data;
    },

    logout() {
      localStorage.removeItem('token');
      window.location.href = '/login';
    },

    async me(): Promise<User> {
      return request<User>('/auth/me');
    },

    async updateProfile(data: { firstName?: string; lastName?: string; phone?: string }): Promise<User> {
      return request<User>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  },

  posts: {
    async generate(input: GeneratePostRequest): Promise<Post> {
      return request<Post>('/posts/generate', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },

    async getAll(query?: PostsQuery): Promise<PaginatedPosts> {
      const params = new URLSearchParams();
      if (query?.page) params.set('page', String(query.page));
      if (query?.limit) params.set('limit', String(query.limit));
      if (query?.sortBy) params.set('sortBy', query.sortBy);
      if (query?.sortOrder) params.set('sortOrder', query.sortOrder);
      if (query?.search) params.set('search', query.search);
      const qs = params.toString();
      return request<PaginatedPosts>(`/posts${qs ? `?${qs}` : ''}`);
    },

    async getById(id: string): Promise<Post> {
      return request<Post>(`/posts/${id}`);
    },

    async delete(id: string): Promise<{ message: string }> {
      return request<{ message: string }>(`/posts/${id}`, {
        method: 'DELETE',
      });
    },
  },

  billing: {
    async createSession(): Promise<{ url: string }> {
      return request<{ url: string }>('/billing/create-session', {
        method: 'POST',
      });
    },

    async verifySubscription(): Promise<{ activated: boolean }> {
      return request<{ activated: boolean }>('/billing/verify-subscription', {
        method: 'POST',
      });
    },

    async cancelSubscription(): Promise<{ cancelled: boolean }> {
      return request<{ cancelled: boolean }>('/billing/cancel-subscription', {
        method: 'POST',
      });
    },
  },
};
