import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useRecipeStore } from '../store/recipeStore';
import { Category, Difficulty, categoryLabels, difficultyLabels } from '../types';

const categories: Category[] = ['stir-fry', 'soup', 'staple', 'cold-dish', 'dessert', 'breakfast'];
const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

export default function AddRecipePage() {
  const navigate = useNavigate();
  const addRecipe = useRecipeStore((s) => s.addRecipe);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('stir-fry');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', preparation: '' }]);
  const [steps, setSteps] = useState([{ title: '', description: '' }]);
  const [tips, setTips] = useState(['']);

  const addIngredient = () => setIngredients([...ingredients, { name: '', amount: '', preparation: '' }]);
  const removeIngredient = (idx: number) => setIngredients(ingredients.filter((_, i) => i !== idx));
  const updateIngredient = (idx: number, field: string, value: string) => {
    const next = [...ingredients];
    next[idx] = { ...next[idx], [field]: value };
    setIngredients(next);
  };

  const addStep = () => setSteps([...steps, { title: '', description: '' }]);
  const removeStep = (idx: number) => setSteps(steps.filter((_, i) => i !== idx));
  const updateStep = (idx: number, field: string, value: string) => {
    const next = [...steps];
    next[idx] = { ...next[idx], [field]: value };
    setSteps(next);
  };

  const addTip = () => setTips([...tips, '']);
  const removeTip = (idx: number) => setTips(tips.filter((_, i) => i !== idx));
  const updateTip = (idx: number, value: string) => {
    const next = [...tips];
    next[idx] = value;
    setTips(next);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('请输入菜名');
      return;
    }

    const validIngredients = ingredients.filter((i) => i.name.trim());
    const validSteps = steps.filter((s) => s.title.trim() || s.description.trim());
    const validTips = tips.filter((t) => t.trim());

    addRecipe({
      name: name.trim(),
      category,
      description: description.trim() || name.trim(),
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop',
      prepTime: parseInt(prepTime) || 0,
      cookTime: parseInt(cookTime) || 0,
      difficulty,
      ingredients: validIngredients.map((ing, i) => ({
        id: `ing-${i}`,
        ...ing,
      })),
      steps: validSteps.map((s, i) => ({
        id: `step-${i}`,
        order: i + 1,
        ...s,
      })),
      tips: validTips,
      isFavorite: false,
      tags: [],
    });

    navigate('/');
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#FAFAF8] z-40 px-4 py-3 flex items-center justify-between border-b border-[#E8E6E3]">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#8B8680]">
          <ArrowLeft size={20} />
          <span className="text-sm">返回</span>
        </button>
        <h1 className="text-lg font-bold text-[#2C2C2C]">新增菜谱</h1>
        <button onClick={handleSubmit} className="text-[#C75B39] font-medium text-sm">
          保存
        </button>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Basic Info */}
        <div className="space-y-3">
          <h2 className="font-bold text-[#2C2C2C]">基本信息</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="菜名"
            className="w-full p-3 bg-white border border-[#E8E6E3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="一句话描述（可选）"
            className="w-full p-3 bg-white border border-[#E8E6E3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
          />
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="封面图片链接（可选，留空使用默认图）"
            className="w-full p-3 bg-white border border-[#E8E6E3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
          />
          <div className="flex gap-3">
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="备料时间(分)"
              className="flex-1 p-3 bg-white border border-[#E8E6E3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
            />
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              placeholder="烹饪时间(分)"
              className="flex-1 p-3 bg-white border border-[#E8E6E3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  category === cat ? 'bg-[#2C2C2C] text-white' : 'bg-white border border-[#E8E6E3] text-[#8B8680]'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  difficulty === diff ? 'bg-[#2C2C2C] text-white' : 'bg-white border border-[#E8E6E3] text-[#8B8680]'
                }`}
              >
                {difficultyLabels[diff]}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-3">
          <h2 className="font-bold text-[#2C2C2C]">食材清单</h2>
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                  placeholder="食材名称"
                  className="w-full p-2.5 bg-white border border-[#E8E6E3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ing.amount}
                    onChange={(e) => updateIngredient(idx, 'amount', e.target.value)}
                    placeholder="用量"
                    className="flex-1 p-2.5 bg-white border border-[#E8E6E3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
                  />
                  <input
                    type="text"
                    value={ing.preparation}
                    onChange={(e) => updateIngredient(idx, 'preparation', e.target.value)}
                    placeholder="处理方式（可选）"
                    className="flex-[2] p-2.5 bg-white border border-[#E8E6E3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
                  />
                </div>
              </div>
              {ingredients.length > 1 && (
                <button onClick={() => removeIngredient(idx)} className="mt-2 text-[#8B8680]">
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addIngredient}
            className="flex items-center gap-1 text-[#C75B39] text-sm font-medium"
          >
            <Plus size={16} />
            添加食材
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <h2 className="font-bold text-[#2C2C2C]">制作步骤</h2>
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <div className="w-7 h-7 rounded-full bg-[#F2F1EF] flex items-center justify-center text-sm font-bold text-[#2C2C2C] flex-shrink-0 mt-1">
                {idx + 1}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(idx, 'title', e.target.value)}
                  placeholder="步骤标题"
                  className="w-full p-2.5 bg-white border border-[#E8E6E3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
                />
                <textarea
                  value={step.description}
                  onChange={(e) => updateStep(idx, 'description', e.target.value)}
                  placeholder="步骤详细描述"
                  rows={2}
                  className="w-full p-2.5 bg-white border border-[#E8E6E3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30 resize-none"
                />
              </div>
              {steps.length > 1 && (
                <button onClick={() => removeStep(idx)} className="mt-2 text-[#8B8680]">
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addStep}
            className="flex items-center gap-1 text-[#C75B39] text-sm font-medium"
          >
            <Plus size={16} />
            添加步骤
          </button>
        </div>

        {/* Tips */}
        <div className="space-y-3">
          <h2 className="font-bold text-[#2C2C2C]">关键要点（可选）</h2>
          {tips.map((tip, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                value={tip}
                onChange={(e) => updateTip(idx, e.target.value)}
                placeholder="烹饪技巧或注意事项"
                className="flex-1 p-2.5 bg-white border border-[#E8E6E3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
              />
              {tips.length > 1 && (
                <button onClick={() => removeTip(idx)} className="text-[#8B8680]">
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addTip}
            className="flex items-center gap-1 text-[#C75B39] text-sm font-medium"
          >
            <Plus size={16} />
            添加要点
          </button>
        </div>
      </div>
    </div>
  );
}
