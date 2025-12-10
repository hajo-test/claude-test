# MyTODO - 개인용 할일 관리 웹서비스

토스 디자인 스타일의 깔끔한 할일 관리 애플리케이션입니다.

## 기능

- ✅ TODO 추가/조회/수정/삭제 (CRUD)
- ✅ 완료/미완료 상태 토글
- ✅ 전체/진행중/완료 필터링
- ✅ 할일 통계 (전체/완료)
- ✅ 모바일 반응형 디자인
- ✅ 로그인 불필요 (개인용)

## 기술 스택

- **Frontend**: HTML + Tailwind CSS + Vanilla JavaScript
- **Backend**: Cloudflare Pages Functions
- **Database**: Cloudflare D1
- **Deployment**: Cloudflare Pages

## 프로젝트 구조

```
todo-app/
├── public/                    # 프론트엔드 정적 파일
│   └── index.html            # 메인 페이지 (Tailwind CSS)
├── functions/                 # 백엔드 API
│   └── api/
│       ├── todos.js          # GET, POST /api/todos
│       └── todos/[id].js     # PUT, DELETE /api/todos/:id
├── schema.sql                 # D1 데이터베이스 스키마
├── wrangler.toml             # Cloudflare 설정
└── package.json
```

## 배포 방법

### 1. Cloudflare 대시보드에서 Pages 프로젝트 생성

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 로그인
2. **Workers & Pages** 페이지로 이동
3. **Create application** > **Pages** > **Connect to Git** 선택
4. **GitHub** 선택 후 이 저장소 연결: `hajo-test/claude-test`

### 2. 빌드 설정

프로젝트 설정 페이지에서 다음 내용을 입력:

- **Project name**: `mytodo` (원하는 이름)
- **Production branch**: `main`
- **Build command**: (비워두기 - 정적 파일만 배포)
- **Build output directory**: `public`

### 3. 환경 변수 및 바인딩 설정

**Settings** > **Functions** > **D1 database bindings** 섹션에서:

- **Variable name**: `DB`
- **D1 Database**: `mytodo-db` 선택

### 4. 배포

설정을 저장하면 자동으로 배포가 시작됩니다. 배포가 완료되면 제공된 URL로 접속하여 사용할 수 있습니다.

**배포된 URL 형식**: `https://mytodo.pages.dev` (프로젝트명에 따라 다름)

## 로컬 개발

### 필수 요구사항

- Node.js 16 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# Wrangler 설치
npm install -g wrangler

# 로그인
wrangler login

# 로컬 개발 서버 실행
wrangler pages dev public --d1 DB=mytodo-db

# 또는 package.json 스크립트 사용
npm run dev
```

로컬 서버는 `http://localhost:8788`에서 실행됩니다.

## API 엔드포인트

### GET /api/todos
모든 할일 조회

**Response**:
```json
{
  "todos": [
    {
      "id": 1,
      "title": "장보기",
      "completed": 0,
      "created_at": "2024-01-01 10:00:00",
      "updated_at": "2024-01-01 10:00:00"
    }
  ]
}
```

### POST /api/todos
새 할일 생성

**Request**:
```json
{
  "title": "운동하기"
}
```

**Response**:
```json
{
  "todo": {
    "id": 2,
    "title": "운동하기",
    "completed": 0,
    "created_at": "2024-01-01 11:00:00",
    "updated_at": "2024-01-01 11:00:00"
  }
}
```

### PUT /api/todos/:id
할일 수정

**Request**:
```json
{
  "completed": 1
}
```

**Response**:
```json
{
  "todo": {
    "id": 2,
    "title": "운동하기",
    "completed": 1,
    "created_at": "2024-01-01 11:00:00",
    "updated_at": "2024-01-01 11:30:00"
  }
}
```

### DELETE /api/todos/:id
할일 삭제

**Response**:
```json
{
  "message": "Todo deleted successfully"
}
```

## 데이터베이스

### D1 Database 정보

- **Database Name**: `mytodo-db`
- **Database ID**: `63cef4be-5120-4f2c-b257-a68f4909ce32`

### 스키마

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_completed ON todos(completed);
CREATE INDEX idx_created_at ON todos(created_at DESC);
```

## 라이선스

MIT
