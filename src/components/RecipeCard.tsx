import { Clock } from 'lucide-react';
import { Recipe } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#E8E6E3] active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={recipe.coverImage}
          alt={recipe.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <h3 className="font-bold text-[#2C2C2C] text-base truncate">{recipe.name}</h3>
        <p className="text-[#8B8680] text-xs mt-1 truncate">{recipe.description}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-[#8B8680]">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {recipe.prepTime + recipe.cookTime}分钟
          </span>
        </div>
      </div>
    </div>
  );
}
