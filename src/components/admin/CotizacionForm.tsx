"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveCotizacion, type CotizacionPayload } from "@/lib/actions/cotizaciones";
import { createClient } from "@/lib/supabase/client";
import CotizacionCard from "@/components/admin/CotizacionCard";

const inputClass = "w-full rounded-xl border border-white/10 bg-ink-850 px-4 py-3 text-white outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30 text-sm";
const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";
const sectionClass = "space-y-4 rounded-2xl border border-white/5 bg-ink-900 p-5";

const DEFAULT_PROCESOS = [
  "Lijado y limpieza de capas",
  "Aplicación de primer base",
  "Pintura a pincel artesanal",
  "Laca acrílica de protección",
];

const DEFAULT_CONDICIONES = [
  "La seña confirma y reserva el turno de producción.",
  "El plazo inicia tras la acreditación de la seña.",
  "Cambios de diseño post-confirmación tienen costo adicional.",
  "Garantía de calidad: revisión de la figura antes del envío.",
  "Envíos con costo dependiendo de la ciudad.",
];

function randomName(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `cotizaciones/${id}.${ext}`;
}

export default function CotizacionForm({ cotizacion }: { cotizacion?: Record<string, unknown> | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [numero, setNumero] = useState(String(cotizacion?.numero ?? "001"));
  const [fecha, setFecha] = useState(String(cotizacion?.created_at ?? new Date().toISOString().split("T")[0]));
  const [cliente, setCliente] = useState(String(cotizacion?.cliente ?? ""));
  const [nombre, setNombre] = useState(String(cotizacion?.figura_nombre ?? ""));
  const [saga, setSaga] = useState(String(cotizacion?.figura_saga ?? ""));
  const [altura, setAltura] = useState(String(cotizacion?.figura_altura ?? ""));
  const [tiempo, setTiempo] = useState(String(cotizacion?.figura_tiempo ?? ""));
  const [img, setImg] = useState(String(cotizacion?.figura_img ?? ""));
  const [precioBase, setPrecioBase] = useState(String(cotizacion?.precio_base ?? ""));
  const [metodo, setMetodo] = useState(String(cotizacion?.metodo_pago ?? "efectivo"));
  const [validez, setValidez] = useState(String(cotizacion?.validez ?? "15 días"));
  const [validoHasta, setValidoHasta] = useState(String(cotizacion?.valido_hasta ?? ""));
  const [notas, setNotas] = useState(String(cotizacion?.notas ?? ""));
  const [tel, setTel] = useState(String(cotizacion?.tel ?? "+54 9 299 4101115"));
  const [ig, setIg] = useState(String(cotizacion?.ig ?? "@Ragnarok_studio3d"));
  const [procesos, setProcesos] = useState<string[]>(
    Array.isArray(cotizacion?.procesos) ? cotizacion.procesos as string[] : DEFAULT_PROCESOS
  );
  const [condiciones, setCondiciones] = useState<string[]>(
    Array.isArray(cotizacion?.condiciones) ? cotizacion.condiciones as string[] : DEFAULT_CONDICIONES
  );

  function calcPrecioFinal() {
    const base = parseFloat(precioBase) || 0;
    if (metodo === "efectivo") return Math.round(base * 0.95);
    if (metodo === "tc2") return Math.round(base * 1.10);
    if (metodo === "tc3") return Math.round(base * 1.15);
    return base;
  }

  async function handleFileUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const file = files[0];
      const path = randomName(file);
      const { error: upErr } = await supabase.storage
        .from("figures")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("figures").getPublicUrl(path);
      setImg(data.publicUrl);
    } catch (e) {
      setError("Error al subir imagen.");
      console.error(e);
    } finally {
      setUploading(false);
    }
  }

  function updateItem(arr: string[], setArr: (v: string[]) => void, i: number, val: string) {
    const next = [...arr];
    next[i] = val;
    setArr(next);
  }

  function removeItem(arr: string[], setArr: (v: string[]) => void, i: number) {
    setArr(arr.filter((_, idx) => idx !== i));
  }

  function addItem(arr: string[], setArr: (v: string[]) => void, placeholder: string) {
    setArr([...arr, placeholder]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    const payload: CotizacionPayload = {
      id: cotizacion?.id as string | undefined,
      numero, cliente, figura_nombre: nombre, figura_saga: saga,
      figura_altura: altura, figura_tiempo: tiempo, figura_img: img,
      precio_base: parseFloat(precioBase) || 0,
      precio_final: calcPrecioFinal(),
      metodo_pago: metodo, validez,
      valido_hasta: validoHasta || null,
      procesos, condiciones, notas, tel, ig,
    };
    startTransition(async () => {
      const res = await saveCotizacion(payload);
      if (!res.ok) { setError(res.error || "No se pudo guardar."); return; }
      setOk(true);
      setTimeout(() => router.push("/admin/cotizaciones"), 800);
    });
  }

  const precioFinal = calcPrecioFinal();
  const recargoLabel = metodo === "efectivo" ? "-5%" : metodo === "tc2" ? "+10%" : metodo === "tc3" ? "+15%" : null;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">

      <div className={sectionClass}>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">Datos generales</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>N° cotización</label>
            <input className={inputClass} value={numero} onChange={e => setNumero(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Fecha</label>
            <input type="date" className={inputClass} value={fecha} onChange={e => setFecha(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Cliente</label>
            <input className={inputClass} value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Nombre del cliente" />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">Figura</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Nombre</label>
            <input className={inputClass} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Goku SSJ4" />
          </div>
          <div>
            <label className={labelClass}>Saga / Franquicia</label>
            <input className={inputClass} value={saga} onChange={e => setSaga(e.target.value)} placeholder="Ej: Dragon Ball GT" />
          </div>
          <div>
            <label className={labelClass}>Altura</label>
            <input className={inputClass} value={altura} onChange={e => setAltura(e.target.value)} placeholder="Ej: 43 cm" />
          </div>
          <div>
            <label className={labelClass}>Tiempo de impresión</label>
            <input className={inputClass} value={tiempo} onChange={e => setTiempo(e.target.value)} placeholder="Ej: 87 horas" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Imagen (URL)</label>
          <input className={inputClass} value={img} onChange={e => setImg(e.target.value)} placeholder="URL de imagen" />
        </div>
        <div>
          <label className={labelClass}>O subí imagen</label>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files)} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-ember-400 hover:text-white disabled:opacity-50">
            {uploading ? "Subiendo…" : "Seleccionar imagen"}
          </button>
          {img && <img src={img} alt="" className="mt-3 h-24 w-24 rounded-xl object-cover border border-white/10" />}
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">Proceso de acabado</h2>
        {procesos.map((p, i) => (
          <div key={i} className="flex gap-2">
            <input className={inputClass} value={p} onChange={e => updateItem(procesos, setProcesos, i, e.target.value)} />
            <button type="button" onClick={() => removeItem(procesos, setProcesos, i)}
              className="rounded-xl border border-white/10 px-3 text-zinc-500 hover:text-red-300 hover:border-red-500/30 transition">×</button>
          </div>
        ))}
        <button type="button" onClick={() => addItem(procesos, setProcesos, "Nuevo paso")}
          className="rounded-xl border border-dashed border-white/15 px-4 py-2 text-sm text-zinc-400 hover:text-ember-300 hover:border-ember-400/50 transition w-full">
          + Agregar paso
        </button>
      </div>

      <div className={sectionClass}>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">Precio y validez</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Precio base ($)</label>
            <input type="number" className={inputClass} value={precioBase} onChange={e => setPrecioBase(e.target.value)} placeholder="154000" />
          </div>
          <div>
            <label className={labelClass}>Válido por</label>
            <input className={inputClass} value={validez} onChange={e => setValidez(e.target.value)} placeholder="15 días" />
          </div>
          <div>
            <label className={labelClass}>Válido hasta</label>
            <input type="date" className={inputClass} value={validoHasta} onChange={e => setValidoHasta(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Método de pago</label>
          <div className="space-y-2">
            {[
              { val: "efectivo", label: "Efectivo / Transferencia (5% de descuento)" },
              { val: "tc2", label: "Tarjeta crédito 2 cuotas (+10%)" },
              { val: "tc3", label: "Tarjeta crédito 3 cuotas (+15%)" },
            ].map(m => (
              <label key={m.val} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="metodo" value={m.val} checked={metodo === m.val}
                  onChange={() => setMetodo(m.val)} className="text-ember-500" />
                <span className="text-sm text-zinc-300">{m.label}</span>
              </label>
            ))}
          </div>
        </div>
        {precioBase && (
          <div className="rounded-xl bg-ink-850 border border-white/10 px-5 py-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Precio final</p>
            <p className="font-display text-3xl font-bold text-white">
              $ {precioFinal.toLocaleString("es-AR")}
            </p>
            {recargoLabel && (
              <p className="text-xs text-ember-400 mt-1">
                {metodo === "efectivo" ? `Descuento ${recargoLabel} aplicado` : `Recargo ${recargoLabel} incluido`}
              </p>
            )}
          </div>
        )}
      </div>

      <div className={sectionClass}>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">Condiciones</h2>
        {condiciones.map((c, i) => (
          <div key={i} className="flex gap-2">
            <input className={inputClass} value={c} onChange={e => updateItem(condiciones, setCondiciones, i, e.target.value)} />
            <button type="button" onClick={() => removeItem(condiciones, setCondiciones, i)}
              className="rounded-xl border border-white/10 px-3 text-zinc-500 hover:text-red-300 hover:border-red-500/30 transition">×</button>
          </div>
        ))}
        <button type="button" onClick={() => addItem(condiciones, setCondiciones, "Nueva condición.")}
          className="rounded-xl border border-dashed border-white/15 px-4 py-2 text-sm text-zinc-400 hover:text-ember-300 hover:border-ember-400/50 transition w-full">
          + Agregar condición
        </button>
      </div>

      <div className={sectionClass}>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">Notas y contacto</h2>
        <div>
          <label className={labelClass}>Notas adicionales</label>
          <textarea className={`${inputClass} min-h-20 resize-y`} value={notas} onChange={e => setNotas(e.target.value)} placeholder="Ej: Incluye base temática personalizada..." />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Teléfono WhatsApp</label>
            <input className={inputClass} value={tel} onChange={e => setTel(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Instagram</label>
            <input className={inputClass} value={ig} onChange={e => setIg(e.target.value)} />
          </div>
        </div>
      </div>

     <div className={sectionClass}>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">Preview y descarga</h2>
        <p className="text-xs text-zinc-500">La card se actualiza en tiempo real. Guardá primero y luego descargá el PNG.</p>
        <CotizacionCard
          numero={numero}
          fecha={fecha}
          nombre={nombre}
          saga={saga}
          altura={altura}
          tiempo={tiempo}
          img={img}
          precioFinal={calcPrecioFinal()}
          metodo={metodo}
          validez={validez}
          validoHasta={validoHasta}
          procesos={procesos}
          condiciones={condiciones}
          notas={notas}
          tel={tel}
          ig={ig}
        />
      </div>

      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-500/20">{error}</p>}
      {ok && <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 ring-1 ring-inset ring-emerald-500/20">Guardado correctamente.</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending}
          className="rounded-xl bg-ember-500 px-6 py-3 font-semibold text-black transition hover:bg-ember-400 disabled:opacity-60">
          {pending ? "Guardando…" : "Guardar cotización"}
        </button>
        <button type="button" onClick={() => router.push("/admin/cotizaciones")}
          className="rounded-xl border border-white/10 px-6 py-3 font-medium text-zinc-300 transition hover:border-white/30 hover:text-white">
          Cancelar
        </button>
      </div>
    </form>
  );
}