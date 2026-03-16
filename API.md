# 奇門遁甲服務 API 文檔

本文檔說明奇門遁甲排盤與分析服務的 REST 和 gRPC 接口。

## 服務概述

| 協議 | 地址 | 說明 |
|------|------|------|
| REST API | `http://localhost:3000/api` | HTTP/JSON 接口 |
| gRPC | `localhost:50051` | Protocol Buffers 接口 |

---

## REST API

### 端點列表

#### 1. 排盤計算
```
GET /api/qimen/plate?date=YYYY-MM-DD&hour=0-23
```

#### 2. 基礎分析
```
GET /api/qimen/analysis?date=YYYY-MM-DD&hour=0-23&mode=basic
```

#### 3. 增強分析
```
GET /api/qimen/analysis?date=YYYY-MM-DD&hour=0-23&mode=enhanced
```

### 參數說明

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| date | string | 否 | 日期 `YYYY-MM-DD`，預設今天 |
| hour | integer | 否 | 小時 0-23，預設當前 |
| mode | string | 否 | `basic` 或 `enhanced`，預設 `basic` |

---

## gRPC API

### 服務定義

```protobuf
service QimenService {
  rpc CalculatePlate(CalculatePlateRequest) returns (CalculatePlateResponse);
  rpc AnalyzePlate(AnalyzePlateRequest) returns (AnalyzePlateResponse);
  rpc AnalyzeEnhanced(AnalyzeEnhancedRequest) returns (AnalyzeEnhancedResponse);
  rpc Health(HealthRequest) returns (HealthResponse);
}
```

### 運行 gRPC 服務器

```bash
npm run grpc
# 或
GRPC_PORT=50051 npx ts-node src/server/grpc-server.ts
```

---

## 啟動所有服務

```bash
# 1. 啟動 Next.js 開發服務器（REST API）
npm run dev

# 2. 啟動 gRPC 服務器（在另一個終端）
npm run grpc
```

## 問事類型 (MatterType)

| 類型 | 說明 | 用神 |
|------|------|------|
| general | 一般綜合 | 中宮 |
| wealth | 財運求財 | 生門 |
| career | 官運事業 | 開門 |
| travel | 出行遠行 | 景門 |
| health | 健康疾病 | 死門/天芮 |
| relationship | 人際感情 | 休門 |
| study | 學業考試 | 景門/天輔 |
| lost | 尋人失物 | 杜門 |
| legal | 訴訟官非 | 驚門 |
| property | 田宅房產 | 死門 |
| marriage | 婚姻感情 | 休門 |
| business | 生意投資 | 生門/開門 |
| litigation | 爭訟糾紛 | 驚門/傷門 |

---

## Proto 文件位置

`proto/qimen.proto` - gRPC 服務協議定義

