# 奇門遁甲專案產品需求文件 (PRD)

## 版本資訊
- **版本**: v1.0.0
- **建立日期**: 2026-03-16
- **最後更新**: 2026-03-16
- **專案名稱**: 奇門遁甲 · Qimen Zenith
- **目標用戶**: 專業命理師、奇門遁甲愛好者
- **產品形式**: 網頁應用程式 (Web App) + REST/gRPC API 服務
- **開源授權**: MIT License
- **GitHub**: https://github.com/kaecer68/qimen-zenith

---

## 1. 專案定位與願景

### 1.1 核心定位
提供專業級的奇門遁甲排盤與分析工具，整合精確的曆法計算與現代化的使用者介面，協助命理師進行專業的奇門遁甲分析。

### 1.2 產品願景
成為華語世界最專業、最精確的奇門遁甲數位化工具，完整呈現傳統奇門遁甲的理論精髓，並結合現代科技提供便捷的排盤與分析功能。

---

## 2. 技術架構

### 2.1 前端架構
| 項目 | 技術選擇 | 版本 | 說明 |
|------|---------|------|------|
| 框架 | Next.js | 16.1.6 | React 全端框架，支援 SSR |
| 語言 | TypeScript | 5.x | 型別安全的 JavaScript |
| 樣式 | Tailwind CSS | 4.x | Utility-first CSS 框架 |
| UI 組件 | shadcn/ui | 4.0.8 | 基於 Radix UI 的組件庫 |
| 圖標 | Lucide React | 0.577.0 | 現代化圖標庫 |

### 2.2 後端/外部服務
| 服務 | 說明 | 地址 |
|------|------|------|
| Next.js App | 前端與 REST API | http://localhost:3000 |
| lunar-zenith | 曆法計算服務 | http://localhost:8080 |
| gRPC Server | 高性能 RPC 服務 | localhost:50051 |

### 2.3 專案結構
```
src/
├── app/
│   ├── api/qimen/          # REST API
│   │   ├── plate/route.ts
│   │   ├── analysis/route.ts
│   │   └── health/route.ts
│   ├── page.tsx
│   └── layout.tsx
├── components/qimen/
│   ├── QimenCalculator.tsx   # 含問事類型/六親選擇
│   ├── QimenBoard.tsx      # 含主事宮位高亮
│   └── QimenAnalysis.tsx   # 含九宮多維象徵
├── lib/qimen/
│   ├── core.ts
│   ├── hourPillar.ts       # 五鼠遁元法
│   ├── symbolism.ts        # 九宮象徵+六親+問事類型
│   ├── qiyiKnowledge.ts
│   └── combinationKnowledge.ts
├── server/
│   └── grpc-server.ts      # gRPC 服務實現
├── proto/
│   └── qimen.proto         # gRPC 協議定義
└── lib/lunar-api.ts
```

---

## 3. 功能規格

### 3.1 核心功能

#### 3.1.1 日家奇門排盤
- **功能說明**: 根據指定日期排出日家奇門盤
- **輸入**: 日期 (YYYY-MM-DD)
- **輸出**: 完整的奇門遁甲盤面
- **依賴**: lunar-zenith API 提供曆法數據

**盤面元素**:
1. **地盤**: 固定不變的九宮地盤（戊己庚辛壬癸丁丙乙）
2. **天盤**: 三奇六儀在九宮的分布（根據遁局變化）
3. **人盤**: 八門分布（休生傷杜景死驚開）
4. **神盤**: 八神分布（值符螣蛇太陰六合白虎玄武九地九天）
5. **星盤**: 九星分布（天蓬天任天沖天輔天英天芮天柱天心）

#### 3.1.2 時柱系統
- **五鼠遁元法**: 本地計算時干，根據日干推算
- **十二時辰**: 子丑寅卯辰巳午未申酉戌亥對應 24 小時
- **早子時處理**: 23:00-23:59 自動歸入下一日

#### 3.1.3 問事參數系統
- **問事類型**: 13 種分類（財運、官運、感情、學業等）
- **用神自動判斷**: 根據問事類型對應八門/九星
- **六親關係**: 後天八卦六親系統（父親/領導、母親/長輩等）
- **主事宮位標註**: 米黃色高亮顯示用神所在宮位

#### 3.1.4 九宮多維象徵系統
- **人事象徵**: 六親人物角色對應
- **身體象徵**: 臟腑、部位對應
- **事務象徵**: 宜忌事項分類
- **時間象徵**: 季節、節氣對應

### 3.2 API 服務規格

#### 3.2.1 REST API
- 基礎 URL: `http://localhost:3000/api`
- 端點: `/qimen/plate`, `/qimen/analysis`
- 支持參數: date, hour, mode

#### 3.2.2 gRPC API
- 地址: `localhost:50051`
- 服務: QimenService
- 方法: CalculatePlate, AnalyzePlate, AnalyzeEnhanced, Health
- Proto 文件: `proto/qimen.proto`

### 3.3 未來功能規劃

#### Phase 2 - 月家奇門
- [ ] 月家奇門排盤邏輯
- [ ] 月盤與日盤對照分析

#### Phase 3 - 時家奇門
- [ ] 時家奇門排盤
- [ ] 精確時辰選擇
- [ ] 刻盤計算

#### Phase 4 - 解盤分析 ✅ 已完成
- [x] 基礎宮位吉凶評級
- [x] 三奇六儀知識庫與分析
- [x] 門星神組合知識庫與分析
- [x] 基礎/進階雙模式解說
- [x] 用神分析（進階）
- [x] 宮位生剋關係分析（進階）
- [x] 時空分析報告（進階）

#### Phase 5 - 案例管理 ✅ 已完成
- [x] 排盤記錄儲存
- [x] 案例分類管理
- [x] 查詢與對比功能
- [x] 匯出功能（PDF/圖片）

#### Phase 6 - 教學系統
- [ ] 奇門遁甲基礎教學
- [ ] 案例分析庫
- [ ] 格局查詢手冊

---

## 4. 核心算法規格

### 4.1 日家奇門局數計算
```typescript
// 陰陽遁判斷
// 冬至後：陽遁 (solarTermIndex 0-11)
// 夏至後：陰遁 (solarTermIndex 12-23)
const isYang = solarTermIndex >= 0 && solarTermIndex < 12;

// 局數計算（簡化版）
// 每五日一換局，一年 72 局
const juNumber = ((dayOfYear % 9) || 9);
```

### 4.2 天盤計算（三奇六儀）
- **陽遁**: 順行（1→2→3→4→6→7→8→9）
- **陰遁**: 逆行（1→9→8→7→6→4→3→2）
- **序列**: 戊己庚辛壬癸丁丙乙

### 4.3 人盤計算（八門）
- 根據局數確定值使門位置
- 陽遁順布，陰遁逆布
- 跳過中五宮

### 4.4 神盤計算（八神）
- **陽遁順序**: 值符→螣蛇→太陰→六合→白虎→玄武→九地→九天
- **陰遁順序**: 值符→九天→九地→玄武→白虎→六合→太陰→螣蛇

### 4.5 星盤計算（九星）
- 天蓬星隨局數起宮
- 陽遁順行，陰遁逆行
- 中五宮寄坤二宮

---

## 5. 資料模型

### 5.1 奇門盤結構 (QimenPlate)
```typescript
interface QimenPlate {
  date: string;                    // 日期
  yearGanZhi: string;              // 年干支
  monthGanZhi: string;             // 月干支
  dayGanZhi: string;               // 日干支
  hourGanZhi: string;              // 時干支
  juNumber: number;                // 局數 (1-9)
  isYang: boolean;                 // 是否陽遁
  yinYang: string;                 // '陽遁' | '陰遁'
  solarTerm: string;               // 節氣名稱
  earthPlate: Map<number, string>; // 地盤
  heavenPlate: Map<number, string>; // 天盤
  humanPlate: Map<number, string>;  // 人盤
  spiritPlate: Map<number, string>; // 神盤
  starsPlate: Map<number, string>;  // 星盤
}
```

### 5.2 Lunar API 數據結構
```typescript
interface LunarData {
  pillars: {
    year: string;   // 年干支
    month: string;  // 月干支
    day: string;    // 日干支
    hour: string;   // 時干支
  };
  solar_term: {
    index: number;  // 節氣索引 (0-23)
    name: string;     // 節氣名稱
    longitude: number; // 黃經度數
  };
  // ... 其他欄位
}
```

---

## 6. UI/UX 設計規格

### 6.1 盤面顯示規格
- **九宮格布局**: 3x3 網格，遵循洛書數順序
- **宮位順序**: 4(巽) 9(離) 2(坤) / 3(震) 5(中) 7(兌) / 8(艮) 1(坎) 6(乾)
- **中五宮**: 特殊標示，與坤二宮連動

### 6.2 顏色規範
| 元素 | 顏色 | 說明 |
|------|------|------|
| 天盤 | 預設文字色 | 大字體顯示 |
| 九星 | 藍色 (blue-600) | 次要資訊 |
| 八門-吉門 | 綠色 (green-600) | 休門、生門、開門 |
| 八門-凶門 | 紅色 (red-600) | 死門、驚門、傷門 |
| 八門-平門 | 黃色 (yellow-600) | 杜門、景門 |
| 八神 | 紫色 (purple-600) | 最小字體 |
| 地盤 | 灰色 (muted-foreground) | 最小字體 |

### 6.3 響應式設計
- **桌面版**: 最大寬度 4xl (896px)，九宮格比例 1:1
- **移動版**: 全寬顯示，最小高度 120px/宮

---

## 7. API 整合規格

### 7.1 Lunar-Zenith 服務
```
基礎 URL: http://localhost:8080
API 端點: /v1/calendar?date={YYYY-MM-DD}
方法: GET
響應格式: JSON
```

### 7.2 本地代理設定
```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: '/api/lunar/v1/:path*',
      destination: 'http://localhost:8080/v1/:path*',
    },
  ];
}
```

### 7.3 奇門遁甲 REST API（對外服務）

本專案同時對外提供 REST API，供外部應用調用。

#### 7.3.1 排盤 API
```
GET /api/qimen/plate?date={YYYY-MM-DD}&hour={0-23}

參數：
  - date: 日期（選填，預設今天）
  - hour: 小時數 0-23（選填，預設當前小時）→ 本地計算時柱

時柱計算：
  - 五鼠遁元法：根據日干推算時干
  - 十二時辰：根據 hour 對應地支
  - 早子時（23:00）：日柱自動按下一日計算

回應：
  - success: boolean
  - data: QimenPlateJSON（含天盤、地盤、人盤、神盤、星盤、時柱、時辰）
  - meta: { timestamp, version }

錯誤碼：
  - 400 INVALID_DATE: 日期格式錯誤
  - 400 INVALID_HOUR: 小時數無效
  - 503 LUNAR_SERVICE_UNAVAILABLE: 曆法服務不可用
```

#### 7.3.2 分析 API
```
GET /api/qimen/analysis?date={YYYY-MM-DD}&hour={0-23}&mode={basic|enhanced}

參數：
  - date: 日期（選填，預設今天）
  - hour: 小時數 0-23（選填，預設當前小時）→ 本地計算時柱
  - mode: basic（基礎分析）| enhanced（增強分析，含三奇六儀 + 門星神組合）

回應：
  - success: boolean
  - data:
    - plate: 排盤數據（含時柱、時辰）
    - analysis: 基礎分析（宮位評級、事項分析、整體趨勢）
    - enhanced: 增強分析（僅 mode=enhanced 時返回）
  - meta: { mode, timestamp, version }
```

#### 7.3.3 健康檢查 API
```
GET /api/qimen/health

回應：
  - status: "ok" | "degraded"
  - version: "1.0.0"
  - services: { qimen, lunar }
```

### 7.4 錯誤處理
- API 連接失敗時顯示友善錯誤訊息
- 提示使用者確認 lunar-zenith 服務已啟動
- REST API 統一錯誤回應格式：`{ error: string, code: string }`

---

## 8. 開發里程碑

### 8.1 已完成 ✅

#### v1.1.0 (2026-03-16) - API 服務增強
- [x] **時柱/時辰系統** (`hourPillar.ts`)
  - 五鼠遁元法本地計算時干
  - 十二時辰對應 24 小時制
  - 早子時自動處理（23:00 歸入下一日）
- [x] **問事類型系統** (`symbolism.ts`)
  - 13 種問事類型（財運、官運、感情、學業等）
  - 用神自動對應八門/九星
  - 六親關係選擇（後天八卦系統）
- [x] **九宮多維象徵系統** (`symbolism.ts`)
  - 人事象徵：六親人物角色
  - 身體象徵：臟腑、部位對應
  - 事務象徵：宜忌事項分類
  - 時間象徵：季節、節氣對應
- [x] **主事宮位視覺化**
  - 米黃色高亮顯示用神所在宮位
  - 九宮解說多維度呈現
- [x] **gRPC 服務接口** (`grpc-server.ts`)
  - CalculatePlate - 排盤計算
  - AnalyzePlate - 基礎分析
  - AnalyzeEnhanced - 增強分析
  - Health - 健康檢查
- [x] **API 文檔** (`API.md`)
  - REST API 使用說明
  - gRPC 服務定義
  - 問事類型對照表

#### v1.0.0 (2026-03-16) - 開源發布版本
- [x] Next.js + TypeScript + Tailwind CSS 專案建立
- [x] shadcn/ui 組件庫整合
- [x] 日家奇門核心排盤邏輯
- [x] 九宮格盤面視覺化
- [x] Lunar-Zenith API 整合
- [x] 基礎日期選擇與排盤功能
- [x] **三奇六儀知識庫** (`qiyiKnowledge.ts`)
  - 十天干克應組合（45種）
  - 古典斷語與現代建議
- [x] **門星神組合知識庫** (`combinationKnowledge.ts`)
  - 八門詳細解說（8門 x 8類事項）
  - 門星組合分析（64種）
  - 門神組合分析
- [x] **分析系統** (`QimenAnalysis.tsx`)
  - 基礎/進階雙模式
  - 三奇六儀詳解分頁
  - 門星神組合分頁
  - 宮位評級與建議
- [x] **開源準備**
  - 專業 README.md
  - MIT License
  - package.json 元數據完善
  - GitHub 倉庫建立

#### v0.1.0 (2026-03-16) - MVP 版本
- [x] 初始專案建立
- [x] 基礎排盤功能
- [x] 九宮格視覺化

### 8.2 下一階段 (v0.2.0)
- [ ] 局數計算精度優化
- [ ] 八門排法精確化
- [ ] 格局判斷基礎功能
- [ ] 盤面資訊豐富化（空亡、馬星等）

### 8.3 中長期規劃
- [ ] 月家奇門支援
- [ ] 時家奇門支援
- [ ] 解盤 AI 功能
- [ ] 案例管理系統
- [ ] 響應式移動版優化
- [ ] 列印/匯出功能

---

## 9. 技術債與優化項目

### 9.1 已知問題
1. **局數計算簡化**: 目前使用 dayOfYear % 9，需改為基於日干支的精確計算
2. **八門排法簡化**: 需根據專業奇門遁甲規則精確化
3. **中五宮處理**: 需更精確處理中五宮寄宮邏輯

### 9.2 性能優化
- [ ] 排盤計算結果快取
- [ ] 日期範圍批量查詢優化
- [ ] 組件渲染優化

---

## 10. 附錄

### 10.1 九宮八卦對照
| 宮位 | 卦名 | 方位 | 五行 | 洛書數 |
|------|------|------|------|--------|
| 坎一宮 | 坎 | 北 | 水 | 1 |
| 坤二宮 | 坤 | 西南 | 土 | 2 |
| 震三宮 | 震 | 東 | 木 | 3 |
| 巽四宮 | 巽 | 東南 | 木 | 4 |
| 中五宮 | 中 | 中央 | 土 | 5 |
| 乾六宮 | 乾 | 西北 | 金 | 6 |
| 兌七宮 | 兌 | 西 | 金 | 7 |
| 艮八宮 | 艮 | 東北 | 土 | 8 |
| 離九宮 | 離 | 南 | 火 | 9 |

### 10.2 二十四節氣索引
```
0:冬至  1:小寒  2:大寒  3:立春  4:雨水  5:驚蟄
6:春分  7:清明  8:谷雨  9:立夏  10:小滿  11:芒種
12:夏至  13:小暑  14:大暑  15:立秋  16:處暑  17:白露
18:秋分  19:寒露  20:霜降  21:立冬  22:小雪  23:大雪
```

### 10.3 三奇六儀序列
```
順序: 戊 → 己 → 庚 → 辛 → 壬 → 癸 → 丁 → 丙 → 乙
```

---

## 變更記錄

| 版本 | 日期 | 變更內容 | 作者 |
|------|------|---------|------|
| v1.2.0 | 2026-03-16 | Phase 4+5 完成：用神分析、生剋關係、時空分析、記錄管理、匯出功能 | Cascade |
| v1.0.0 | 2026-03-16 | 開源發布：三奇六儀/門星神知識庫、進階分析模式、專業文件 | Cascade |
| v0.1.0 | 2026-03-16 | 初始版本，MVP 功能完成 | Cascade |

---

## 相關資源

- **Lunar-Zenith 專案**: `/Users/kaecer/workspace/lunar-zenith`
- **開發環境**: http://localhost:3000
- **API 服務**: http://localhost:8080
