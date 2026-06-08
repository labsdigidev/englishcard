import { useNavigate } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';

import { MOCK_CATEGORIES } from '../lib/mockData';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center bg-white rounded-3xl p-4 shadow-sm border-4 border-white/50 mb-8">
        <h1 className="text-3xl font-black text-primary">Englishcard ✨</h1>
        <button 
            onClick={() => navigate('/login')}
            className="bg-gray-100 px-6 py-3 rounded-full font-bold text-gray-500 hover:bg-gray-200 transition-colors border-2 border-gray-200"
        >
            Login Ortu
        </button>
      </header>

      <main className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Pilih Kategori Belajar</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_CATEGORIES.map(category => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              onClick={() => navigate(`/play/${category.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
