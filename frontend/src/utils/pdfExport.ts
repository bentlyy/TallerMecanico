import type { jsPDF } from 'jspdf';
import type { Pieza, Reparacion, Factura, EstadoReparacion } from '../types';

const BRAND = 'TallerPro';
const PRIMARY: [number, number, number] = [13, 71, 161];

type AutoTableFn = typeof import('jspdf-autotable').default;

let libsPromise: Promise<{ jsPDFCtor: typeof import('jspdf').jsPDF; autoTable: AutoTableFn }> | null = null;
const loadLibs = () => {
  if (!libsPromise) {
    libsPromise = Promise.all([import('jspdf'), import('jspdf-autotable')]).then(([jspdfMod, atMod]) => ({
      jsPDFCtor: jspdfMod.jsPDF,
      autoTable: atMod.default,
    }));
  }
  return libsPromise;
};

const ESTADO_LABELS: Record<EstadoReparacion, string> = {
  EN_REVISION: 'En Revisión',
  EN_REPARACION: 'En Reparación',
  TERMINADO: 'Terminado',
  ENTREGADO: 'Entregado',
};

const fmtCLP = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0,
  );

const fmtDate = (d?: string | Date | null) => {
  if (!d) return '-';
  const date = typeof d === 'string' ? new Date(d) : d;
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('es-CL');
};

const dateStamp = () => new Date().toISOString().slice(0, 10);

function drawHeader(doc: jsPDF, title: string, subtitle?: string) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.text(BRAND, 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 24);

  if (subtitle) {
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(subtitle, 14, 29.5);
  }
}

function drawFooters(doc: jsPDF) {
  const pages = doc.getNumberOfPages();
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generado el ${new Date().toLocaleString('es-CL')}`, 14, height - 8);
    doc.text(`Página ${i} de ${pages}`, width - 14, height - 8, { align: 'right' });
  }
}

const tableStyles = {
  theme: 'striped' as const,
  headStyles: { fillColor: PRIMARY, textColor: 255, fontStyle: 'bold' as const },
  footStyles: { fillColor: [240, 242, 245] as [number, number, number], textColor: 40, fontStyle: 'bold' as const },
  styles: { fontSize: 9, cellPadding: 3 },
};

export async function exportInventarioPdf(piezas: Pieza[], subtitle?: string) {
  const { jsPDFCtor, autoTable } = await loadLibs();
  const doc = new jsPDFCtor();
  drawHeader(doc, 'Reporte de Inventario', subtitle);

  const totalStock = piezas.reduce((a, p) => a + Number(p.stock), 0);
  const totalValor = piezas.reduce((a, p) => a + Number(p.precio) * Number(p.stock), 0);

  autoTable(doc, {
    ...tableStyles,
    startY: 34,
    head: [['Código', 'Nombre', 'Marca', 'Precio', 'Stock', 'Valor']],
    body: piezas.map((p) => [
      p.codigo,
      p.nombre,
      p.marca || '-',
      fmtCLP(Number(p.precio)),
      String(p.stock),
      fmtCLP(Number(p.precio) * Number(p.stock)),
    ]),
    foot: [['', '', 'Totales', '', String(totalStock), fmtCLP(totalValor)]],
    columnStyles: { 3: { halign: 'right' }, 4: { halign: 'center' }, 5: { halign: 'right' } },
  });

  drawFooters(doc);
  doc.save(`inventario_${dateStamp()}.pdf`);
}

export async function exportReparacionesPdf(
  reparaciones: Reparacion[],
  opts: { subtitle?: string; clienteMap?: Map<number, string> } = {},
) {
  const { jsPDFCtor, autoTable } = await loadLibs();
  const doc = new jsPDFCtor({ orientation: 'landscape' });
  drawHeader(doc, 'Reporte de Reparaciones', opts.subtitle);

  const totalManoObra = reparaciones.reduce((a, r) => a + Number(r.costoManoObra), 0);

  autoTable(doc, {
    ...tableStyles,
    startY: 34,
    head: [['N°', 'Fecha entrada', 'Cliente', 'Vehículo', 'Estado', 'Mecánico', 'Mano de obra']],
    body: reparaciones.map((r) => [
      `#${r.id}`,
      fmtDate(r.fechaEntrada),
      (r.vehiculo && opts.clienteMap?.get(r.vehiculo.clienteId)) || '-',
      r.vehiculo ? `${r.vehiculo.marca} ${r.vehiculo.modelo} (${r.vehiculo.patente})` : `Vehículo #${r.vehiculoId}`,
      ESTADO_LABELS[r.estado] ?? r.estado,
      r.mecanico?.usuario?.nombre || '-',
      fmtCLP(Number(r.costoManoObra)),
    ]),
    foot: [['', '', '', '', '', 'Total mano de obra', fmtCLP(totalManoObra)]],
    columnStyles: { 6: { halign: 'right' } },
  });

  drawFooters(doc);
  doc.save(`reparaciones_${dateStamp()}.pdf`);
}

export async function exportFacturasPdf(facturas: Factura[], opts: { subtitle?: string } = {}) {
  const { jsPDFCtor, autoTable } = await loadLibs();
  const doc = new jsPDFCtor();
  drawHeader(doc, 'Reporte de Facturación', opts.subtitle);

  const total = facturas.reduce((a, f) => a + Number(f.total), 0);

  autoTable(doc, {
    ...tableStyles,
    startY: 34,
    head: [['N°', 'Fecha', 'Cliente', 'Total']],
    body: facturas.map((f) => [
      `#${f.id}`,
      fmtDate(f.fecha),
      f.cliente?.nombre || `Cliente #${f.clienteId}`,
      fmtCLP(Number(f.total)),
    ]),
    foot: [['', '', 'Total facturado', fmtCLP(total)]],
    columnStyles: { 3: { halign: 'right' } },
  });

  drawFooters(doc);
  doc.save(`facturas_${dateStamp()}.pdf`);
}

export type RangePreset = 'mes' | 'mesAnterior' | '30d' | '90d' | 'todo';

export const RANGE_PRESETS: { value: RangePreset; label: string }[] = [
  { value: 'mes', label: 'Este mes' },
  { value: 'mesAnterior', label: 'Mes anterior' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: 'todo', label: 'Todo el histórico' },
];

export interface DateRange {
  desde: Date | null;
  hasta: Date | null;
  label: string;
}

export function getPresetRange(preset: RangePreset): DateRange {
  const now = new Date();
  switch (preset) {
    case 'mes':
      return { desde: new Date(now.getFullYear(), now.getMonth(), 1), hasta: now, label: 'Este mes' };
    case 'mesAnterior': {
      const desde = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const hasta = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      return { desde, hasta, label: 'Mes anterior' };
    }
    case '30d':
      return { desde: new Date(now.getTime() - 30 * 86400000), hasta: now, label: 'Últimos 30 días' };
    case '90d':
      return { desde: new Date(now.getTime() - 90 * 86400000), hasta: now, label: 'Últimos 90 días' };
    default:
      return { desde: null, hasta: null, label: 'Todo el histórico' };
  }
}

export function rangeSubtitle(range: DateRange): string {
  if (!range.desde || !range.hasta) return range.label;
  return `${range.label} (${fmtDate(range.desde)} — ${fmtDate(range.hasta)})`;
}

export function isWithinRange(dateStr: string | undefined | null, range: DateRange): boolean {
  if (!dateStr) return false;
  if (!range.desde || !range.hasta) return true;
  const d = new Date(dateStr).getTime();
  if (Number.isNaN(d)) return false;
  return d >= range.desde.getTime() && d <= range.hasta.getTime();
}
