import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, Trash2, Edit2 } from 'lucide-react';
import { useRecipeStore } from '../store/recipeStore';
import { useState } from 'react';

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipe = useRecipeStore((s) => s.recipes.find((r) => r.id === id));
  const deleteRecipe = useRecipeStore((s) => s.deleteRecipe);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  if (!recipe) {
    return (
      <div className="flex items-center justify-center h-screen text-[#8B8680]">
        菜谱不存在
      </div>
    );
  }

  const toggleIngredient = (ingId: string) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(ingId)) next.delete(ingId);
      else next.add(ingId);
      return next;
    });
  };

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  const handleDelete = () => {
    if (confirm('确定要删除这道菜谱吗？')) {
      deleteRecipe(recipe.id);
      navigate('/');
    }
  };

  return (
    <div className="pb-6">
      {/* Cover Image */}
      <div className="relative aspect-[16/10]">
        <img src={recipe.coverImage} alt={recipe.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-[#2C2C2C]" />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-white text-2xl font-bold">{recipe.name}</h1>
          <p className="text-white/80 text-sm mt-1">{recipe.description}</p>
        </div>
      </div>

      {/* Info Bar */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-[#8B8680]">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            备料{recipe.prepTime}分钟 + 烹饪{recipe.cookTime}分钟
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/edit/${recipe.id}`)}
            className="w-9 h-9 rounded-full bg-[#F2F1EF] flex items-center justify-center"
          >
            <Edit2 size={16} className="text-[#8B8680]" />
          </button>
          <button
            onClick={handleDelete}
            className="w-9 h-9 rounded-full bg-[#F2F1EF] flex items-center justify-center"
          >
            <Trash2 size={16} className="text-[#8B8680]" />
          </button>
        </div>
      </div>

      {/* Ingredients */}
      <div className="px-4 mt-2">
        <h2 className="text-lg font-bold text-[#2C2C2C] mb-3">食材清单</h2>
        <div className="bg-white rounded-xl border border-[#E8E6E3] overflow-hidden">
          {recipe.ingredients.map((ing) => (
            <div
              key={ing.id}
              onClick={() => toggleIngredient(ing.id)}
              className="flex items-start gap-3 p-3 border-b border-[#E8E6E3] last:border-b-0 cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  checkedIngredients.has(ing.id)
                    ? 'bg-[#C75B39] border-[#C75B39]'
                    : 'border-[#E8E6E3]'
                }`}
              >
                {checkedIngredients.has(ing.id) && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div className={`flex-1 ${checkedIngredients.has(ing.id) ? 'opacity-40' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#2C2C2C]">{ing.name}</span>
                  <span className="text-[#8B8680] text-sm">{ing.amount}</span>
                </div>
                {ing.preparation && (
                  <p className="text-xs text-[#8B8680] mt-0.5">{ing.preparation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-[#2C2C2C] mb-3">制作步骤</h2>
        <div className="space-y-3">
          {recipe.steps.map((step) => (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-opacity ${
                completedSteps.has(step.id)
                  ? 'border-[#C75B39]/30 opacity-60'
                  : 'border-[#E8E6E3]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                    completedSteps.has(step.id)
                      ? 'bg-[#C75B39] text-white'
                      : 'bg-[#F2F1EF] text-[#2C2C2C]'
                  }`}
                >
                  {step.order}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#2C2C2C]">{step.title}</h3>
                  <p className="text-sm text-[#8B8680] mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      {recipe.tips.length > 0 && (
        <div className="px-4 mt-6">
          <h2 className="text-lg font-bold text-[#2C2C2C] mb-3">关键要点</h2>
          <div className="bg-white rounded-xl border-l-4 border-[#C75B39] border-y border-r border-[#E8E6E3] p-4">
            <ul className="space-y-2">
              {recipe.tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-[#2C2C2C] flex items-start gap-2">
                  <span className="text-[#C75B39] font-bold">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
