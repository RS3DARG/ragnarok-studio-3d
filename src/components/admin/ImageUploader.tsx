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
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);

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
      setError("Error al subir. Verificá que el bucket 'figures' exista y sea público.");
      console.error(e);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  // Drag & drop para reordenar
  function handleDragStart(i: number) {
    setDragging(i);
  }

  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    setDragOver(i);
  }

  function handleDrop(e: React.DragEvent, i: number) {
    e.preventDefault();
    if (dragging === null || dragging === i) {
      setDragging(null);
      setDragOver(null);
      return;
    }
    const reordered = [...value];
    const [moved] = reordered.splice(dragging, 1);
    reordered.splice(i, 0, moved);
    onChange(reordered);
    setDragging(null);
    setDragOver(null);
  }

  function handleDragEnd() {
    setDragging(null);
    setDragOver(null);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      {multiple && value.length > 1 ? (
        <p className="mb-2 text-xs text-zinc-500">
          Arrastrá las imágenes para cambiar el orden. La primera es la que se muestra primero.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div
            key={url}
            draggable={multiple}
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
            className={`group relative h-24 w-24 overflow-hidden rounded-xl border transition ${
              dragOver === i
                ? "scale-105 border-ember-400"
                : dragging === i
                ? "border-white/30 opacity-40"
                : "border-white/10"
            } ${multiple ? "cursor-grab active:cursor-grabbing" : ""}`}
          >
            <Image src={url} alt="" fill sizes="96px" className="object-cover" />
            {/* Número de orden */}
            {multiple ? (
              <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white">
                {i + 1}
              </span>
            ) : null}
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