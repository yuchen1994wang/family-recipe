import { Category, categoryLabels } from '../types';
import { useRecipeStore } from '../store/recipeStore';

const categories: Category[] = ['all', 'stir-fry', 'stew', 'fry', 'soup', 'staple', 'dessert'];

export default function CategoryTabs() {
  const activeCategory = useRecipeStore((s) => s.activeCategory);
  const setActiveCategory = useRecipeStore((s) => s.setActiveCategory);

  return (
    <div className="flex flex-wrap gap-2 pb-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
            activeCategory === cat
              ? 'bg-[#2C2C2C] text-white'
              : 'bg-white text-[#8B8680] border border-[#E8E6E3]'
          }`}
        >
          {categoryLabels[cat]}
        </button>
      ))}
    </div>
  );
}
