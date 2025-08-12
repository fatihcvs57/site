export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

export interface Project {
  id: number;
  title: string;
  theme: string;
}
