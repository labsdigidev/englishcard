import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DinoTugOfWar from '../components/DinoTugOfWar';
import { audioController } from '../lib/audio';

// Helper to shuffle array
const shuffle = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

export default function DinoVsPage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Game State
  const [ropePosition, setRopePosition] = useState(0); // -5 (A wins) to +5 (B wins)
  const [currentCard, setCurrentCard] = useState(null);
  const [optionsA, setOptionsA] = useState([]);
  const [optionsB, setOptionsB] = useState([]);
  
  const [wrongAnswerA, setWrongAnswerA] = useState(null);
  const [wrongAnswerB, setWrongAnswerB] = useState(null);
  const [winner, setWinner] = useState(null);

  // Fetch all flashcards
  useEffect(() => {
    async function fetchCards() {
      try {
        const { data, error } = await supabase.from('flashcards').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
            setCards(data);
        }
      } catch (err) {
        console.error('Error fetching cards:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  // Generate new round
  const generateRound = (allCards) => {
      if (!allCards || allCards.length === 0) return;
      
      const targetCard = allCards[Math.floor(Math.random() * allCards.length)];
      setCurrentCard(targetCard);

      // Get 3 random wrong answers
      const wrongCards = shuffle(allCards.filter(c => c.id !== targetCard.id)).slice(0, 3);
      
      const optsA = shuffle([targetCard, ...wrongCards]);
      const optsB = shuffle([targetCard, ...wrongCards]);
      
      setOptionsA(optsA);
      setOptionsB(optsB);
      setWrongAnswerA(null);
      setWrongAnswerB(null);
  };

  // Start game when cards load
  useEffect(() => {
      if (cards.length > 0 && !currentCard && !winner) {
          generateRound(cards);
      }
  }, [cards, currentCard, winner]);

  // Handlers
  const handleAnswerA = (answerText) => {
      if (winner) return;
      if (answerText === currentCard.frontText) {
          // Correct! A pulls left (-)
          audioController.playCorrect();
          const newPos = ropePosition - 1;
          setRopePosition(newPos);
          if (newPos <= -5) {
              setWinner('TIM A');
          } else {
              generateRound(cards);
          }
      } else {
          // Wrong! Penalty: rope pulled to B (+)
          setWrongAnswerA(answerText);
          const newPos = ropePosition + 1;
          setRopePosition(newPos);
          if (newPos >= 5) {
              setWinner('TIM B');
          }
          setTimeout(() => setWrongAnswerA(null), 500);
      }
  };

  const handleAnswerB = (answerText) => {
      if (winner) return;
      if (answerText === currentCard.frontText) {
          // Correct! B pulls right (+)
          audioController.playCorrect();
          const newPos = ropePosition + 1;
          setRopePosition(newPos);
          if (newPos >= 5) {
              setWinner('TIM B');
          } else {
              generateRound(cards);
          }
      } else {
          // Wrong! Penalty: rope pulled to A (-)
          setWrongAnswerB(answerText);
          const newPos = ropePosition - 1;
          setRopePosition(newPos);
          if (newPos <= -5) {
              setWinner('TIM A');
          }
          setTimeout(() => setWrongAnswerB(null), 500);
      }
  };

  const restartGame = () => {
      setRopePosition(0);
      setWinner(null);
      generateRound(cards);
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-bold animate-pulse text-2xl h-screen flex items-center justify-center">Memuat Game...</div>;
  if (cards.length < 4) return <div className="p-10 text-center font-bold">Kartu tidak cukup untuk dimainkan.</div>;

  return (
    <div className="fixed inset-0 bg-background overflow-hidden flex flex-col">
      {/* Small Header */}
      <div className="absolute top-4 left-4 z-50">
        <button 
           onClick={() => navigate('/')}
           className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md text-gray-600 font-bold hover:bg-white transition-colors"
        >
           🏠 Kembali
        </button>
      </div>

      {winner ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-sky-100 z-50">
              <h1 className="text-6xl font-black mb-4 drop-shadow-lg text-gray-800">
                  🎉 {winner} MENANG! 🎉
              </h1>
              <p className="text-2xl text-gray-600 mb-8 font-bold">Tarikan yang luar biasa!</p>
              <button 
                 onClick={restartGame}
                 className="bg-accent text-orange-900 font-black text-3xl px-12 py-6 rounded-full shadow-xl border-b-8 border-orange-300 hover:bg-yellow-400 active:border-b-0 active:translate-y-2 transition-all"
              >
                 MAIN LAGI 🔄
              </button>
          </div>
      ) : (
          <DinoTugOfWar 
             ropePosition={ropePosition}
             currentCard={currentCard}
             optionsA={optionsA}
             optionsB={optionsB}
             onAnswerA={handleAnswerA}
             onAnswerB={handleAnswerB}
             wrongAnswerA={wrongAnswerA}
             wrongAnswerB={wrongAnswerB}
          />
      )}
    </div>
  );
}
