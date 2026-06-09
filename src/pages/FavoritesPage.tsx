import { useMemo } from 'react';
import { useRecipeStore } from '../store/recipeStore';
import RecipeCard from '../components/RecipeCard';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const recipes = useRecipeStore((s) => s.recipes);

  const favorites = useMemo(() => recipes.filter((r) => r.isFavorite), [recipes]);

  return (
    <div className="pb-20 px-4 pt-4">
      <h1 className="text-2xl font-bold text-[#2C2C2C] mb-4">我的收藏</h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#8B8680]">
          <Heart size={48} className="mb-4 opacity-30" />
          <p>还没有收藏任何菜谱</p>
          <p className="text-sm mt-1">点击菜谱详情页的爱心图标即可收藏</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
