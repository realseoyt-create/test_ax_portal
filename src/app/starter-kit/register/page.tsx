import { ResourceForm } from "@/components/ResourceForm";

export default function StarterKitRegisterPage() {
  return (
    <div className="dot-grid px-12 pt-10 pb-16 min-h-full">
      <div className="max-w-[640px] mx-auto">
        <h1 className="m-0 mb-1.5 text-[28px] font-extrabold tracking-[-0.02em]">
          새 스타터 키트 항목 등록
        </h1>
        <p className="m-0 mb-8 text-sm text-[#6b7280]">
          핵심 툴 설치 가이드나 Data Lake 접근 링크를 등록해주세요. 관리자 코드가 필요해요.
        </p>
        <ResourceForm
          submitEndpoint="/api/kit"
          tagsEndpoint="/api/kit/tags"
          redirectHref="/starter-kit"
          namePlaceholder="예: Claude Code 셋업"
          linkRequired
          requireAdminCode
        />
      </div>
    </div>
  );
}
