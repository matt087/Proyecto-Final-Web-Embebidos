export interface User {
    _id?: string;
    nombre: string;
    email: string;
    password1: string;
    password2: string;
    isAdmin: boolean;
    isOperator: boolean;
  }