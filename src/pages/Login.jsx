import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl border-b-8 border-r-8 border-gray-200 p-8 flex flex-col items-center">
        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
          👩‍👧‍👦
        </div>
        <h2 className="text-3xl font-black text-primary mb-2 text-center">Login Orang Tua</h2>
        <p className="text-gray-500 font-semibold mb-8 text-center">Masuk untuk melacak progres belajar anak Anda.</p>

        <form className="w-full space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input 
              type="email" 
              className="w-full bg-gray-100 rounded-2xl p-4 font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-secondary/50"
              placeholder="Contoh: bunda@email.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Password / PIN</label>
            <input 
              type="password" 
              className="w-full bg-gray-100 rounded-2xl p-4 font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-secondary/50"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="button"
            className="w-full mt-6 bg-secondary text-white font-black text-xl px-8 py-4 rounded-full shadow-md border-b-4 border-teal-600 hover:bg-teal-500 active:translate-y-1 active:border-b-0 transition-all"
            onClick={() => navigate('/')}
          >
            MASUK
          </button>
        </form>

        <button 
          onClick={() => navigate('/')}
          className="mt-6 text-gray-400 font-bold hover:text-gray-600 underline"
        >
          Kembali ke Permainan
        </button>
      </div>
    </div>
  );
}
