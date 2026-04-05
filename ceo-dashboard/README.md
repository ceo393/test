# 🎯 CEO 아침 브리핑 대시보드

CEO를 위한 실시간 아침 브리핑 대시보드입니다. 주요 KPI, 일정, 팀 공지사항, 그리고 AI가 요약한 업계 뉴스를 한눈에 볼 수 있습니다.

## 🌟 주요 기능

### 📊 KPI 시각화
- **오늘 매출**: 일일 매출 현황 및 변화율
- **방문자 수**: 웹사이트 방문자 통계
- **전환율**: 전환 성과 지표

### 📅 오늘의 일정
- 실시간 일정 표시
- 참석자 정보 포함
- 시간대별 정렬

### 📢 팀 공지사항
- 최신 공지사항 목록
- 시간 정보 포함
- 스크롤 가능한 레이아웃

### 🤖 AI 업계 뉴스 요약
- Claude AI가 자동으로 요약하는 업계 뉴스
- 실시간 조회 가능
- 새로고침 버튼으로 수동 업데이트

## 🏗️ 기술 스택

| 계층 | 기술 | 용도 |
|------|------|------|
| **호스팅** | GitHub Pages | 정적 웹사이트 |
| **데이터** | data.json | KPI, 일정, 공지사항 |
| **자동화** | GitHub Actions | 매일 자정 데이터 업데이트 |
| **AI API** | Vercel Functions + Claude | 뉴스 요약 (실시간) |
| **스타일** | Neumorphism CSS | 부드러운 UI |

## 🚀 시작하기

### 로컬 개발

```bash
# 저장소 복제
git clone https://github.com/yourusername/ceo-dashboard.git
cd ceo-dashboard

# 서버 실행 (포트 8000)
python -m http.server 8000

# 브라우저에서 열기
# http://localhost:8000
```

### Vercel 배포 (뉴스 요약 API)

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 로컬 개발 환경 테스트
vercel dev

# 프로덕션 배포
vercel --prod
```

## 📋 파일 구조

```
ceo-dashboard/
├── index.html                          # 메인 대시보드
├── public/data.json                    # 동적 데이터 (GitHub Actions가 매일 업데이트)
├── styles/main.css                     # Neumorphism 스타일
├── js/
│   ├── main.js                         # 초기화 및 렌더링
│   ├── state.js                        # 전역 상태 관리
│   ├── data-loader.js                  # data.json 로더
│   ├── ui-components.js                # UI 렌더링 함수
│   └── api-client.js                   # API 호출 클라이언트
├── api/news-summary.js                 # Vercel Serverless Function
├── scripts/update_data.py               # GitHub Actions 데이터 업데이트
├── .github/workflows/
│   ├── update-data.yml                 # 매일 자정 데이터 업데이트
│   └── deploy-pages.yml                # GitHub Pages 자동 배포
├── vercel.json                         # Vercel 설정
└── package.json                        # NPM 의존성
```

## ⚙️ 설정

### GitHub Secrets 설정 (필수)

GitHub 저장소 Settings → Secrets and variables → Actions에서 다음을 설정해야 합니다:

1. **CLAUDE_API_KEY**: Claude API 키
   - [Anthropic Console](https://console.anthropic.com)에서 발급받으세요
   - 형식: `sk-ant-...`

2. **NEWS_API_KEY** (선택): News API 키
   - [NewsAPI.org](https://newsapi.org)에서 발급받으세요

### Vercel 환경 변수 설정

Vercel 프로젝트 Settings → Environment Variables에서:
- `CLAUDE_API_KEY`: Claude API 키

## 📡 API 엔드포인트

### GET `/api/news-summary`

AI 뉴스 요약을 조회합니다.

**응답:**
```json
{
  "success": true,
  "news": [
    {
      "title": "뉴스 제목",
      "summary": "요약된 내용",
      "source": "뉴스 출처"
    }
  ],
  "timestamp": "2026-04-05T00:00:00Z"
}
```

## 🔄 자동 업데이트

### 매일 자정 (UTC) 자동 실행
- GitHub Actions가 자동으로 `scripts/update_data.py` 실행
- data.json에 새로운 KPI, 일정, 공지사항 저장
- 변경사항이 있으면 자동 커밋 및 푸시
- GitHub Pages가 자동으로 배포

### 수동 업데이트
GitHub Actions 탭 → "Update Dashboard Data" 워크플로우 → "Run workflow"

## 🎨 스타일링

Neumorphism 디자인 원칙:
- 부드러운 그림자: `box-shadow`로 깊이감 표현
- 그라디언트 배경: 미묘한 색상 변화
- 반응형 디자인: 모바일부터 데스크탑까지 지원
- 애니메이션: 부드러운 전환 효과

## 📱 반응형 디자인

- **데스크탑** (1200px+): 3열 KPI 카드, 전체 콘텐츠 표시
- **태블릿** (768px-1199px): 가변 레이아웃
- **모바일** (480px-767px): 1열 레이아웃, 터치 최적화
- **소형 폰** (<480px): 미니멀 레이아웃

## 🔐 보안

- ✅ API 키는 GitHub Secrets/Vercel 환경 변수로 관리
- ✅ 클라이언트 사이드에서 민감한 정보 노출 안 함
- ✅ CORS 정책 설정으로 신뢰할 수 있는 출처만 허용
- ✅ HTML 이스케이핑으로 XSS 방지

## 📊 배포 상태

- **GitHub Pages**: 자동 배포 (모든 push 후)
- **Vercel Functions**: 자동 배포 (Vercel 연동 시)

배포 상태 확인:
- [GitHub Actions](https://github.com/yourusername/ceo-dashboard/actions)
- [Vercel Dashboard](https://vercel.com/dashboard)

## 🚨 트러블슈팅

### data.json이 로드되지 않을 때
1. 콘솔에서 CORS 에러 확인
2. `public/data.json` 파일 경로 확인
3. 브라우저 캐시 삭제 후 새로고침

### 뉴스 요약이 표시되지 않을 때
1. Vercel Functions 배포 확인
2. Claude API 키 설정 확인
3. 브라우저 콘솔에서 API 에러 메시지 확인

### GitHub Actions 실패
1. 워크플로우 로그 확인
2. GitHub Secrets 설정 확인
3. Python 스크립트 권한 확인

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 👨‍💼 사용자 지정

### KPI 업데이트
`scripts/update_data.py`의 `get_sample_kpis()` 함수에서 실제 데이터 소스로 변경

### 뉴스 소스 변경
`api/news-summary.js`의 `getSampleNews()` 함수를 News API나 RSS로 변경

### 스타일 커스터마이징
`styles/main.css`의 CSS 변수 조정:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #10b981;
    --bg-color: #f3f4f6;
    /* ... */
}
```

## 🤝 기여

개선 사항이나 버그 리포트는 GitHub Issues로 부탁드립니다.

## 📞 지원

질문이나 지원이 필요하면 GitHub Discussions를 이용해주세요.

---

**마지막 업데이트**: 2026-04-05
