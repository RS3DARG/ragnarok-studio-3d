"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

function randomName(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${id}.${ext}`;
}

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  label = "Imágenes",
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setError(null);
    setUploading(true);
    const supabase = createClient();
    const uploaded: string[] = [];

    try {
      const list = multiple ? Array.from(files) : [files[0]];
      for (const file of list) {
        const path = randomName(file);
        const { error: upErr } = await supabase.storage
          .from("figures")
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("figures").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      onChange(multiple ? [...value, ...uploaded] : uploaded);
    } catch (e) {
      setError(
        "Error al subir. Verificá que el bucket 'figures' exista y sea público."
      );
      console.error(e);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div
            key={url}
            className="group relative h-24 w-24 overflow-hidden rounded-xl border border-white/10"
          >
            <Image src={url} alt="" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Quitar imagen"
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 text-xs text-zinc-400 transition hover:border-ember-400 hover:text-ember-300 disabled:opacity-50"
        >
          {uploading ? (
            <span className="animate-pulse-soft">Subiendo…</span>
          ) : (
            <>
              <span className="text-2xl leading-none">+</span>
              <span>Subir</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
