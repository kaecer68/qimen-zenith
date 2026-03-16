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
  <img src="https://img.shields.io/badge/Go-1.22-00ADD8?style=flat-square&logo=go" alt="Go 1.22">
  <img src="https://img.shields.io/badge/gRPC-protobuf-244c5a?style=flat-square&logo=grpc" alt="gRPC">
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
- **用神與六親關係**：依問事類型自動對應用神宮位，支援六親關係選擇

### 分析模式
- **基礎模式**：簡潔易懂的吉凶解說
- **進階模式**：
  - 三奇六儀詳解（天干克應）
  - 門星神組合分析
  - 古典斷語與現代建議
  - 時空分析（空亡、入墓、擊刑、馬星）
  - 宮位生剋關係

### 管理功能
- **記錄管理**：儲存、載入、刪除排盤記錄（LocalStorage）
- **匯出功能**：支援 JSON 與 CSV 格式匯出

### 教學系統
- **基礎教學**：九宮八卦、三奇六儀、八門九星八神、五行生剋
- **案例分析庫**：財運、官運、出行、健康等經典案例
- **格局查詢手冊**：吉凶格局、特殊格局、組合格局

---

## 技術架構

```
qimen-zenith/
├── cmd/server/           # Go gRPC 伺服器入口
│   └── main.go
├── internal/handler/     # gRPC Handler 實作
│   └── handler.go
├── pkg/
│   ├── qimen/            # 奇門核心演算法（Go）
│   │   ├── core.go       # 排盤計算、評分、分析
│   │   ├── hour_pillar.go # 時柱計算（五鼠遁元法）
│   │   ├── knowledge.go  # 三奇六儀 + 門星神知識庫
│   │   └── staticdata.go # 教學/案例/格局靜態資料
│   └── lunarapi/         # Lunar-Zenith HTTP 客戶端
│       └── lunar.go
├── proto/
│   ├── qimen.proto       # gRPC Protobuf 定義
│   ├── qimen.pb.go       # 自動生成
│   └── qimen_grpc.pb.go  # 自動生成
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/        # React 元件
│   │   ├── qimen/        # 奇門相關元件
│   │   └── ui/           # UI 元件（shadcn/ui）
│   └── lib/
│       ├── grpc-client.ts    # TypeScript gRPC 客戶端
│       ├── grpc-normalize.ts # gRPC 回應正規化
│       ├── qimen/        # TypeScript 輔助函式
│       └── utils.ts
├── go.mod
├── Makefile
└── package.json
```

### 服務關係

```
瀏覽器 → Next.js (3000) → [REST API routes] → Go gRPC server (50051) → Lunar-Zenith (8080)
```

---

## REST API

本專案提供 REST API，可供外部應用程式調用奇門遁甲排盤與分析服務。

### 端點一覽

| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/api/qimen/plate?date=YYYY-MM-DD&hour=0-23` | 排盤計算 |
| GET | `/api/qimen/analysis?date=YYYY-MM-DD&hour=0-23&mode=basic` | 吉凶分析 |
| GET | `/api/qimen/health` | 服務健康檢查 |
| GET | `/api/teaching/sections?id=xxx` | 教學內容 |
| GET | `/api/cases?id=&tag=&type=&search=` | 案例庫查詢 |
| GET | `/api/patterns?id=&type=&search=` | 格局查詢 |

### 共用參數

| 參數 | 說明 | 預設值 |
|------|------|--------|
| `date` | 日期，格式 YYYY-MM-DD | 今天 |
| `hour` | 小時數 0-23，本地計算時柱（五鼠遁元法） | 當前小時 |

> 時辰（時柱）在奇門遁甲中至關重要，每 2 小時變一局。時柱由**本地計算**（非依賴外部服務），使用五鼠遁元法根據日干推算時干。

### 排盤 API

```bash
# 查詢指定日期 + 時辰的奇門盤
curl http://localhost:3000/api/qimen/plate?date=2026-03-16&hour=9

# 省略 hour 則使用伺服器當前時辰
curl http://localhost:3000/api/qimen/plate?date=2026-03-16
```

回應範例：
```json
{
  "success": true,
  "data": {
    "date": "2026-03-16",
    "yearGanZhi": "丙午",
    "hourGanZhi": "己巳",
    "shichen": "巳時",
    "yinYang": "陽遁",
    "juNumber": 3,
    "heavenPlate": { "1": "庚", "2": "戊", ... },
    "humanPlate": { "1": "休門", "2": "生門", ... },
    "starsPlate": { "1": "天蓬", "2": "天任", ... },
    "spiritPlate": { "1": "值符", "2": "螣蛇", ... }
  }
}
```

### 分析 API

```bash
# 基礎分析（指定巳時）
curl http://localhost:3000/api/qimen/analysis?date=2026-03-16&hour=9

# 增強分析（含三奇六儀 + 門星神組合）
curl http://localhost:3000/api/qimen/analysis?date=2026-03-16&hour=9&mode=enhanced
```

### 健康檢查

```bash
curl http://localhost:3000/api/qimen/health
```

> **注意**：API 依賴兩個外部服務：
> 1. **Go gRPC 後端**（`go run ./cmd/server/`，port 50051）
> 2. **lunar-zenith 曆法服務**（port 8080，參見 [lunar-zenith](https://github.com/kaecer68/lunar-zenith)）

---

## gRPC 服務（Go 後端）

核心算法已遷移至 **Go** 實作，提供高效能的 gRPC 服務（port 50051）。Next.js REST API 作為代理層，將所有計算請求轉發至 Go 後端。

### 服務列表

| RPC | 說明 |
|-----|------|
| `CalculatePlate` | 排盤計算 |
| `AnalyzePlate` | 解盤分析 |
| `AnalyzeEnhanced` | 增強分析（含三奇六儀 + 門星神） |
| `GetTeachingSections` | 教學內容 |
| `GetCases` | 案例分析 |
| `GetPatterns` | 格局查詢 |
| `Health` | 健康檢查 |

### 啟動 Go gRPC 伺服器

```bash
# 方法一：直接執行
go run ./cmd/server/

# 方法二：編譯後執行
make build
./bin/server

# 環境變數
GRPC_PORT=50051   # gRPC 監聽埠（預設 50051）
GRPC_HOST=localhost:50051  # Next.js 連線位址（預設 localhost:50051）
LUNAR_API_URL=http://localhost:8080  # Lunar-Zenith 服務位址
```

### 重新生成 Proto

```bash
make proto
```

---

## 快速開始

### 環境需求
- Node.js 18+
- Go 1.22+
- protoc + protoc-gen-go（僅重新生成 proto 時需要）

### 安裝

```bash
# 克隆專案
git clone https://github.com/kaecer68/qimen-zenith.git
cd qimen-zenith

# 安裝 Node 依賴
npm install

# 安裝 Go 依賴
go mod tidy
```

### 啟動（完整服務）

```bash
# 終端 1：啟動 Go gRPC 後端
go run ./cmd/server/

# 終端 2：啟動 lunar-zenith 曆法服務
# （參見 https://github.com/kaecer68/lunar-zenith）

# 終端 3：啟動 Next.js 前端
npm run dev
```

開啟 http://localhost:3000 查看應用

### 建置

```bash
# 建置 Go 伺服器
make build          # 輸出 bin/server

# 建置 Next.js
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

[德凱/KAECER](https://github.com/kaecer68) 
- 對傳統文化數位化有興趣的前端工程師
- Blog: https://goluck.im/
- Twitter: [@kaecer](https://twitter.com/kaecer)

相關專案：
- [lunar-zenith](https://github.com/kaecer68/lunar-zenith) - 高精度農曆節氣 API
- [ziwei-zenith](https://github.com/kaecer68/ziwei-zenith) - 紫微斗數排盤 API
- [liuren-zenith](https://github.com/kaecer68/liuren-zenith) - 六壬排盤 API
- [bazi-zenith](https://github.com/kaecer68/bazi-zenith) - 八字排盤 API

---

<p align="center">
  <sub>Built with passion for traditional Chinese metaphysics and modern web technology.</sub>
</p>
