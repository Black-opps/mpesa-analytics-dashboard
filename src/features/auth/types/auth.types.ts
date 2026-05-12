export type UserRole = "owner" | "admin" | "analyst" | "viewer";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;

  user: User;
}

export interface AuthContextType {
  user: User | null;

  token: string | null;

  loading: boolean;

  isAuthenticated: boolean;

  login: (payload: LoginPayload) => Promise<void>;

  register: (payload: RegisterPayload) => Promise<void>;

  logout: () => void;
}
