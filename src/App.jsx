import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { initGlobalAudio, audioController } from './lib/audio';
import { Music, Music4 } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import FlashcardPage from './pages/FlashcardPage';

function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    initGlobalAudio((playing) => setIsMusicPlaying(playing));
  }, []);

  const toggleMusic = () => {
    const isPlaying = audioController.toggleBgm();
    setIsMusicPlaying(isPlaying);
  };

  return (
    <BrowserRouter>
      {/* Floating Music Button */}
      <button 
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 bg-white p-4 rounded-full shadow-lg border-4 border-accent hover:scale-110 transition-transform active:scale-95"
        title="Toggle Background Music"
      >
        {isMusicPlaying ? (
          <Music className="w-8 h-8 text-primary animate-bounce" />
        ) : (
          <Music4 className="w-8 h-8 text-gray-400" />
        )}
      </button>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/play/:categoryId" element={<FlashcardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
