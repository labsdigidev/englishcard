import { motion } from 'framer-motion';

export default function CategoryCard({ category, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      className={`w-full h-48 rounded-[2rem] shadow-md border-b-8 border-r-8 p-6 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden`}
      style={{ 
        backgroundColor: category.colorTheme || '#fff',
        borderColor: category.borderColor || '#e5e7eb'
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-6xl mb-4 bg-white/50 w-24 h-24 rounded-full flex items-center justify-center shadow-inner">
        {category.iconUrl}
      </div>
      <h3 className="text-2xl font-black text-gray-800 tracking-wide">{category.name}</h3>
    </motion.div>
  );
}
