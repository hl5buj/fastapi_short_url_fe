# API 호환성 체크리스트

## ✅ 백엔드 vs 프론트엔드 API 비교

### 1. 파일 업로드 (`/upload`)
- **백엔드**: POST `/upload` - **인증 불필요**
- **프론트엔드**: POST `/upload` - 토큰 자동 추가 (있으면)
- **상태**: ⚠️ **주의** - 백엔드는 인증 불필요, 프론트엔드는 로그인 후에만 업로드 UI 표시
- **권장**: 백엔드에 인증 추가 권장 (보안)

### 2. 파일 다운로드 (`/download/{short_id}`)
- **백엔드**: GET `/download/{short_id}` - **인증 필수** (get_current_user)
- **프론트엔드**: GET `/download/{short_id}` - 토큰 자동 추가
- **상태**: ✅ **일치**

### 3. 파일 정보 조회 (`/info/{short_id}`)
- **백엔드**: GET `/info/{short_id}` - **인증 불필요**
- **프론트엔드**: GET `/info/{short_id}` - 토큰 자동 추가 (있으면)
- **상태**: ✅ **일치**

### 4. 파일 목록 조회 (`/files`)
- **백엔드**: GET `/files` - **인증 불필요**
- **프론트엔드**: GET `/files` - 토큰 자동 추가 (있으면)
- **상태**: ✅ **일치**

### 5. 파일 삭제 (`/files/{short_id}`)
- **백엔드**: DELETE `/files/{short_id}` - **인증 불필요**
- **프론트엔드**: DELETE `/files/{short_id}` - 토큰 자동 추가 (있으면)
- **상태**: ⚠️ **주의** - 백엔드에 인증 추가 권장 (보안)

### 6. 회원가입 (`/auth/register`)
- **백엔드**: POST `/auth/register`
  - 요청: `{ username, email, password }`
  - 응답: `{ access_token, token_type, user: {...} }`
- **프론트엔드**: POST `/auth/register` - 동일
- **상태**: ✅ **일치**

### 7. 로그인 (`/auth/login`)
- **백엔드**: POST `/auth/login`
  - 요청: `{ username, password }`
  - 응답: `{ access_token, token_type, user: {...} }`
- **프론트엔드**: POST `/auth/login` - 동일
- **상태**: ✅ **일치**

### 8. 내 정보 조회 (`/auth/me`)
- **백엔드**: GET `/auth/me` - **인증 필수**
- **프론트엔드**: GET `/auth/me` - 구현됨
- **상태**: ✅ **일치**

### 9. 다운로드 로그 (`/admin/download-logs`)
- **백엔드**: GET `/admin/download-logs` - **관리자 인증 필수**
  - 응답: `{ logs: [...], total: number }`
- **프론트엔드**: GET `/admin/download-logs` - 동일
- **상태**: ✅ **일치**

### 10. 다운로드 제한 재설정 (`/admin/files/{short_id}/reset-downloads`)
- **백엔드**: PATCH `/admin/files/{short_id}/reset-downloads?new_max_downloads={number}` - **관리자 인증 필수**
  - Query Parameter: `new_max_downloads` (int)
  - 응답: `{ message, short_id, max_downloads, download_count, is_active }`
- **프론트엔드**: PATCH `/admin/files/{short_id}/reset-downloads` - params로 전달
- **상태**: ✅ **일치**

---

## 🔧 필요한 수정 사항

### 백엔드 수정 (보안 강화)

#### 1. 파일 업로드에 인증 추가
```python
@app.post("/upload", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),  # 추가
    db: AsyncSession = Depends(get_db)
):
```

#### 2. 파일 삭제에 인증 추가
```python
@app.delete("/files/{short_id}")
async def delete_shared_file(
    short_id: str,
    current_user: User = Depends(get_current_user),  # 추가
    db: AsyncSession = Depends(get_db)
):
```

### 프론트엔드 수정 (필요시)

현재 프론트엔드는 로그인 후에만 업로드/다운로드 UI를 보여주므로, 백엔드에 인증을 추가하면 완벽히 일치합니다.

---

## 📊 응답 형식 확인

### FileUploadResponse
```json
{
  "short_id": "abc12345",
  "short_url": "http://localhost:8000/download/abc12345",
  "original_filename": "document.pdf",
  "file_size": 1024000,
  "expires_at": "2025-11-02T10:00:00",
  "max_downloads": 3
}
```

### FileInfoResponse (파일 목록 개별 항목)
```json
{
  "short_id": "abc12345",
  "original_filename": "document.pdf",
  "file_size": 1024000,
  "content_type": "application/pdf",
  "created_at": "2025-11-01T10:00:00",
  "expires_at": "2025-11-02T10:00:00",
  "download_count": 1,
  "max_downloads": 3,
  "is_active": true,
  "remaining_downloads": 2
}
```

### Token (로그인/회원가입 응답)
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "is_admin": false,
    "is_active": true,
    "created_at": "2025-11-01T10:00:00"
  }
}
```

---

## 🧪 테스트 시나리오

### 1. 회원가입 테스트
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
```

### 2. 로그인 테스트
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

### 3. 파일 업로드 테스트
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@test.txt"
```

### 4. 파일 목록 조회 테스트
```bash
curl http://localhost:8000/files
```

### 5. 파일 다운로드 테스트 (인증 필요)
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8000/download/{short_id} \
  -o downloaded_file
```

---

## ✅ 최종 체크리스트

- [x] CORS 설정 확인 (localhost:3000 허용)
- [x] 인증 토큰 자동 추가 (axios interceptor)
- [x] 401 에러 시 자동 로그아웃
- [ ] 백엔드 업로드 엔드포인트에 인증 추가 (권장)
- [ ] 백엔드 삭제 엔드포인트에 인증 추가 (권장)
- [ ] 실제 브라우저 테스트
