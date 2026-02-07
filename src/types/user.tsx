export interface User {
  nome?: string;
  email: string;
  senha: string;
}

export type LoginResponse = {
  token: string
}


export type RegisterResponse = {
  token(arg0: string, token: any): unknown;
  message: string
}
