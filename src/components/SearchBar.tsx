import { Search, X } from 'lucide-react';
import { useRecipeStore } from '../store/recipeStore';

export default function SearchBar() {
  const searchQuery = useRecipeStore((s) => s.searchQuery);
  const setSearchQuery = useRecipeStore((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8680]" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="搜索菜名或食材..."
        className="w-full pl-9 pr-8 py-2.5 bg-[#F2F1EF] rounded-xl text-sm text-[#2C2C2C] placeholder:text-[#8B8680] focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8680]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
