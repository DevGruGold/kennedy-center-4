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
      artworks: {
        Row: {
          created_at: string
          creator_id: string | null
          description: string | null
          id: string
          image_url: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          image_url: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          image_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          last_contacted: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          last_contacted?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          last_contacted?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      debate_responses: {
        Row: {
          ai_name: string
          created_at: string
          id: string
          response: string
          topic: string
        }
        Insert: {
          ai_name: string
          created_at?: string
          id?: string
          response: string
          topic: string
        }
        Update: {
          ai_name?: string
          created_at?: string
          id?: string
          response?: string
          topic?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string
          created_at: string
          customer_id: string
          id: string
          metadata: Json | null
          signed_at: string | null
          status: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          customer_id: string
          id?: string
          metadata?: Json | null
          signed_at?: string | null
          status?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          customer_id?: string
          id?: string
          metadata?: Json | null
          signed_at?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          content: string
          created_at: string
          customer_id: string
          id: string
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          content: string
          created_at?: string
          customer_id: string
          id?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          content?: string
          created_at?: string
          customer_id?: string
          id?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      historical_figures: {
        Row: {
          created_at: string
          description: string
          era: string
          id: string
          image_url: string
          name: string
          nationality: string
          prompt: string
          role: string
          updated_at: string
          voice_id: string
        }
        Insert: {
          created_at?: string
          description: string
          era: string
          id?: string
          image_url: string
          name: string
          nationality: string
          prompt: string
          role: string
          updated_at?: string
          voice_id: string
        }
        Update: {
          created_at?: string
          description?: string
          era?: string
          id?: string
          image_url?: string
          name?: string
          nationality?: string
          prompt?: string
          role?: string
          updated_at?: string
          voice_id?: string
        }
        Relationships: []
      }
      interactions: {
        Row: {
          completed_at: string | null
          created_at: string
          customer_id: string
          details: string | null
          id: string
          scheduled_at: string | null
          summary: string
          type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          customer_id: string
          details?: string | null
          id?: string
          scheduled_at?: string | null
          summary: string
          type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          customer_id?: string
          details?: string | null
          id?: string
          scheduled_at?: string | null
          summary?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          key_name: string
          key_value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_name: string
          key_value: string
        }
        Update: {
          created_at?: string
          id?: string
          key_name?: string
          key_value?: string
        }
        Relationships: []
      }
      tokens: {
        Row: {
          artwork_id: string
          blockchain_status: string
          contract_address: string
          created_at: string
          id: string
          owner_id: string | null
          token_metadata: Json | null
          token_uri: string
          transaction_hash: string | null
          updated_at: string
        }
        Insert: {
          artwork_id: string
          blockchain_status?: string
          contract_address: string
          created_at?: string
          id?: string
          owner_id?: string | null
          token_metadata?: Json | null
          token_uri: string
          transaction_hash?: string | null
          updated_at?: string
        }
        Update: {
          artwork_id?: string
          blockchain_status?: string
          contract_address?: string
          created_at?: string
          id?: string
          owner_id?: string | null
          token_metadata?: Json | null
          token_uri?: string
          transaction_hash?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tokens_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
