export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
    timeZone:string
  }
  