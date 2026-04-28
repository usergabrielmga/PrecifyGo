import { type LoginResponse, type RegisterResponse, type User } from '../types/user';

export const registerUser = async (
  userData: Omit<User, 'id'>
): Promise<RegisterResponse> => {
  const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error('Erro ao registrar usuário')
  }

  return response.json() 
}


export const LoginUser = async (
  userData: { email: string; senha: string }
): Promise<LoginResponse> => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error('Erro no login')
  }

  return response.json() 
}



export const loginGoogle = async (accessToken: string) => {
  const response = await fetch('http://localhost:3000/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ accessToken }) 
  })

  if (!response.ok) {
    throw new Error('Erro no login com Google')
  }

  return response.json()
}
