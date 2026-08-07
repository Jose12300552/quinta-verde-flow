export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      sectores: {
        Row: {
          id: string
          nombre: string
          duracion_minutos: number
          color: string
          descripcion: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          duracion_minutos: number
          color?: string
          descripcion?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          duracion_minutos?: number
          color?: string
          descripcion?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      horarios_riego: {
        Row: {
          id: string
          sector_id: string
          dia_semana: number
          hora_inicio: number
          minuto_inicio: number
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sector_id: string
          dia_semana: number
          hora_inicio: number
          minuto_inicio?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sector_id?: string
          dia_semana?: number
          hora_inicio?: number
          minuto_inicio?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "horarios_riego_sector_id_fkey"
            columns: ["sector_id"]
            referencedRelation: "sectores"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
