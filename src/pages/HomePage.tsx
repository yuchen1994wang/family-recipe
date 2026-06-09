import { useMemo } from 'react';
import { useRecipeStore } from '../store/recipeStore';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import RecipeCard from '../components/RecipeCard';

export default function HomePage() {
  const recipes = useRecipeStore((s) => s.recipes);
  const searchQuery = useRecipeStore((s) => s.searchQuery);
  const activeCategory = useRecipeStore((s) => s.activeCategory);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const matchCategory = activeCategory === 'all' || r.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(query));
      return matchCategory && matchSearch;
    });
  }, [recipes, searchQuery, activeCategory]);

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-[#FAFAF8] z-40 px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-[#2C2C2C] mb-3">家庭菜谱</h1>
        <SearchBar />
        <div className="mt-3">
          <CategoryTabs />
        </div>
      </div>

      <div className="px-4 mt-2">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-20 text-[#8B8680]">
            <p>没有找到匹配的菜谱</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
