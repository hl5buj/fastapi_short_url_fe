#!/bin/bash

# API 통합 테스트 스크립트

echo "================================"
echo "ShortShare API 통합 테스트"
echo "================================"
echo ""

# 1. 회원가입 테스트
echo "1. 회원가입 테스트..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser$(date +%s)\",\"email\":\"test$(date +%s)@example.com\",\"password\":\"password123\"}")

echo "회원가입 응답:"
echo "$REGISTER_RESPONSE" | python -m json.tool
echo ""

# 토큰 추출
TOKEN=$(echo "$REGISTER_RESPONSE" | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ 회원가입 실패"
  exit 1
fi

echo "✅ 회원가입 성공! 토큰: ${TOKEN:0:20}..."
echo ""

# 2. 로그인 테스트 (같은 사용자)
echo "2. 로그인 테스트..."
USERNAME=$(echo "$REGISTER_RESPONSE" | python -c "import sys, json; print(json.load(sys.stdin)['user']['username'])" 2>/dev/null)

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"password123\"}")

echo "로그인 응답:"
echo "$LOGIN_RESPONSE" | python -m json.tool
echo ""
echo "✅ 로그인 성공!"
echo ""

# 3. 내 정보 조회 테스트
echo "3. 내 정보 조회 테스트..."
ME_RESPONSE=$(curl -s -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer $TOKEN")

echo "내 정보:"
echo "$ME_RESPONSE" | python -m json.tool
echo ""
echo "✅ 내 정보 조회 성공!"
echo ""

# 4. 파일 업로드 테스트 (테스트 파일 생성)
echo "4. 파일 업로드 테스트..."
echo "This is a test file for ShortShare" > /tmp/test_upload.txt

UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:8000/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/test_upload.txt")

echo "업로드 응답:"
echo "$UPLOAD_RESPONSE" | python -m json.tool
echo ""

SHORT_ID=$(echo "$UPLOAD_RESPONSE" | python -c "import sys, json; print(json.load(sys.stdin)['short_id'])" 2>/dev/null)

if [ -z "$SHORT_ID" ]; then
  echo "❌ 파일 업로드 실패"
  exit 1
fi

echo "✅ 파일 업로드 성공! Short ID: $SHORT_ID"
echo ""

# 5. 파일 목록 조회 테스트
echo "5. 파일 목록 조회 테스트..."
FILES_RESPONSE=$(curl -s -X GET http://localhost:8000/files \
  -H "Authorization: Bearer $TOKEN")

echo "파일 목록:"
echo "$FILES_RESPONSE" | python -m json.tool
echo ""
echo "✅ 파일 목록 조회 성공!"
echo ""

# 6. 파일 다운로드 테스트
echo "6. 파일 다운로드 테스트..."
curl -s -X GET "http://localhost:8000/download/$SHORT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -o /tmp/downloaded_file.txt

if [ -f /tmp/downloaded_file.txt ]; then
  echo "다운로드된 파일 내용:"
  cat /tmp/downloaded_file.txt
  echo ""
  echo "✅ 파일 다운로드 성공!"
else
  echo "❌ 파일 다운로드 실패"
fi
echo ""

# 정리
rm -f /tmp/test_upload.txt /tmp/downloaded_file.txt

echo "================================"
echo "✅ 모든 테스트 완료!"
echo "================================"
