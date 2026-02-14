# NestJS 電商後端實作 (Ecommerce Backend)

這是一個基於 **NestJS + TypeORM + PostgreSQL** 構建的簡易電商後端系統。本專案旨在展示對 NestJS 架構的理解、資料庫關聯設計，以及處理核心商業邏輯中資料一致性的能力。

## 🚀 核心亮點

- **資料庫交易 (Database Transaction)**：下單流程嚴格執行 ACID 事務，確保庫存扣減與訂單建立的一致性。
- **高併發處理 (Concurrency Control)**：採用 **Pessimistic Write Lock (悲觀鎖)** 解決超賣問題，確保在高併發請求下庫存扣減的正確性。
- **角色權限管理 (RBAC)**：透過 JWT 與 Custom Decorators 實現管理員 (Admin) 與一般顧客 (Customer) 的權限控管。
- **自動化文件 (Swagger)**：完整整合 Swagger 介面，方便測試與開發。
- **容器化 (Docker)**：提供 Docker Compose 配置文件，實現一鍵式環境部署。

---

## 🛠 技術棧

- **框架**: NestJS (v11)
- **語言**: TypeScript
- **資料庫**: PostgreSQL
- **ORM**: TypeORM
- **認證**: Passport-JWT
- **文件**: Swagger UI
- **部署**: Docker / Docker Compose

---

## 📊 資料庫設計 (Schema)

系統包含四張核心資料表：

1.  **User**: 使用者資訊，區分 `admin` 與 `customer` 角色。
- `id`: UUID (Primary Key)
- `email`: string (Unique)
- `password`: string (Hashed)
- `role`: enum ('admin', 'customer') — *用於權限控管*

2.  **Product**: 商品資訊，包含價格與即時庫存。
- `id`: UUID (Primary Key)
- `title`: string
- `price`: decimal/number
- `stock`: integer — *庫存數量*

3.  **Order**: 訂單主表，紀錄總金額與訂單狀態。
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key)
- `totalPrice`: decimal — *訂單總金額*
- `status`: enum ('pending', 'completed', 'cancelled')
- `createdAt`: timestamp

4.  **OrderItem**: 訂單明細，紀錄購買時的快照價格，避免商品調價影響歷史紀錄。
- `id`: UUID (Primary Key)
- `orderId`: UUID (Foreign Key)
- `productId`: UUID (Foreign Key)
- `price`: decimal — *購買時的單價*
- `quantity`: integer
    
---

## 🚦 API 端點說明

### 1. 認證模組 (Auth)
- `POST /auth/signup`: 註冊新帳號。
- `POST /auth/login`: 登入並獲取 JWT Token。

### 2. 商品模組 (Product)
- `GET /products`: 列出所有商品 (公開 API)。
- `POST /products`: 新增商品 (**僅限 Admin**)。

### 3. 訂單模組 (Order)
- `POST /orders`: 建立訂單 (**需驗證庫存、扣減庫存、交易保護**)。
- `GET /orders/:id`: 查詢特定訂單詳情。

---

## 🧪 重點邏輯實現

### 超賣問題與交易處理
在 `OrdersService.create` 中，我們採用了以下策略：
1.  **交易封裝**: 使用 `dataSource.transaction` 確保所有步驟（查庫存 -> 扣庫存 -> 建訂單）在同一事務中。
2.  **悲觀鎖**: 查詢商品時使用 `pessimistic_write` 鎖定該行資料，防止其他事務在同一時間修改庫存。
3.  **自動回滾**: 若庫存不足或任何步驟發生錯誤，事務會自動回滾，確保資料庫一致性。

```typescript
// 程式碼片段範例 (OrdersService)
await this.dataSource.transaction(async (manager: EntityManager) => {
  const product = await manager.findOne(Product, {
    where: { id: productId },
    lock: { mode: 'pessimistic_write' }, // 鎖定行
  });
  // ... 檢查與更新 ...
});
```

---

## 📦 如何執行

### 方法一：使用 Docker (推薦)
1. 確保已安裝 Docker 與 Docker Compose。
2. 在根目錄執行：
   ```bash
   docker-compose up --build
   ```
3. API 將運行在 `http://localhost:3000`。
4. Swagger 文件位於 `http://localhost:3000/api`。

### 方法二：手動執行
1. 安裝依賴：
   ```bash
   npm install
   ```
2. 建立 `.env` 檔案並參考 `.env.example` 設定資料庫連接。
3. 啟動資料庫 (PostgreSQL)。
4. 啟動應用：
   ```bash
   npm run start:dev
   ```

---

## 📄 API 文件
啟動服務後，請訪問 `http://localhost:3000/api` 查看詳細的 Swagger API 文件。
檔案中包含所有的 DTO 結構、參數要求與回傳格式。
