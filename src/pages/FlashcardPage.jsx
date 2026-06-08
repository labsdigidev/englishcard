import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import SentenceBuilder from '../components/SentenceBuilder';
import { audioController } from '../lib/audio';
import { supabase } from '../lib/supabase';

export default function FlashcardPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState('learn'); // 'learn', 'quiz', 'sentence'
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function fetchCards() {
      try {
        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('category_id', categoryId);
          
        if (error) throw error;
        if (data) setCards(data);
      } catch (err) {
        console.error('Error fetching cards:', err);
      } finally {
        setLoading(false);
      }
    }
    if (categoryId) fetchCards();
  }, [categoryId]);

  if (loading) return <div className="p-10 text-center text-gray-500 font-bold animate-pulse">Loading Cards...</div>;
  if (cards.length === 0) return <div className="p-10 text-center">Category not found or empty</div>;

  const currentCard = cards[currentIndex];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    if (mode === 'sentence') setMode('learn'); // reset mode on next card
  };

  const handleCorrectAnswer = () => {
    audioController.playCorrect();
    setScore(s => s + 10);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center bg-white rounded-3xl p-4 shadow-sm border-4 border-white/50 mb-8">
        <button onClick={() => navigate('/')} className="font-bold text-gray-500 hover:text-primary">
          ⬅ Kembali
        </button>
        <div className="flex gap-2">
            <button 
                onClick={() => setMode('learn')}
                className={`px-4 py-2 rounded-full font-bold transition-colors ${mode === 'learn' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
                Learn
            </button>
            <button 
                onClick={() => setMode('quiz')}
                className={`px-4 py-2 rounded-full font-bold transition-colors ${mode === 'quiz' ? 'bg-accent text-orange-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
                Quiz
            </button>
            <button 
                onClick={() => setMode('sentence')}
                className={`px-4 py-2 rounded-full font-bold transition-colors ${mode === 'sentence' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
                Sentence
            </button>
        </div>
        <div className="bg-accent px-4 py-2 rounded-full font-bold text-orange-800 shadow-sm border-2 border-orange-200">
          Score: {score} 🌟
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full">
        {mode !== 'sentence' ? (
          <Flashcard 
              key={`${currentCard.id}-${mode}`} 
              card={currentCard} 
              isQuizMode={mode === 'quiz'}
              onCorrectAnswer={handleCorrectAnswer}
          />
        ) : (
          <SentenceBuilder 
              key={`${currentCard.id}-sentence`}
              sentence={currentCard.exampleSentence} 
              translation={currentCard.exampleTranslation}
              onComplete={handleCorrectAnswer}
          />
        )}

        <div className="mt-8 flex gap-4">
            <button 
                onClick={nextCard}
                className="bg-white text-gray-800 font-black text-xl px-8 py-4 rounded-full shadow-md border-b-4 border-gray-200 hover:bg-gray-50 active:translate-y-1 active:border-b-0 transition-all"
            >
                Kartu Selanjutnya ➡
            </button>
        </div>
      </main>
    </div>
  );
}
