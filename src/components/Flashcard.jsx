import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, RotateCcw } from 'lucide-react';

export default function Flashcard({ card, isQuizMode, onCorrectAnswer }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [guess, setGuess] = useState("");

  const handleFlip = () => {
    if (!isQuizMode) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAudio = (e) => {
    e.stopPropagation();
    // Placeholder for audio playback
    const utterance = new SpeechSynthesisUtterance(card.frontText);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const checkAnswer = () => {
    if (guess.toLowerCase().trim() === card.frontText.toLowerCase()) {
      setIsFlipped(true); // reveal
      if (onCorrectAnswer) onCorrectAnswer();
    } else {
      import('../lib/audio').then(m => m.audioController.playWrongVoice());
      alert("Oops! Coba lagi ya!");
    }
  };

  return (
    <div className="w-80 md:w-96 h-[26rem] md:h-[32rem] perspective-1000 relative">
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        onClick={handleFlip}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of Card (Image) */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-[2rem] shadow-xl border-b-8 border-r-8 border-gray-200 p-6 flex flex-col items-center justify-between">
          <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            Card
          </div>
          
          <div className="flex-1 flex items-center justify-center w-full mt-8">
            {card.imageUrl ? (
              <img src={card.imageUrl} alt="Flashcard" className="max-w-full max-h-48 md:max-h-64 object-contain rounded-2xl drop-shadow-md" />
            ) : (
              <div className="w-48 md:w-64 h-48 md:h-64 bg-gray-100 rounded-3xl flex items-center justify-center text-7xl md:text-8xl shadow-inner border-4 border-white">
                {card.emoji || '❓'}
              </div>
            )}
          </div>

          {isQuizMode && !isFlipped ? (
            <div className="w-full mt-4 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
              <input 
                type="text" 
                value={guess}
                onChange={e => setGuess(e.target.value)}
                placeholder="Apa ini bahasa Inggrisnya?"
                className="w-full bg-gray-100 rounded-xl p-3 font-bold text-center border-2 border-gray-200 focus:border-secondary outline-none"
              />
              <button 
                onClick={checkAnswer}
                className="bg-accent text-orange-800 font-bold py-3 rounded-xl hover:bg-yellow-400 active:translate-y-1 transition-transform border-b-4 border-orange-300"
              >
                Cek Jawaban
              </button>
            </div>
          ) : (
            <div className="w-full text-center mt-4">
              <p className="text-gray-400 font-bold mb-2">Tap to flip!</p>
            </div>
          )}
        </div>

        {/* Back of Card (Word & Translation) */}
        <div 
          className="absolute w-full h-full backface-hidden bg-primary rounded-[2rem] shadow-xl border-b-8 border-r-8 border-red-600 p-6 flex flex-col items-center justify-center"
          style={{ transform: 'rotateY(180deg)' }}
        >
           <h2 className="text-6xl md:text-7xl font-black text-white tracking-tight mb-2 drop-shadow-md">{card.frontText}</h2>
           <p className="text-2xl md:text-3xl text-red-100 font-bold mb-8 bg-black/10 px-4 py-2 rounded-full">{card.backText}</p>
           
           <button 
             onClick={handleAudio}
             className="bg-white hover:bg-gray-100 text-primary p-4 rounded-full shadow-lg transition-colors w-20 h-20 flex items-center justify-center mx-auto border-b-4 border-gray-300 active:border-b-0 active:translate-y-1"
           >
             <PlayCircle size={40} fill="currentColor" className="text-primary" />
           </button>

           {card.exampleSentence && (
             <div className="mt-8 bg-black/20 p-4 rounded-2xl w-full text-center">
                <p className="text-white font-bold text-lg">"{card.exampleSentence}"</p>
                <p className="text-red-200 text-sm">{card.exampleTranslation}</p>
             </div>
           )}
        </div>
      </motion.div>
    </div>
  );
}
