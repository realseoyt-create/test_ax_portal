"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlusIcon, PlusIcon, XIcon } from "./icons";

const inputClass =
  "w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm text-[#12213c] bg-white outline-none focus:border-[#12213c]";
const labelClass = "block text-sm font-bold mb-1.5";

export function ResourceForm({
  submitEndpoint,
  tagsEndpoint,
  redirectHref,
  namePlaceholder,
  linkRequired = false,
  requireAdminCode = false,
}: {
  submitEndpoint: string;
  tagsEndpoint: string;
  redirectHref: string;
  namePlaceholder: string;
  linkRequired?: boolean;
  requireAdminCode?: boolean;
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [link, setLink] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(tagsEndpoint)
      .then((r) => (r.ok ? r.json() : []))
      .then(setExistingTags)
      .catch(() => {});
  }, [tagsEndpoint]);

  function addTag(raw: string) {
    const value = raw.trim();
    if (!value || tags.includes(value)) return;
    setTags((prev) => [...prev, value]);
    setTagDraft("");
  }

  function onTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagDraft);
    } else if (e.key === "Backspace" && tagDraft === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setImages((prev) => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !shortDescription.trim() || !creatorName.trim()) {
      setError("이름, 한줄 설명, 등록자는 필수예요.");
      return;
    }
    if (linkRequired && !link.trim()) {
      setError("링크는 필수예요.");
      return;
    }
    if (tags.length === 0) {
      setError("태그를 하나 이상 입력해주세요.");
      return;
    }
    if (images.length === 0) {
      setError("대표 이미지를 최소 1장 등록해주세요.");
      return;
    }
    if (requireAdminCode && !adminCode.trim()) {
      setError("관리자 코드를 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.set("name", name.trim());
    formData.set("shortDescription", shortDescription.trim());
    formData.set("description", description.trim());
    formData.set("creatorName", creatorName.trim());
    formData.set("link", link.trim());
    formData.set("tags", tags.join(","));
    if (requireAdminCode) formData.set("adminCode", adminCode.trim());
    images.forEach((file) => formData.append("images", file));

    setSubmitting(true);
    try {
      const res = await fetch(submitEndpoint, { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "등록에 실패했어요. 다시 시도해주세요.");
        return;
      }
      router.push(redirectHref);
      router.refresh();
    } catch {
      setError("등록에 실패했어요. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className={labelClass}>이름 *</label>
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={namePlaceholder}
        />
      </div>

      <div>
        <label className={labelClass}>한줄 설명 *</label>
        <input
          className={inputClass}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="카드에 보여질 짧은 설명"
        />
      </div>

      <div>
        <label className={labelClass}>상세 설명</label>
        <textarea
          className={`${inputClass} min-h-[120px] resize-y`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="어떤 문제를 어떻게 해결하는지 자유롭게 적어주세요."
        />
      </div>

      <div>
        <label className={labelClass}>등록자 *</label>
        <input
          className={inputClass}
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
          placeholder="이름"
        />
      </div>

      <div>
        <label className={labelClass}>링크{linkRequired ? " *" : ""}</label>
        <input
          className={inputClass}
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className={labelClass}>태그 *</label>
        <div className="flex flex-wrap gap-2 border border-[#e5e7eb] rounded-xl px-3 py-2.5 bg-white focus-within:border-[#12213c]">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-full bg-[#f2f3f5] text-[#4b5563]"
            >
              {tag}
              <button
                type="button"
                onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                className="text-[#9aa1ac] hover:text-[#4b5563] cursor-pointer"
                aria-label={`${tag} 태그 삭제`}
              >
                <XIcon />
              </button>
            </span>
          ))}
          <input
            list="existing-tags"
            className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={onTagKeyDown}
            onBlur={() => addTag(tagDraft)}
            placeholder={tags.length === 0 ? "태그 입력 후 Enter" : ""}
          />
          <datalist id="existing-tags">
            {existingTags.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <label className={labelClass}>캡처 사진 *</label>
        <p className="text-xs text-[#9aa1ac] mb-2">첫 번째 사진이 대표 이미지로 사용돼요.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          onChange={onFilesSelected}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 w-full py-8 rounded-2xl border-2 border-dashed border-[#e5e7eb] text-[#6b7280] bg-white hover:border-[#12213c] hover:text-[#12213c] hover:bg-[#f7f8fa] transition-colors cursor-pointer"
        >
          <span className="relative">
            <ImagePlusIcon />
            <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#12213c] text-white">
              <PlusIcon className="w-2.5 h-2.5" />
            </span>
          </span>
          <span className="text-sm font-bold">클릭해서 사진 추가</span>
          <span className="text-xs text-[#9aa1ac]">PNG, JPEG, WEBP, GIF · 최대 8MB</span>
        </button>
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-3">
            {images.map((file, i) => (
              <ImageThumb key={`${file.name}-${i}`} file={file} onRemove={() => removeImage(i)} primary={i === 0} />
            ))}
          </div>
        )}
      </div>

      {requireAdminCode && (
        <div>
          <label className={labelClass}>관리자 코드 *</label>
          <p className="text-xs text-[#9aa1ac] mb-2">
            등록 권한 확인용 코드예요. 모르면 관리자에게 문의해주세요.
          </p>
          <input
            type="password"
            className={inputClass}
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            placeholder="관리자 코드"
          />
        </div>
      )}

      {error && <p className="text-sm text-[#ef476f] font-semibold">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="self-start flex items-center gap-2 bg-[#12213c] text-white rounded-full px-6 py-3 font-bold text-sm disabled:opacity-50 cursor-pointer"
      >
        {submitting ? "등록 중..." : "등록하기"}
      </button>
    </form>
  );
}

function ImageThumb({ file, onRemove, primary }: { file: File; onRemove: () => void; primary: boolean }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return (
    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#e5e7eb]">
      {
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={file.name} className="w-full h-full object-cover" />
      }
      {primary && (
        <span className="absolute bottom-0 left-0 right-0 text-[10px] font-bold text-white bg-black/50 text-center py-0.5">
          대표
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 text-[#12213c] cursor-pointer"
        aria-label="이미지 삭제"
      >
        <XIcon />
      </button>
    </div>
  );
}
