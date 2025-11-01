# ShortShare - 파일 공유 서비스 프론트엔드

FastAPI 백엔드와 연결된 React 기반 파일 공유 서비스 프론트엔드입니다.

## 📋 프로젝트 개요

**ShortShare**는 간편하고 빠른 파일 공유를 위한 웹 애플리케이션입니다.

### 주요 기능

- ✅ **사용자 인증**: 로그인/회원가입 기능
- 📤 **파일 업로드**: 드래그 앤 드롭 또는 클릭으로 파일 업로드
- 📥 **파일 다운로드**:
  - 개별 파일 다운로드
  - 여러 파일 일괄 다운로드
  - 폴더 선택하여 저장 (File System Access API 지원)
- 🔐 **관리자 기능**: 다운로드 로그 조회 및 파일 제한 관리
- 🎨 **모던 UI**: Tailwind CSS 기반의 깔끔한 디자인
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 🛠 기술 스택

- **React** 18.3.1 - UI 라이브러리
- **Vite** 5.4.11 - 빌드 도구
- **Tailwind CSS** 3.4.15 - 스타일링
- **Axios** 1.7.7 - HTTP 클라이언트
- **React Router** - 라우팅 (선택사항)

## 📦 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd fastapi_short_url_fe
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 백엔드 API URL을 설정합니다:

```bash
cp .env.example .env
```

`.env` 파일 내용:
```
VITE_API_BASE_URL=http://localhost:8000
```

### 4. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

### 5. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 6. 빌드 미리보기

```bash
npm run preview
```

## 📁 프로젝트 구조

```
fastapi_short_url_fe/
├── public/              # 정적 파일
├── src/
│   ├── components/      # React 컴포넌트
│   │   ├── Auth.jsx           # 로그인/회원가입
│   │   ├── FileUpload.jsx     # 파일 업로드
│   │   ├── FileDownload.jsx   # 파일 다운로드
│   │   └── DownloadLogs.jsx   # 관리자 로그
│   ├── utils/
│   │   └── api.js       # API 유틸리티 함수
│   ├── App.jsx          # 메인 앱 컴포넌트
│   ├── main.jsx         # 진입점
│   └── index.css        # 글로벌 스타일
├── index.html           # HTML 템플릿
├── package.json         # 프로젝트 설정
├── vite.config.js       # Vite 설정
└── tailwind.config.js   # Tailwind 설정
```

## 🎨 주요 컴포넌트

### Auth.jsx
- 로그인/회원가입 폼
- JWT 토큰 기반 인증
- localStorage를 통한 세션 관리

### FileUpload.jsx
- 드래그 앤 드롭 파일 업로드
- 파일 크기 및 정보 표시
- 업로드 진행 상태 표시

### FileDownload.jsx
- 파일 목록 조회 및 필터링
- 다중 파일 선택 및 일괄 다운로드
- 파일 타입별 분류 (이미지, 비디오, 문서 등)
- File System Access API를 활용한 폴더 선택 다운로드
- 관리자 전용 다운로드 제한 재설정

### DownloadLogs.jsx (관리자 전용)
- 다운로드 이력 조회
- 사용자, 파일명, 시각, IP 주소 표시

## 🔌 API 연동

백엔드 API와의 통신은 `src/utils/api.js`에서 관리됩니다.

주요 API 함수:
- `login()` - 로그인
- `register()` - 회원가입
- `uploadFile()` - 파일 업로드
- `getFiles()` - 파일 목록 조회
- `downloadFile()` - 파일 다운로드
- `getDownloadLogs()` - 다운로드 로그 조회 (관리자)
- `resetFileDownloads()` - 다운로드 제한 재설정 (관리자)

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: 하늘색 계열 (#0ea5e9)
- **Accent**: 보라색 계열 (#a855f7)
- **Surface**: 회색 계열 (#fafafa ~ #171717)

### 주요 디자인 원칙
- 8px 그리드 시스템
- 충분한 여백과 명확한 계층 구조
- 부드러운 그라디언트와 그림자
- 접근성을 고려한 명암비
- 반응형 레이아웃

## 🌐 브라우저 지원

- Chrome/Edge (최신)
- Firefox (최신)
- Safari (최신)

**File System Access API**는 Chrome/Edge에서만 지원됩니다. 다른 브라우저에서는 기본 다운로드 방식으로 작동합니다.

## 📝 개발 가이드

### 코드 스타일
- ESLint와 Prettier를 사용한 일관된 코드 스타일
- 컴포넌트는 함수형 컴포넌트 사용
- React Hooks 활용

### 상태 관리
- useState, useEffect를 사용한 로컬 상태 관리
- localStorage를 통한 인증 정보 저장

### API 호출
- Axios interceptor를 통한 자동 토큰 추가
- 401 에러 시 자동 로그아웃 처리

## 🔒 보안

- JWT 토큰 기반 인증
- CORS 설정 필요 (백엔드)
- XSS 방지를 위한 React 기본 보호
- 환경 변수를 통한 민감 정보 관리

## 🚀 배포

### Vercel 배포
```bash
npm run build
vercel --prod
```

### Netlify 배포
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📄 라이선스

이 프로젝트는 교육 목적으로 만들어졌습니다.

## 👥 기여

버그 리포트나 기능 제안은 이슈로 등록해주세요.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해주세요.

---

**ShortShare** - 간편하고 빠른 파일 공유 서비스 ⚡
