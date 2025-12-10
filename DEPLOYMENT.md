# 배포 가이드

MyTodo 웹서비스를 Cloudflare Pages에 배포하는 방법입니다.

## 준비 완료 항목 ✅

- ✅ D1 데이터베이스 생성 완료 (`mytodo-db`)
- ✅ 데이터베이스 테이블 및 인덱스 생성 완료
- ✅ 프론트엔드 코드 작성 완료 (public/index.html)
- ✅ API 엔드포인트 작성 완료 (functions/api/)
- ✅ GitHub 저장소에 푸시 완료
- ✅ Wrangler 설치 완료

## 배포 방법 (2가지 옵션)

### 옵션 1: Cloudflare Dashboard를 통한 Git 연동 배포 (권장)

가장 간단하고 자동화된 방법입니다. GitHub 저장소와 연결하면 이후 코드 변경 시 자동으로 배포됩니다.

#### 단계:

1. **Cloudflare Dashboard 접속**
   - https://dash.cloudflare.com 로그인
   - **Workers & Pages** 선택

2. **Pages 프로젝트 생성**
   - **Create application** 클릭
   - **Pages** 탭 선택
   - **Connect to Git** 클릭

3. **GitHub 저장소 연결**
   - **GitHub** 선택
   - 저장소 접근 권한 승인
   - `hajo-test/claude-test` 저장소 선택
   - **Begin setup** 클릭

4. **빌드 설정**
   ```
   Project name: mytodo (또는 원하는 이름)
   Production branch: main
   Build command: (비워두기)
   Build output directory: public
   ```

5. **D1 바인딩 설정**
   - 배포가 완료된 후, **Settings** > **Functions** 로 이동
   - **D1 database bindings** 섹션에서 **Add binding** 클릭
   - Variable name: `DB`
   - D1 Database: `mytodo-db` 선택
   - **Save** 클릭

6. **재배포**
   - D1 바인딩 설정 후, **Deployments** 탭에서 **Retry deployment** 클릭
   - 또는 GitHub에 새 커밋을 푸시

7. **완료!**
   - 배포 완료 후 제공되는 URL로 접속
   - 예: `https://mytodo.pages.dev`

### 옵션 2: Wrangler CLI를 통한 Direct Upload 배포

CLI를 통해 직접 배포하는 방법입니다.

#### 단계:

1. **API 토큰 생성**
   - https://dash.cloudflare.com/profile/api-tokens 접속
   - **Create Token** 클릭
   - **Edit Cloudflare Workers** 템플릿 사용
   - 또는 **Create Custom Token**으로 다음 권한 설정:
     - Account > Cloudflare Pages > Edit
     - Account > D1 > Read
   - 생성된 토큰 복사

2. **환경 변수 설정**

   **Windows (PowerShell):**
   ```powershell
   $env:CLOUDFLARE_API_TOKEN="your-api-token-here"
   $env:CLOUDFLARE_ACCOUNT_ID="7feff4292cc17c79a57a179c6679ddc2"
   ```

   **Windows (CMD):**
   ```cmd
   set CLOUDFLARE_API_TOKEN=your-api-token-here
   set CLOUDFLARE_ACCOUNT_ID=7feff4292cc17c79a57a179c6679ddc2
   ```

   **Linux/Mac:**
   ```bash
   export CLOUDFLARE_API_TOKEN="your-api-token-here"
   export CLOUDFLARE_ACCOUNT_ID="7feff4292cc17c79a57a179c6679ddc2"
   ```

3. **배포 실행**
   ```bash
   wrangler pages deploy public --project-name=mytodo
   ```

4. **D1 바인딩 설정**

   배포 후 `wrangler.toml` 파일의 D1 설정이 자동으로 적용되지 않을 수 있습니다.
   이 경우 Cloudflare Dashboard에서 수동으로 바인딩을 추가해야 합니다:

   - Dashboard > Workers & Pages > mytodo 선택
   - **Settings** > **Functions** > **D1 database bindings**
   - Variable name: `DB`
   - D1 Database: `mytodo-db`

5. **완료!**
   - 터미널에 표시된 URL로 접속
   - 예: `https://mytodo.pages.dev`

## 배포 후 확인사항

배포가 완료되면 다음을 확인하세요:

1. **웹사이트 접속**
   - 제공된 URL로 접속하여 페이지가 로드되는지 확인

2. **D1 바인딩 확인**
   - 할일을 추가해보고 정상 작동하는지 확인
   - 브라우저 개발자 도구의 Console 탭에서 에러 확인

3. **API 테스트**
   - 할일 추가 (POST)
   - 할일 조회 (GET)
   - 할일 완료 토글 (PUT)
   - 할일 삭제 (DELETE)

## 문제 해결

### "Failed to fetch todos" 에러가 발생하는 경우

- D1 바인딩이 올바르게 설정되었는지 확인
- Settings > Functions > D1 database bindings에서 `DB` 변수가 `mytodo-db`를 가리키는지 확인

### API 호출이 실패하는 경우

- 브라우저 개발자 도구의 Network 탭에서 API 요청 확인
- Functions가 올바르게 배포되었는지 확인
- Cloudflare Dashboard의 Logs 탭에서 에러 로그 확인

### 페이지는 로드되지만 스타일이 깨지는 경우

- Tailwind CDN이 로드되는지 확인
- 브라우저 캐시 삭제 후 재시도

## 커스텀 도메인 설정 (선택사항)

1. Cloudflare Dashboard에서 Pages 프로젝트 선택
2. **Custom domains** 탭으로 이동
3. **Set up a custom domain** 클릭
4. 도메인 입력 (예: todo.yourdomain.com)
5. DNS 레코드 자동 추가 확인
6. 완료!

## 다음 단계

배포가 완료되면:

- ✅ 할일을 추가하고 관리해보세요
- ✅ 모바일에서도 테스트해보세요
- ✅ 친구들과 공유하세요 (단, 로그인이 없으므로 개인용으로만 사용 권장)

## 지원

문제가 발생하면:
- Cloudflare Pages 문서: https://developers.cloudflare.com/pages/
- Cloudflare D1 문서: https://developers.cloudflare.com/d1/
- GitHub Issues: https://github.com/hajo-test/claude-test/issues
