export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          title: string
          start_time: string
          end_time: string
          priority: number
          status: 'pending' | 'finished'
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          start_time: string
          end_time: string
          priority: number
          status?: 'pending' | 'finished'
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          start_time?: string
          end_time?: string
          priority?: number
          status?: 'pending' | 'finished'
          created_at?: string
          user_id?: string
        }
      }
    }
  }
}