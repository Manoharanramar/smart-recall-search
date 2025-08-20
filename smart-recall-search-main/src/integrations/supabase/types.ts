export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      caregiver_access: {
        Row: {
          access_level: string | null
          caregiver_id: string
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          patient_id: string
        }
        Insert: {
          access_level?: string | null
          caregiver_id: string
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          patient_id: string
        }
        Update: {
          access_level?: string | null
          caregiver_id?: string
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          patient_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          is_acknowledged: boolean | null
          person_id: string | null
          severity: string | null
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          is_acknowledged?: boolean | null
          person_id?: string | null
          severity?: string | null
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          is_acknowledged?: boolean | null
          person_id?: string | null
          severity?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          content: string
          content_type: string | null
          created_at: string
          id: string
          metadata: Json | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          content_type?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          content_type?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      memory_prompts: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          is_completed: boolean | null
          is_recurring: boolean | null
          person_id: string | null
          priority: string | null
          prompt_type: string | null
          recurrence_pattern: string | null
          scheduled_at: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          is_recurring?: boolean | null
          person_id?: string | null
          priority?: string | null
          prompt_type?: string | null
          recurrence_pattern?: string | null
          scheduled_at?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          is_recurring?: boolean | null
          person_id?: string | null
          priority?: string | null
          prompt_type?: string | null
          recurrence_pattern?: string | null
          scheduled_at?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_prompts_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          created_at: string | null
          description: string | null
          email: string | null
          face_embeddings: Json | null
          id: string
          is_active: boolean | null
          last_seen: string | null
          name: string
          phone: string | null
          photo_url: string | null
          relationship: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          email?: string | null
          face_embeddings?: Json | null
          id?: string
          is_active?: boolean | null
          last_seen?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          relationship?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          email?: string | null
          face_embeddings?: Json | null
          id?: string
          is_active?: boolean | null
          last_seen?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          relationship?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          full_name: string | null
          id: string
          medical_info: string | null
          phone: string | null
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string | null
          id: string
          medical_info?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string | null
          id?: string
          medical_info?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      search_queries: {
        Row: {
          created_at: string
          id: string
          query_fragments: Json | null
          query_text: string
          search_context: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          query_fragments?: Json | null
          query_text: string
          search_context?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          query_fragments?: Json | null
          query_text?: string
          search_context?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      search_results: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          processing_time_ms: number | null
          query_id: string | null
          result_data: Json
          result_type: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          processing_time_ms?: number | null
          query_id?: string | null
          result_data?: Json
          result_type?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          processing_time_ms?: number | null
          query_id?: string | null
          result_data?: Json
          result_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_results_query_id_fkey"
            columns: ["query_id"]
            isOneToOne: false
            referencedRelation: "search_queries"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_interactions: {
        Row: {
          audio_url: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          interaction_type: string | null
          metadata: Json | null
          person_id: string | null
          question: string | null
          response: string | null
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          interaction_type?: string | null
          metadata?: Json | null
          person_id?: string | null
          question?: string | null
          response?: string | null
          user_id: string
        }
        Update: {
          audio_url?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          interaction_type?: string | null
          metadata?: Json | null
          person_id?: string | null
          question?: string | null
          response?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_interactions_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
