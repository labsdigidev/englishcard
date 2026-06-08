import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials later.
// You can find these in your Supabase Dashboard -> Project Settings -> API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

/* 
DATABASE SCHEMA REQUIRED:

1. Table: categories
   - id: uuid (primary key)
   - name: text
   - iconUrl: text
   - colorTheme: text
   - borderColor: text

2. Table: flashcards
   - id: uuid (primary key)
   - category_id: uuid (foreign key -> categories.id)
   - frontText: text
   - backText: text
   - emoji: text
   - imageUrl: text
   - audioUrl: text
   - exampleSentence: text
   - exampleTranslation: text

3. Table: user_progress
   - id: uuid (primary key)
   - user_id: uuid (foreign key -> auth.users.id)
   - category_id: uuid (foreign key -> categories.id)
   - score: integer
*/
