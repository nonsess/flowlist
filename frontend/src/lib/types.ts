export type Task = {
  id: string
  title: string
  description: string | null
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}
  
export type User = {
  id: string
  username: string
  created_at: string
}
    
export type TokenResponse = {
  access_token: string
  token_type: string
}