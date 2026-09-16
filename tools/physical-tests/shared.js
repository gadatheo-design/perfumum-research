export const DATA_URL = "../data/fleur-fantome-2026-09-15.json";

export async function loadExport() {
  const response = await fetch(DATA_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`Export local indisponible (${response.status})`);
  return response.json();
}

export function setupCanvas(canvas) {
  const context = canvas.getContext("2d");
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  resize();
  new ResizeObserver(resize).observe(canvas);
  return context;
}

export function downloadCsv(events, filename) {
  const headers = ["timestamp_utc", "prototype", "event_type", "value", "unit", "source_export", "operator_note"];
  const esc = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = events.map((event) => headers.map((key) => esc(event[key])).join(","));
  const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

export function nowEvent(prototype, eventType, value, unit, note = "") {
  return { timestamp_utc: new Date().toISOString(), prototype, event_type: eventType, value, unit, source_export: "fleur-fantome-2026-09-15.json", operator_note: note };
}

export function drawFooter(context, width, height, exportData) {
  context.fillStyle = "rgba(203, 213, 225, .82)";
  context.font = "12px Noto Sans, sans-serif";
  context.fillText(`Export local ${exportData.exportedAt} · ${exportData.recipe.name} · visualisation documentaire, sans émission`, 18, height - 18);
}
