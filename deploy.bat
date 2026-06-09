@echo off
chcp 65001 >nul
echo ==========================================
echo   家庭菜谱 - GitHub Pages 部署脚本
echo ==========================================
echo.

REM 检查 git 是否安装
git --version >nul 2>&1
if errorlevel 1 (
    echo [错误] Git 未安装，请先安装 Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/5] 初始化 Git 仓库...
git init

echo [2/5] 添加所有文件...
git add .

echo [3/5] 提交代码...
git commit -m "Initial commit"

echo [4/5] 关联远程仓库...
git remote add origin https://github.com/yuchen1994wang/family-recipe.git 2>nul
if errorlevel 1 (
    echo 远程仓库已存在，跳过...
)

echo [5/5] 推送到 GitHub...
git branch -M main
git push -u origin main

echo.
echo ==========================================
echo   推送完成！
echo ==========================================
echo.
echo 接下来请在 GitHub 上完成以下设置：
echo.
echo 1. 打开 https://github.com/yuchen1994wang/family-recipe
echo 2. 点击 Settings 标签
echo 3. 左侧菜单点击 Pages
echo 4. Source 选择 "GitHub Actions"
echo 5. 等待自动部署完成（约 1-2 分钟）
echo.
echo 部署完成后访问：
echo https://yuchen1994wang.github.io/family-recipe/
echo.
pause
