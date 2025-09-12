export interface User {
  id: number;
  email: string;
}

export interface App {
  id: number;
  user_id: number;
  name: string;
  winget_id?: string;
  download_url?: string;
  args?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface CreateAppRequest {
  name: string;
  winget_id?: string;
  download_url?: string;
  args?: string;
}

export interface UpdateAppRequest {
  name: string;
  winget_id?: string;
  download_url?: string;
  args?: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}

export interface SuccessResponse<T = any> {
  message: string;
  data?: T;
}

export interface WingetSearchResult {
  id: string;
  name: string;
  publisher?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}