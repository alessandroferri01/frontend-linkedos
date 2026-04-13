import type { AuthResponse, Post, ApiResponse, GeneratePostRequest, User, PaginatedPosts, PostsQuery, AIProfile, LinkedInStatus, LinkedInPostStats } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Email o password non corretti',
  EMAIL_EXISTS: 'Questa email è già registrata',
  UNAUTHORIZED: 'Accesso non autorizzato',
  USER_NOT_FOUND: 'Utente non trovato',
  FORBIDDEN: 'Non hai i permessi per questa operazione',
  NOT_FOUND: 'Risorsa non trovata',
  BAD_REQUEST: 'Richiesta non valida',
  NO_CREDITS: 'Crediti esauriti. Passa al piano Pro per continuare',
  TOO_MANY_REQUESTS: 'Troppe richieste. Riprova tra qualche minuto',
  VALIDATION_ERROR: 'Dati inseriti non validi',
  INTERNAL_ERROR: 'Errore del server. Riprova più tardi',
  CONFLICT: 'Operazione in conflitto. Riprova',
};

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function getErrorMessage(error: { message: string; code: string } | null, status: number): string {
  if (error?.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }
  if (error?.message) {
    return error.message;
  }
  if (status === 429) return ERROR_MESSAGES.TOO_MANY_REQUESTS;
  if (status >= 500) return ERROR_MESSAGES.INTERNAL_ERROR;
  return `Errore imprevisto (${status})`;
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

  // On 401, redirect to login ONLY for non-auth endpoints
  const isAuthEndpoint = endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/register');
  if (res.status === 401 && !isAuthEndpoint) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sessione scaduta');
  }

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(getErrorMessage(json.error, res.status));
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

    async getAIProfile(): Promise<AIProfile> {
      return request<AIProfile>('/auth/ai-profile');
    },

    async updateAIProfile(data: { profession?: string; tone?: string; targetAudience?: string; writingStyle?: string }): Promise<AIProfile> {
      return request<AIProfile>('/auth/ai-profile', {
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

  linkedin: {
    async connect(): Promise<{ url: string }> {
      return request<{ url: string }>('/linkedin/connect');
    },

    async disconnect(): Promise<{ disconnected: boolean }> {
      return request<{ disconnected: boolean }>('/linkedin/disconnect', {
        method: 'DELETE',
      });
    },

    async status(): Promise<LinkedInStatus> {
      return request<LinkedInStatus>('/linkedin/status');
    },

    async publishPost(postId: string): Promise<{ linkedinPostUrn: string }> {
      return request<{ linkedinPostUrn: string }>(`/linkedin/publish/${postId}`, {
        method: 'POST',
      });
    },

    async getPostStats(postId: string): Promise<LinkedInPostStats> {
      return request<LinkedInPostStats>(`/linkedin/stats/${postId}`);
    },
  },
};
