import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
// You can find these in your Supabase project settings under API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types matching your database schema
export interface Spot {
  id: number;
  name: string;
  address: string;
  position: {
    lat: number;
    lng: number;
  };
  image: string;
  rating: number;
  description: string;
  wifi: boolean;
  food: boolean;
  popularity: number;
  nearness: number;
  review_count: number;
  tagline: string;
  atmosphere_rating: number;
  wifi_rating: number;
  outlet_access_rating: number;
  food_beverage_rating: number;
  table_space_rating: number;
  preview_images?: string[];
  created_at?: string;
}

export interface SavedSpot {
  id: string;
  spot_id: number;
  spot_name: string;
  address: string;
  rating: number;
  image: string;
  created_at?: string;
}

export interface Review {
  id: string;
  spot_id: number;
  spot_name: string;
  ratings: {
    atmosphere: number;
    wifi: number;
    outletAccess: number;
    foodBeverage: number;
    tableSpace: number;
  };
  review_text: string;
  timestamp: string;
}
