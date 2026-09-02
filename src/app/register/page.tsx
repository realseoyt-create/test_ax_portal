import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="dot-grid px-12 pt-10 pb-16 min-h-full">
      <div className="max-w-[640px] mx-auto">
        <h1 className="m-0 mb-1.5 text-[28px] font-extrabold tracking-[-0.02em]">
          새 시스템 등록
        </h1>
        <p className="m-0 mb-8 text-sm text-[#6b7280]">
          AI로 만들었든 직접 만들었든, 팀에 소개하고 싶은 시스템을 자유롭게 등록해주세요.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}
