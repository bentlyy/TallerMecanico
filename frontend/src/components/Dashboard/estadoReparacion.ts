import type { EstadoReparacion } from '../../types';

export type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

export const estadoLabels: Record<EstadoReparacion, string> = {
  EN_REVISION: 'En Revisión',
  EN_REPARACION: 'En Reparación',
  TERMINADO: 'Terminado',
  FACTURADO: 'Facturado',
  PAGADO: 'Pagado',
  ENTREGADO: 'Entregado',
};

export const estadoColors: Record<EstadoReparacion, ChipColor> = {
  EN_REVISION: 'warning',
  EN_REPARACION: 'info',
  TERMINADO: 'primary',
  FACTURADO: 'secondary',
  PAGADO: 'success',
  ENTREGADO: 'default',
};
