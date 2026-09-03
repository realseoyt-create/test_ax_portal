# Shared admin code gates AX 스타터 키트 registration, pending SSO

"AX 스타터 키트"는 카탈로그와 달리 관리자만 항목을 등록할 수 있어야 하는데, v1에는 로그인/계정 시스템이 없어 "누가 관리자인지" 서버가 알 방법이 없다. 임시로 서버 환경변수 `ADMIN_CODE`에 저장된 공유 코드를 등록 폼에서 받아 대조하는 방식으로 게이트를 건다 (`src/lib/admin.ts`의 `isValidAdminCode`).

이 체크는 의도적으로 그 함수 하나에만 존재한다 — API 라우트(`src/app/api/kit/route.ts`)는 `isValidAdminCode(code)`가 true/false만 돌려준다고만 알고 있다. SSO가 도입되면 로그인 세션에서 사용자 역할을 조회하도록 그 함수의 내부 구현만 바꾸면 되고, 호출부나 폼 구조를 바꿀 필요는 없다. 이때 `KitItem.ownerId`(현재는 항상 null)에 실제 등록자 계정 id를 채우기 시작하면, 이후 "본인이 등록한 것만 수정 가능" 같은 소유권 기반 기능도 이 필드를 그대로 활용해 추가할 수 있다.
