# Vercel 部署指南

## 步骤 1: 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将代码推送到 GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/valentia-academy.git
git push -u origin main
```

## 步骤 2: 连接 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的 GitHub 仓库
5. 点击 "Import"

## 步骤 3: 配置环境变量

在 Vercel 项目设置中添加以下环境变量:

```
EMAIL_USER=valentiacabincrew.academy@gmail.com
EMAIL_PASS=spib jdfd kcgo ktud
VITE_GOOGLE_MAPS_API_KEY=你的Google Maps API Key
NODE_ENV=production
```

## 步骤 4: 部署

1. 点击 "Deploy"
2. 等待部署完成
3. 访问你的网站: `your-project-name.vercel.app`

## 步骤 5: 自定义域名 (可选)

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的自定义域名
3. 配置 DNS 记录
4. 等待 SSL 证书自动配置

## 故障排除

- 如果 API 不工作，检查环境变量是否正确设置
- 如果 Google Maps 不显示，检查 API Key 和域名限制
- 如果邮件发送失败，检查 Gmail 应用密码设置
