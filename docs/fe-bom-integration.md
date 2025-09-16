## Frontend BOM API Integration Guide

This document is a concise, implementation-ready spec for a frontend AI agent to integrate the BOM endpoints exposed by the backend service in this repository.

### Base
- **Base URL**: `{{BASE_API}}` = `http://localhost:3000/api/v1`
- **Auth**: none required
- **Headers**: `Content-Type: application/json` for write operations

### Error shape
All errors conform to:
```json
{
  "statusCode": number,
  "timestamp": string,
  "path": string,
  "method": string,
  "message": string
}
```

### Endpoints

1) List BOM entries
- Method: GET
- Path: `/bom`
- Query params:
  - `rootId` (optional, number): filter by root product ID
  - `page` (optional, number, default 0): zero-based index
  - `size` (optional, number, default 20, max 50)
  - `sortBy` (optional, enum: `createdDate|lastModifiedDate|productId`, default `createdDate`)
  - `sortDir` (optional, enum: `asc|desc`, default `desc`)
- Response body:
```ts
type BomListResponseDto = {
  results: BomResponseDto[];
  pageSize: number;
  sortBy: string;
  isLastItem: boolean;
  totalPage: number;
  totalElement: number;
  filterConfig: {
    supportedFields: Array<{
      fieldName: string;
      displayName: string;
      operator: 'EQ';
      type: 'DATE'|'STRING'|'NUMBER';
      alternativeOperators: ('EQ')[];
      suggestionValues: Array<{ identifyValue: string; displayValue: string }>;
    }>;
    supportedSorts: string[];
  };
}

type BomResponseDto = {
  createdDate: string;
  lastModifiedDate: string;
  createdBy: string;
  modifiedBy: string;
  id: number;
  productId: number;
  productPartPath: string;
  quantityOfProd: number;
  materialId: string;
  quantityOfMaterials: number;
  tileHH: string;
  applicationDate: string;
  endDate: string | null;
  tkVatTu: string | null;
  tkh: string | null;
}
```

2) Get BOM by id
- Method: GET
- Path: `/bom/:id`
- Path params: `id` (number)
- Response: `BomResponseDto`

3) Create BOM
- Method: POST
- Path: `/bom`
- Body: see backend DTO `CreateBomDto` (fields include `rootProductId`, `productId`/component, quantities, etc.)
- Response: `BomResponseDto`

4) Update BOM
- Method: PUT
- Path: `/bom/:id`
- Body: see `UpdateBomDto`
- Response: `BomResponseDto`

5) Delete BOM
- Method: DELETE
- Path: `/bom/:id`
- Response: 204 No Content

6) Get BOM tree (forest)
- Method: GET
- Path: `/bom/tree`
- Query params (optional):
  - `rootId` (number) — if provided, returns a single tree for that root; if omitted, returns a forest for all roots
- Response:
```ts
type BomTreeNodeDto = {
  id: number;
  productId: number;
  productPartPath: string;
  quantityOfProd: number;
  materialId: string;
  quantityOfMaterials: number;
  children: BomTreeNodeDto[];
}
// GET /bom/tree returns BomTreeNodeDto[] (list of root nodes)
```

### TypeScript client interfaces
```ts
export type SortDir = 'asc' | 'desc';

export interface ListBomQuery {
  rootId?: number;
  page?: number; // default 0
  size?: number; // default 20, max 50
  sortBy?: 'createdDate' | 'lastModifiedDate' | 'productId';
  sortDir?: SortDir;
}

export interface ApiErrorShape {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
}
```

### Fetch examples (Axios)
```ts
import axios from 'axios';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3000/api/v1' });

export async function fetchBomList(params: ListBomQuery) {
  const { data } = await api.get('/bom', { params });
  return data as BomListResponseDto;
}

export async function fetchBomTree(rootId?: number) {
  const { data } = await api.get('/bom/tree', { params: rootId ? { rootId } : undefined });
  return data as BomTreeNodeDto[];
}

export async function fetchBomById(id: number) {
  const { data } = await api.get(`/bom/${id}`);
  return data as BomResponseDto;
}
```

### React Query hooks (optional)
```ts
import { useQuery } from '@tanstack/react-query';

export const useBomList = (params: ListBomQuery) =>
  useQuery({ queryKey: ['bom-list', params], queryFn: () => fetchBomList(params), staleTime: 60_000 });

export const useBomTree = (rootId?: number) =>
  useQuery({ queryKey: ['bom-tree', rootId ?? 'all'], queryFn: () => fetchBomTree(rootId), staleTime: 60_000 });
```

### UI guidelines
- BOM list view should expose filters: `rootId`, `page`, `size`, `sortBy`, `sortDir`.
- Pagination is zero-based; convert from 1-based UI if needed.
- BOM tree view:
  - If user selects a root, call `/bom/tree?rootId=...` for a single tree.
  - If not, call `/bom/tree` to render a forest; group by root product.
  - Render `children` recursively.

### Validation notes
- Unknown query params are rejected (strict validation). Use `size`, not `limit`.
- `rootId` is optional for `/bom/tree` but must be a numeric value when provided.

### Testing
- Example URLs:
  - `GET {{BASE_API}}/bom?rootId=1&page=0&size=10`
  - `GET {{BASE_API}}/bom/tree`
  - `GET {{BASE_API}}/bom/tree?rootId=1`

### Versioning
- API is versioned via URL prefix; keep `api/v1` in FE config.


