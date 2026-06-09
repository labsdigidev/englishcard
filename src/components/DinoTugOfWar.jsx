import { motion } from 'framer-motion';

export default function DinoTugOfWar({ ropePosition, currentCard, optionsA, optionsB, onAnswerA, onAnswerB, wrongAnswerA, wrongAnswerB }) {
  // ropePosition goes from -5 (Tim A menang) to 5 (Tim B menang)
  // Max width translation can be roughly 40vw from center to edge.
  // Each step can be roughly 8vw.
  const ropeTranslation = `${ropePosition * 8}vw`;

  return (
    <div className="w-full h-full flex flex-col bg-sky-100 overflow-hidden relative select-none">
      
      {/* Top Section - Question Panels */}
      <div className="flex w-full justify-between px-4 md:px-8 mt-4 z-10 gap-4">
        {/* TIM A Panel */}
        <div className="flex-1 bg-white rounded-2xl shadow-md border-4 border-green-500 p-4 flex flex-col items-center relative">
          <span className="text-green-600 font-bold text-sm absolute top-2">TIM A</span>
          <div className="mt-6 mb-2 text-3xl font-black text-gray-800 text-center">
            "{currentCard?.backText}"
          </div>
          {currentCard?.imageUrl ? (
             <img src={currentCard.imageUrl} alt="Flashcard A" className="h-16 w-16 object-contain drop-shadow-md" />
          ) : (
             <div className="text-5xl drop-shadow-md">{currentCard?.emoji || '❓'}</div>
          )}
        </div>

        {/* VS text */}
        <div className="flex items-center justify-center font-black text-4xl text-blue-800 italic drop-shadow-sm">
          VS
        </div>

        {/* TIM B Panel */}
        <div className="flex-1 bg-white rounded-2xl shadow-md border-4 border-red-500 p-4 flex flex-col items-center relative">
          <span className="text-red-600 font-bold text-sm absolute top-2">TIM B</span>
          <div className="mt-6 mb-2 text-3xl font-black text-gray-800 text-center">
            "{currentCard?.backText}"
          </div>
          {currentCard?.imageUrl ? (
             <img src={currentCard.imageUrl} alt="Flashcard B" className="h-16 w-16 object-contain drop-shadow-md" />
          ) : (
             <div className="text-5xl drop-shadow-md">{currentCard?.emoji || '❓'}</div>
          )}
        </div>
      </div>

      {/* Middle Section - Tug of War Animation */}
      <div className="flex-1 relative w-full flex items-center justify-center mt-8">
        
        {/* Grass Background */}
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-green-400 to-green-300 rounded-t-full opacity-60 blur-md"></div>
        <div className="absolute bottom-0 w-full h-1/3 bg-green-500 rounded-t-[50%]"></div>

        {/* Center Marker Line (Win conditions limit) */}
        <div className="absolute h-full w-[2px] border-l-2 border-dashed border-gray-300 left-1/2 opacity-30"></div>

        {/* Rope container to animate */}
        <motion.div 
            className="absolute w-[200%] flex items-center justify-center"
            animate={{ x: ropeTranslation }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
            {/* The Rope */}
            <div className="w-full h-4 bg-orange-800 absolute z-0 shadow-sm border-y-2 border-orange-900"></div>

            {/* Dinos on the rope */}
            <div className="flex w-[100vw] justify-between px-20 z-10 relative">
               
               {/* Dino Tim A */}
               <div className="relative flex flex-col items-center transform -translate-x-10">
                  <span className="text-7xl drop-shadow-xl scale-x-[-1]">🦖</span>
                  <div className="mt-2 bg-green-200 text-green-800 px-4 py-1 rounded-full font-bold shadow-md border-2 border-green-400 text-xs whitespace-nowrap">
                    TIM A
                  </div>
               </div>

               {/* Center Knot */}
               <div className="w-6 h-6 rounded-full bg-yellow-400 border-4 border-white shadow-md z-20 absolute left-1/2 -ml-3 mt-[1.2rem]"></div>

               {/* Dino Tim B */}
               <div className="relative flex flex-col items-center transform translate-x-10">
                  <span className="text-7xl drop-shadow-xl">🦕</span>
                  <div className="mt-2 bg-red-200 text-red-800 px-4 py-1 rounded-full font-bold shadow-md border-2 border-red-400 text-xs whitespace-nowrap">
                    TIM B
                  </div>
               </div>

            </div>
        </motion.div>
      </div>

      {/* Bottom Section - Answer Buttons */}
      <div className="flex w-full pb-8 px-4 md:px-8 gap-4 z-10 bg-white/50 pt-4 border-t-4 border-white">
        
        {/* TIM A Buttons */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {optionsA.map((option, idx) => (
             <motion.button 
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAnswerA(option.frontText)}
                className={`py-6 px-2 rounded-2xl font-bold text-xl md:text-2xl shadow-sm border-b-4 
                  ${wrongAnswerA === option.frontText 
                     ? 'bg-red-500 text-white border-red-700' 
                     : 'bg-white text-green-800 border-green-200 hover:bg-green-50'}
                  transition-colors`}
             >
                {option.frontText}
             </motion.button>
          ))}
        </div>

        <div className="w-4"></div> {/* spacer */}

        {/* TIM B Buttons */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {optionsB.map((option, idx) => (
             <motion.button 
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAnswerB(option.frontText)}
                className={`py-6 px-2 rounded-2xl font-bold text-xl md:text-2xl shadow-sm border-b-4 
                  ${wrongAnswerB === option.frontText 
                     ? 'bg-red-500 text-white border-red-700' 
                     : 'bg-white text-red-800 border-red-200 hover:bg-red-50'}
                  transition-colors`}
             >
                {option.frontText}
             </motion.button>
          ))}
        </div>

      </div>
    </div>
  );
}
