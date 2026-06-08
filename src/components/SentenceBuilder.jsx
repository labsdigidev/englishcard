import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlayCircle } from 'lucide-react';

function SortableWord({ id, word }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-4 py-2 rounded-xl text-xl font-bold shadow-md cursor-grab active:cursor-grabbing border-b-4 
        ${isDragging ? 'bg-primary text-white border-red-600 scale-110' : 'bg-white text-primary border-gray-200 hover:bg-gray-50'}`}
    >
      {word}
    </div>
  );
}

export default function SentenceBuilder({ sentence, translation, onComplete }) {
  const [words, setWords] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Split sentence and shuffle words
    const sentenceWords = sentence.split(' ').map((w, i) => ({ id: `word-${i}`, word: w }));
    // Simple shuffle
    const shuffled = [...sentenceWords].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setIsCorrect(false);
  }, [sentence]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setWords((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Check if correct
        const currentSentence = newItems.map(i => i.word).join(' ');
        if (currentSentence === sentence) {
          setIsCorrect(true);
          if (onComplete) onComplete();
        }
        
        return newItems;
      });
    }
  };

  const handleAudio = () => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border-4 border-gray-100 p-8 flex flex-col items-center mt-6">
      <h3 className="text-2xl font-black text-gray-700 mb-2">Susun Kalimat! 🧩</h3>
      <p className="text-gray-500 font-bold mb-8">Geser kotak kata untuk menyusun: "{translation}"</p>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={words} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-4 flex-wrap justify-center p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 min-h-[100px] w-full items-center">
            {words.map((w) => (
              <SortableWord key={w.id} id={w.id} word={w.word} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isCorrect && (
        <div className="mt-8 flex flex-col items-center animate-bounce">
          <div className="bg-green-100 text-green-700 font-black text-2xl px-6 py-3 rounded-full border-4 border-green-300">
            Hebat! 🎉
          </div>
          <button 
             onClick={handleAudio}
             className="mt-4 bg-secondary hover:bg-teal-500 text-white p-4 rounded-full shadow-lg transition-colors w-16 h-16 flex items-center justify-center border-b-4 border-teal-700 active:border-b-0 active:translate-y-1"
           >
             <PlayCircle size={32} fill="currentColor" />
           </button>
        </div>
      )}
    </div>
  );
}
