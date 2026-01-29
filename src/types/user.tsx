export interface User {
  nome?: string;
  email: string;
  senha: string;
}

export type LoginResponse = {
  token: string
}


export type RegisterResponse = {
  message: string
}
