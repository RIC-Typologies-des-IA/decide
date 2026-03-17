export interface UserSession {
  userId: string;
  email: string;
  name: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  session?: UserSession;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirm {
  token: string;
  newPassword: string;
}

const API_BASE = '/api/auth';

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Une erreur est survenue');
  }
  
  return data;
}

export const api = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  logout: async (): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleResponse<{ success: boolean }>(response);
  },

  me: async (): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/me`, {
      credentials: 'include',
    });
    return handleResponse<AuthResponse>(response);
  },

  requestReset: async (email: string): Promise<{ success: boolean; message?: string }> => {
    const response = await fetch(`${API_BASE}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    // Always return success to not reveal email existence
    if (response.ok) {
      return { success: true, message: 'Si cet email existe, vous recevrez un lien de réinitialisation' };
    }
    return { success: true, message: 'Si cet email existe, vous recevrez un lien de réinitialisation' };
  },

  confirmReset: async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch(`${API_BASE}/reset-password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token, newPassword }),
    });
    return handleResponse<{ success: boolean; error?: string }>(response);
  },
};

export default api;
