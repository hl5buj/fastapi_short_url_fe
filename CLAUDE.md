# 프로젝트 개요

FastAPI 백엔드와 연결된 React 프론트엔드 프로젝트에 대한 주요 정보를 제공합니다.

## 아키텍처 (Architecture)

* **백엔드**: Python, **FastAPI** (고성능 비동기 API)
* **프론트엔드**: JavaScript/TypeScript, **React** (UI 라이브러리)
* **스타일링**: Tailwind CSS

## 개발 환경 설정

### 백엔드 (FastAPI)

1.  Python 환경을 설정하고 가상 환경 활성화:
    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/macOS
    .\venv\Scripts\activate   # Windows (CMD)
    ```
2.  요구 사항 설치:
    ```bash
    pip install -r requirements.txt 
    ```
3.  개발 서버 실행 (예시):
    ```bash
    uvicorn main:app --reload
    ```

### 프론트엔드 (React)

1.  의존성 설치:
    ```bash
    npm install  # 또는 yarn install
    ```
2.  개발 서버 실행:
    ```bash
    npm run dev  # 또는 yarn dev
    ```

## API 통신 (FastAPI <=> React)

* **기본 URL**: `http://127.0.0.1:8000/api/v1/` (FastAPI 서버 주소)
* **데이터 형식**: JSON
* **CORS**: 프론트엔드가 백엔드와 통신할 수 있도록 **FastAPI에 CORS 미들웨어 설정**이 필수적입니다.
    
    > **참고**: 개발 중에는 `http://localhost:3000` (React 기본 포트)를 허용해야 합니다.

## 📝 주요 개발 지침

1.  **컴포넌트 재사용**: 모든 UI 요소는 재사용 가능한 React 컴포넌트로 만드세요.
2.  **상태 관리**: 전역 상태 관리가 필요한 경우, [Redux / Zustand / Recoil 중 선택]을 사용합니다.
3.  **코드 스타일**: ESLint와 Prettier를 사용하여 일관된 코드 스타일을 유지합니다.
4.  **타입스크립트**: 가능하면 타입스크립트를 사용하여 안정성을 높입니다.

## 프로젝트 개요
- **목표**: index.html 파일 기반 프론트엔드 개발
- **API 연동**: localhost:8000 (openapi.json 활용)
- **디자인 참고**: https://www.youtube.com/

---

## 좋은 디자인 공식

### 1. 레이아웃 & 간격
- 8px 그리드 시스템 (8, 16, 24, 32, 40px...)
- Spacing scale: 4, 8, 16, 24, 32, 48, 64px
- 충분한 여백 확보

### 2. 타이포그래피
- Type Scale: 1.25 또는 1.333 비율
- Line height: 본문 1.5-1.7, 제목 1.2-1.3
- 텍스트 폭: 최대 60-75자/줄
- 폰트: 최대 2-3개

### 3. 색상
- 60-30-10 규칙 (주 60%, 보조 30%, 강조 10%)
- 명도 9-11단계
- 명암비: 최소 4.5:1 (WCAG AA)

### 4. 시각적 계층
- 크기, 색상, 굵기로 중요도 표현
- 연관 요소는 가깝게, 다른 그룹은 멀게

### 5. 반응형
- 모바일 우선
- Breakpoints: ~640px / 641-1024px / 1025px~
- 최대 너비: 1200-1440px

### 6. 인터랙션
- 호버 효과 필수
- 전환: 200-300ms
- 로딩 상태 표시

### 7. 컴포넌트
- 버튼/입력: 40px, 48px, 56px
- 모서리: 4px, 8px, 16px 중 선택
- 그림자: 3-4단계

### 8. 콘텐츠
- F-패턴/Z-패턴 활용
- 스캔 가능하게 구조화
- 명확한 대비

### 9. 성능
- 이미지 최적화 (WebP, lazy loading)
- transform/opacity 애니메이션
- font-display: swap

### 10. 접근성
- 키보드 네비게이션
- 스크린 리더 호환
- 터치 영역: 최소 44x44px
- 색상 외 정보 전달 수단 제공

---

## API 연동
- **Base URL**: http://localhost:8000
- **OpenAPI Spec**: openapi.json 참조
- CORS 설정 확인 필요