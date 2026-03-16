---
description: 自動完成 GitHub 推送流程，包含提交、標籤、推送等完整步驟
---

# GitHub Push 工作流

自動完成從本地到 GitHub 的完整推送流程。

## 使用條件

- 專案已初始化 git
- 已設定 remote origin
- 需要 GitHub Personal Access Token（若使用 HTTPS）

## 執行步驟

1. **檢查 git 狀態**
   ```bash
   git status
   ```
   確認是否有未提交的變更

2. **新增所有變更**
   ```bash
   git add .
   ```

3. **提交變更**
   ```bash
   git commit -m "update: $(date '+%Y-%m-%d %H:%M')"
   ```
   或使用自訂訊息：
   ```bash
   git commit -m "feat: your custom message"
   ```

4. **推送至遠端**
   ```bash
   git push origin $(git branch --show-current)
   ```

5. **驗證推送結果**
   ```bash
   git log --oneline -3
   git status
   ```

## 可選：版本標記（Release）

如果需要打版本標籤：

```bash
# 檢查現有標籤
git tag -l

# 新增版本標籤（語意化版本）
git tag -a v1.0.0 -m "Release v1.0.0 - description"

# 推送標籤到 GitHub
git push origin v1.0.0

# 或推送所有本地標籤
git push origin --tags
```

## 常見問題

### 推送被拒絕（rejected）

```bash
# 先拉取遠端更新
git pull origin $(git branch --show-current) --rebase

# 解決衝突後重新推送
git push origin $(git branch --show-current)
```

### 設定 upstream（首次推送新分支）

```bash
git push -u origin $(git branch --show-current)
```

### 檢視遠端網址

```bash
git remote -v
```

## 快捷指令參考

| 指令 | 說明 |
|------|------|
| `git add .` | 新增所有變更 |
| `git commit -m "msg"` | 提交變更 |
| `git push` | 推送到遠端 |
| `git status` | 檢查狀態 |
| `git log --oneline` | 檢視提交歷史 |
| `git tag -a v1.0.0 -m "msg"` | 新增版本標籤 |
