# 奇門遁甲 - Qimen Zenith

<p align="center">
  <strong>專業級日家奇門遁甲排盤與分析系統</strong>
</p>

<p align="center">
  <a href="#功能特點">功能特點</a> •
  <a href="#技術架構">技術架構</a> •
  <a href="#快速開始">快速開始</a> •
  <a href="#授權">授權</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License: MIT">
</p>

---

## 功能特點

### 核心功能
- **日家奇門遁甲排盤**：基於農曆節氣與干支的精確排盤
- **三奇六儀分析**：詳細的三奇（乙丙丁）與六儀組合解釋
- **門星神組合**：八門、九星、八神交互作用的專業分析
- **宮位吉凶評級**：自動計算各宮位分數與建議

### 分析模式
- **基礎模式**：簡潔易懂的吉凶解說
- **進階模式**：
  - 三奇六儀詳解（天干克應）
  - 門星神組合分析
  - 古典斷語與現代建議

---

## 技術架構

```
qimen-zenith/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/        # React 元件
│   │   ├── qimen/        # 奇門相關元件
│   │   └── ui/           # UI 元件（shadcn/ui）
│   └── lib/
│       ├── qimen/        # 奇門核心演算法
│       │   ├── core.ts   # 排盤計算
│       │   ├── qiyiKnowledge.ts    # 三奇六儀知識庫
│       │   └── combinationKnowledge.ts  # 門星神組合知識庫
│       └── utils.ts      # 工具函數
├── public/               # 靜態資源
└── docs/                 # 文件
```

---

## 快速開始

### 環境需求
- Node.js 18+
- npm / yarn / pnpm

### 安裝

```bash
# 克隆專案
git clone https://github.com/kaecer/qimen-zenith.git
cd qimen-zenith

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

開啟 http://localhost:3000 查看應用

### 建置

```bash
npm run build
```

---

## 貢獻

歡迎提交 Issue 和 Pull Request！

### 貢獻指南

1. Fork 本專案
2. 建立特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 授權

本專案採用 [MIT License](LICENSE) 授權。

---

## 關於作者

[德凱/KAECER](https://github.com/kaecer68) - 對傳統文化數位化有興趣的前端工程師
- Blog: https://goluck.im/
- Twitter: [@kaecer](https://twitter.com/kaecer)

相關專案：
- [lunar-zenith](https://github.com/kaecer68/lunar-zenith) - 高精度農曆節氣 API

---

<p align="center">
  <sub>Built with passion for traditional Chinese metaphysics and modern web technology.</sub>
</p>
