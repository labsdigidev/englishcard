import fs from 'fs';
import { MOCK_CATEGORIES, MOCK_CARDS } from '../src/lib/mockData.js';

let sql = `-- ==========================================
-- SUPABASE INITIALIZATION SQL SCRIPT
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "iconUrl" TEXT,
    "colorTheme" TEXT,
    "borderColor" TEXT
);

-- 2. Create Flashcards Table
CREATE TABLE IF NOT EXISTS flashcards (
    id SERIAL PRIMARY KEY,
    category_id TEXT REFERENCES categories(id),
    "frontText" TEXT NOT NULL,
    "backText" TEXT NOT NULL,
    emoji TEXT,
    "imageUrl" TEXT,
    "audioUrl" TEXT,
    "exampleSentence" TEXT,
    "exampleTranslation" TEXT
);

-- 3. Insert Categories
INSERT INTO categories (id, name, "iconUrl", "colorTheme", "borderColor") VALUES
`;

const catValues = MOCK_CATEGORIES.map(c => 
  `('${c.id}', '${c.name}', '${c.iconUrl}', '${c.colorTheme}', '${c.borderColor}')`
).join(',\n');

sql += catValues + ' ON CONFLICT (id) DO NOTHING;\n\n';
sql += '-- 4. Insert Flashcards\nINSERT INTO flashcards (category_id, "frontText", "backText", emoji, "imageUrl", "exampleSentence", "exampleTranslation") VALUES\n';

const cardValues = [];
for (const [categoryId, cards] of Object.entries(MOCK_CARDS)) {
  for (const card of cards) {
    const frontText = card.frontText.replace(/'/g, "''");
    const backText = card.backText.replace(/'/g, "''");
    const emoji = card.emoji ? `'${card.emoji}'` : 'NULL';
    const imageUrl = card.imageUrl ? `'${card.imageUrl}'` : 'NULL';
    const sentence = card.exampleSentence ? `'${card.exampleSentence.replace(/'/g, "''")}'` : 'NULL';
    const translation = card.exampleTranslation ? `'${card.exampleTranslation.replace(/'/g, "''")}'` : 'NULL';
    
    cardValues.push(`('${categoryId}', '${frontText}', '${backText}', ${emoji}, ${imageUrl}, ${sentence}, ${translation})`);
  }
}

sql += cardValues.join(',\n') + ';\n';

fs.writeFileSync('seed.sql', sql);
console.log('Successfully generated seed.sql');
