// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://awozuursgyowogkquzlz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b3p1dXJzZ3lvd29na3F1emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTg0MDIsImV4cCI6MjA2MjE3NDQwMn0.h7I5em6E0zea1tlvZXmOAZr01uloQyUAdeQ5kEFjx8I";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);