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
        scale: 2,
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

  const fechaFormateada =
    props.fecha && props.fecha !== "undefined"
      ? new Date(props.fecha + "T12:00:00").toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

  const validoHastaFormateado =
    props.validoHasta && props.validoHasta !== "undefined"
      ? new Date(props.validoHasta + "T12:00:00").toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        style={{
          width: "360px",
          background: "#111111",
          borderRadius: "14px",
          overflow: "hidden",
          fontFamily: "Georgia, serif",
          color: "#ffffff",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "3px solid #cc3300", background: "#0d0d0d" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "10px" }}>
            <span style={{ fontSize: "26px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.5px" }}>RS</span>
            <span style={{ fontSize: "26px", fontWeight: 700, color: "#cc3300" }}>3D</span>
            <span style={{ fontSize: "9px", color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginLeft: "6px" }}>Ragnarok Studio 3D</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "8px", color: "#555", letterSpacing: "0.14em", textTransform: "uppercase" }}>Cotización</div>
              {fechaFormateada && (
                <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>{fechaFormateada}</div>
              )}
            </div>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#cc3300", letterSpacing: "0.05em" }}>#{props.numero}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: "8px", color: "#555", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>
            Figura de colección · Impresión 3D por encargo
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", lineHeight: 1.1, marginBottom: "4px" }}>
            {props.nombre.toUpperCase()}{" "}
            <span style={{ color: "#cc3300" }}>{props.saga.toUpperCase()}</span>
          </div>
          <div style={{ fontSize: "10px", color: "#666", fontStyle: "italic", marginBottom: "18px" }}>
            Figura artesanal única — no reproducible
          </div>

          {props.img && (
            <img
              src={props.img}
              alt=""
              crossOrigin="anonymous"
              style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "18px", display: "block" }}
            />
          )}

          {/* Specs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" }}>
            <div style={{ background: "#1a1a1a", borderRadius: "8px", padding: "12px 14px" }}>
              <div style={{ fontSize: "8px", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "5px" }}>Altura</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>{props.altura || "—"}</div>
            </div>
            <div style={{ background: "#1a1a1a", borderRadius: "8px", padding: "12px 14px" }}>
              <div style={{ fontSize: "8px", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "5px" }}>Tiempo de impresión</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>{props.tiempo || "—"}</div>
            </div>
          </div>

          {/* Proceso */}
          {props.procesos.length > 0 && (
            <div style={{ background: "#1a1a1a", borderRadius: "8px", padding: "14px 16px", marginBottom: "18px" }}>
              <div style={{ fontSize: "8px", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>Proceso de acabado incluido</div>
              {props.procesos.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: i < props.procesos.length - 1 ? "6px" : "0" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#cc3300", flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", color: "#cccccc" }}>{p}</span>
                </div>
              ))}
            </div>
          )}

          {/* Precio */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "14px", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "8px", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>Precio total del proyecto</div>
              <div style={{ fontSize: "34px", fontWeight: 700, color: "#ffffff", lineHeight: 1, display: "flex", alignItems: "baseline", gap: "3px" }}>
                <span style={{ fontSize: "18px", color: "#cc3300" }}>$</span>
                {props.precioFinal.toLocaleString("es-AR")}
              </div>
              <div style={{ fontSize: "9px", color: "#555", marginTop: "4px" }}>{metodoPagoLabel}</div>
            </div>
            <div style={{ background: "#cc3300", borderRadius: "8px", padding: "8px 14px", textAlign: "center", flexShrink: 0, minWidth: "88px" }}>
              <div style={{ fontSize: "7px", color: "#ff9980", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3px" }}>Válido por</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>{props.validez || "—"}</div>
            </div>
          </div>

          {validoHastaFormateado && (
            <div style={{ background: "#1a1a1a", borderRadius: "6px", padding: "8px 14px", marginBottom: "14px", fontSize: "9px", color: "#aaa" }}>
              <span style={{ color: "#cc3300", fontWeight: 700 }}>Válido hasta: </span>{validoHastaFormateado}
            </div>
          )}

          {props.notas && (
            <div style={{ background: "#1a1a1a", borderRadius: "6px", padding: "10px 14px", marginBottom: "14px", fontSize: "10px", color: "#bbbbbb", fontStyle: "italic", lineHeight: 1.5 }}>
              {props.notas}
            </div>
          )}

          {/* Condiciones */}
          {props.condiciones.length > 0 && (
            <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: "14px", marginTop: "4px" }}>
              {props.condiciones.map((c, i) => (
                <div key={i} style={{ fontSize: "9px", color: "#555", lineHeight: 1.6, marginBottom: "4px", display: "flex", gap: "5px" }}>
                  <span style={{ color: "#cc3300", flexShrink: 0 }}>•</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ background: "#0d0d0d", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: "10px", color: "#555", lineHeight: 2 }}>
            <div>📱 {props.tel}</div>
            <div>📷 {props.ig}</div>
          </div>
          <div style={{ fontSize: "9px", color: "#2a2a2a", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, textAlign: "right" }}>
            Ragnarok<br />Studio 3D
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