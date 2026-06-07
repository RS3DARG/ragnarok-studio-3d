"use client";

import { useRef, useState } from "react";

interface CotizacionCardProps {
  numero: string;
  fecha: string;
  nombre: string;
  saga: string;
  altura: string;
  tiempo: string;
  img: string;
  precioFinal: number;
  metodo: string;
  validez: string;
  validoHasta: string;
  procesos: string[];
  condiciones: string[];
  notas: string;
  tel: string;
  ig: string;
}

export default function CotizacionCard(props: CotizacionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function download() {
  if (!cardRef.current) return;
  setDownloading(true);
  try {
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#111111",
      logging: false,
      removeContainer: true,
    });
    const a = document.createElement("a");
    a.download = `cotizacion-rs3d-${props.numero}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  } catch (e) {
    console.error("Error al generar imagen:", e);
    alert("No se pudo generar la imagen.");
  } finally {
    setDownloading(false);
  }
}

  const metodoPagoLabel =
    props.metodo === "efectivo"
      ? "Efectivo / Transferencia · 5% de descuento"
      : props.metodo === "tc2"
      ? "Tarjeta de crédito · 2 cuotas (+10%)"
      : "Tarjeta de crédito · 3 cuotas (+15%)";

  const fechaFormateada = props.fecha
    ? new Date(props.fecha + "T12:00:00").toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const validoHastaFormateado = props.validoHasta
    ? new Date(props.validoHasta + "T12:00:00").toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  return (
    <div className="space-y-4">
      {/* Card para descargar */}
      <div
        ref={cardRef}
        style={{
          width: "400px",
          background: "#111111",
          borderRadius: "12px",
          overflow: "hidden",
          fontFamily: "Georgia, serif",
          color: "#ffffff",
        }}
      >
        {/* Header */}
        <div style={{ padding: "16px 20px 12px", borderBottom: "2px solid #cc3300" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.5px" }}>RS</span>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "#cc3300" }}>3D</span>
            <span style={{ fontSize: "9px", color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginLeft: "4px", paddingBottom: "2px" }}>Ragnarok Studio 3D</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "9px", color: "#888", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <span>Cotización</span>
            <span style={{ color: "#cc3300", fontSize: "11px", fontWeight: 700 }}>#{props.numero}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px", fontSize: "9px", color: "#888" }}>
            <span>{fechaFormateada}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "14px 20px" }}>
          <div style={{ fontSize: "8px", color: "#666", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px" }}>
            Figura de colección · Impresión 3D por encargo
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff", lineHeight: 1.1, marginBottom: "2px" }}>
            {props.nombre.toUpperCase()} <span style={{ color: "#cc3300" }}>{props.saga.toUpperCase()}</span>
          </div>
          <div style={{ fontSize: "10px", color: "#888", fontStyle: "italic", marginBottom: "12px" }}>
            Figura artesanal única — no reproducible
          </div>

          {props.img && (
            <img
              src={props.img}
              alt=""
              crossOrigin="anonymous"
              style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "6px", marginBottom: "12px", display: "block" }}
            />
          )}

          {/* Specs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
            <div style={{ background: "#1a1a1a", borderRadius: "6px", padding: "8px 10px" }}>
              <div style={{ fontSize: "8px", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>Altura</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>{props.altura || "—"}</div>
            </div>
            <div style={{ background: "#1a1a1a", borderRadius: "6px", padding: "8px 10px" }}>
              <div style={{ fontSize: "8px", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>Tiempo de impresión</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>{props.tiempo || "—"}</div>
            </div>
          </div>

          {/* Proceso */}
          {props.procesos.length > 0 && (
            <div style={{ background: "#1a1a1a", borderRadius: "6px", padding: "10px 12px", marginBottom: "12px" }}>
              <div style={{ fontSize: "8px", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Proceso de acabado incluido</div>
              {props.procesos.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#cc3300", flexShrink: 0 }} />
                  <span style={{ fontSize: "10px", color: "#cccccc" }}>{p}</span>
                </div>
              ))}
            </div>
          )}

          {/* Precio */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "8px" }}>
            <div>
              <div style={{ fontSize: "8px", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Precio total del proyecto</div>
              <div style={{ fontSize: "30px", fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>
                <span style={{ fontSize: "16px", color: "#cc3300", marginRight: "2px" }}>$</span>
                {props.precioFinal.toLocaleString("es-AR")}
              </div>
              <div style={{ fontSize: "9px", color: "#666", marginTop: "2px" }}>{metodoPagoLabel}</div>
            </div>
            <div style={{ background: "#cc3300", borderRadius: "6px", padding: "6px 10px", textAlign: "center", minWidth: "80px" }}>
              <div style={{ fontSize: "8px", color: "#ff9980", letterSpacing: "0.08em", textTransform: "uppercase" }}>Válido por</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#ffffff" }}>{props.validez || "—"}</div>
            </div>
          </div>

          {validoHastaFormateado && (
            <div style={{ background: "#1a1a1a", borderRadius: "6px", padding: "6px 12px", marginBottom: "8px", fontSize: "9px", color: "#aaa" }}>
              <span style={{ color: "#cc3300", fontWeight: 700 }}>Válido hasta: </span>{validoHastaFormateado}
            </div>
          )}

          {props.notas && (
            <div style={{ background: "#1a1a1a", borderRadius: "6px", padding: "8px 12px", marginBottom: "8px", fontSize: "9px", color: "#bbbbbb", fontStyle: "italic" }}>
              {props.notas}
            </div>
          )}

          {/* Condiciones */}
          {props.condiciones.length > 0 && (
            <div style={{ borderTop: "0.5px solid #222222", paddingTop: "10px", marginTop: "4px" }}>
              {props.condiciones.map((c, i) => (
                <div key={i} style={{ fontSize: "8px", color: "#555555", lineHeight: 1.5, marginBottom: "3px" }}>
                  <span style={{ color: "#cc3300" }}>• </span>{c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ background: "#0d0d0d", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "9px", color: "#666666", lineHeight: 1.8 }}>
            <div>📱 {props.tel}</div>
            <div>📷 {props.ig}</div>
          </div>
          <div style={{ fontSize: "9px", color: "#333333", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
            Ragnarok Studio 3D
          </div>
        </div>
      </div>

      {/* Botón descarga */}
      <button
        type="button"
        onClick={download}
        disabled={downloading}
        className="flex items-center gap-2 rounded-xl bg-ink-850 border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-ember-400 hover:text-white disabled:opacity-50"
      >
        {downloading ? "Generando…" : "⬇ Descargar PNG"}
      </button>
    </div>
  );
}