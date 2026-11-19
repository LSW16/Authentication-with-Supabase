
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

const webStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(key);
  },

  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(key, value);
  },

  removeItem: async (key: string): Promise<void> => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(key);
  },
};

const authStorage =
  Platform.OS === 'web' ? webStorage : AsyncStorage;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: authStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
