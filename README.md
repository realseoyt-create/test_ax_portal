# TEST AX Portal

테스트기술팀이 AI로 만들거나 직접 만든 시스템들을 모아 소개하고, 하트로 반응을 남길 수 있는 사내 카탈로그 포털.

- 도메인 용어와 결정 배경: [CONTEXT.md](./CONTEXT.md), [docs/adr](./docs/adr)
- 톤앤매너 목업(디자인 캔버스 소스): [design/Main.dc.html](./design/Main.dc.html)

## 스택

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite
- 이미지는 서버 로컬 디스크(`public/uploads`)에 저장

## 시작하기

```bash
npm install
npx prisma migrate dev
npm run dev
```

`http://localhost:3000` 접속.

## 환경 변수

`.env.example` 참고:

- `DATABASE_URL` — SQLite 파일 경로 (기본 `file:./dev.db`)
- `UPLOAD_DIR` — 업로드 이미지 저장 경로 (기본 `public/uploads`)
- `PORT` — 서버 포트 (기본 `3000`)

## 현재 범위 (v1)

- 카탈로그 그리드 + 이름 검색 + 태그 필터
- 로그인 없이 누구나 새 시스템 등록 가능
- 하트(좋아요) — 서버 발급 익명 쿠키로 중복 방지
- 수정/삭제 기능 없음 (추후 SSO 도입 시 소유자/관리자 기반으로 추가 예정)
- 사이드바의 로드맵 / 팀 AX 전략 메뉴는 자리만 마련된 상태(준비중)
