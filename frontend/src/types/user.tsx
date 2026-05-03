export interface User {
  name?: string;
  email: string;
  password: string;
}

export type LoginResponse = {
  token: string
}


export type RegisterResponse = {
  token(arg0: string, token: any): unknown;
  message: string
}
