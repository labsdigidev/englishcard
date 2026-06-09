import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import { supabase } from '../lib/supabase';

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
            setCategories(data);
        } else {
            console.log('No categories found in Supabase.');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 flex flex-col items-center">
      <header className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center bg-white rounded-3xl p-4 shadow-sm border-4 border-white/50 mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-black text-primary text-center">Englishcard ✨</h1>
        <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto bg-gray-100 px-6 py-3 rounded-full font-bold text-gray-500 hover:bg-gray-200 transition-colors border-2 border-gray-200"
        >
            Login Ortu
        </button>
      </header>

      <main className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Pilih Kategori Belajar</h2>
        
        {loading ? (
            <div className="text-center text-gray-500 font-bold p-10 animate-pulse">Loading Categories...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map(category => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  onClick={() => navigate(`/play/${category.id}`)}
                />
              ))}
              {/* VS Dino Game Card */}
              <CategoryCard 
                  key="vs-dino" 
                  category={{
                      id: 'vs-dino',
                      name: 'VS Dino',
                      iconUrl: '🦖',
                      colorTheme: '#4ADE80',
                      borderColor: '#22C55E'
                  }}
                  onClick={() => navigate('/vs-dino')}
              />
            </div>
        )}
      </main>
    </div>
  );
}
