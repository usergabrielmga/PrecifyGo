export interface User {
  name?: string;
  email: string;
  password: string;
}

export type LoginResponse = {
  data: any;
  token: string
}


export type RegisterResponse = {
  token(arg0: string, token: any): unknown;
  message: string
}
