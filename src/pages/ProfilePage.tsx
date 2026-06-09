import { useRecipeStore } from '../store/recipeStore';
import { useAuthStore } from '../store/authStore';
import { Upload, Download, BookOpen, Key, LogOut } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ProfilePage() {
  const recipes = useRecipeStore((s) => s.recipes);
  const exportToJSON = useRecipeStore((s) => s.exportToJSON);
  const importFromJSON = useRecipeStore((s) => s.importFromJSON);
  const { changePassword, logout } = useAuthStore();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const stats = useMemo(() => {
    const total = recipes.length;
    return { total };
  }, [recipes]);

  const handleExport = () => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-recipes-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const content = ev.target?.result as string;
          if (content) {
            importFromJSON(content);
            alert('导入成功！');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('请填写完整信息');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致');
      return;
    }

    if (newPassword.length < 4) {
      setError('密码至少4位');
      return;
    }

    const result = await changePassword(oldPassword, newPassword);
    if (result) {
      setSuccess('密码修改成功！');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowChangePassword(false);
        setSuccess('');
      }, 1500);
    } else {
      setError('原密码错误');
    }
  };

  return (
    <div className="pb-20 px-4 pt-4">
      <h1 className="text-2xl font-bold text-[#2C2C2C] mb-4">个人中心</h1>

      {/* Stats */}
      <div className="bg-white rounded-xl border border-[#E8E6E3] p-4 flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#F2F1EF] flex items-center justify-center">
          <BookOpen size={20} className="text-[#C75B39]" />
        </div>
        <div>
          <p className="text-2xl font-bold text-[#2C2C2C]">{stats.total}</p>
          <p className="text-xs text-[#8B8680]">菜谱总数</p>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl border border-[#E8E6E3] overflow-hidden mb-6">
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-between p-4 border-b border-[#E8E6E3] active:bg-[#F2F1EF] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Download size={18} className="text-[#8B8680]" />
            <span className="text-[#2C2C2C]">导出数据备份</span>
          </div>
          <span className="text-[#8B8680] text-sm">&gt;</span>
        </button>
        <button
          onClick={handleImport}
          className="w-full flex items-center justify-between p-4 border-b border-[#E8E6E3] active:bg-[#F2F1EF] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Upload size={18} className="text-[#8B8680]" />
            <span className="text-[#2C2C2C]">导入数据恢复</span>
          </div>
          <span className="text-[#8B8680] text-sm">&gt;</span>
        </button>
        <button
          onClick={() => setShowChangePassword(!showChangePassword)}
          className="w-full flex items-center justify-between p-4 active:bg-[#F2F1EF] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Key size={18} className="text-[#8B8680]" />
            <span className="text-[#2C2C2C]">修改密码</span>
          </div>
          <span className="text-[#8B8680] text-sm">{showChangePassword ? '−' : '+'}</span>
        </button>
        {showChangePassword && (
          <div className="p-4 bg-[#FAFAF8] border-t border-[#E8E6E3] space-y-3">
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="原密码"
              className="w-full p-3 bg-white border border-[#E8E6E3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="新密码（至少4位）"
              className="w-full p-3 bg-white border border-[#E8E6E3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="确认新密码"
              className="w-full p-3 bg-white border border-[#E8E6E3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30"
            />
            {error && <p className="text-[#C75B39] text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <button
              onClick={handleChangePassword}
              className="w-full py-3 bg-[#2C2C2C] text-white font-medium rounded-xl active:bg-[#3a3a3a] transition-colors"
            >
              确认修改
            </button>
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-4 bg-white border border-[#E8E6E3] rounded-xl flex items-center justify-center gap-2 text-[#8B8680] active:bg-[#F2F1EF] transition-colors"
      >
        <LogOut size={18} />
        退出登录
      </button>

      {/* About */}
      <div className="text-center text-xs text-[#8B8680] space-y-1 mt-6">
        <p>家庭菜谱管理</p>
        <p>数据存储在本地浏览器中</p>
        <p>可通过导出/导入功能在设备间共享</p>
      </div>
    </div>
  );
}
