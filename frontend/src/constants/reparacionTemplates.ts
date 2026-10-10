export interface ServiceTemplate {
  label: string;
  descripcion: string;
  problemaReportado: string;
  diagnostico: string;
  trabajosRealizados: string;
}

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    label: 'Cambio de aceite y filtros',
    descripcion: 'Cambio de aceite y filtros',
    problemaReportado: 'El cliente solicita el cambio de aceite y filtros.',
    diagnostico: 'Se verifica el nivel y estado del aceite; se recomienda el cambio según el kilometraje.',
    trabajosRealizados:
      'Cambio de aceite de motor, filtro de aceite, filtro de aire y filtro de combustible. Control de niveles y revisión de pérdidas.',
  },
  {
    label: 'Service / mantenimiento',
    descripcion: 'Service de mantenimiento preventivo',
    problemaReportado: 'Mantenimiento periódico por kilometraje.',
    diagnostico: 'Inspección general según el plan de mantenimiento del fabricante.',
    trabajosRealizados:
      'Cambio de aceite y filtros, control de niveles, revisión de frenos, suspensión, luces, correas y estado general.',
  },
  {
    label: 'Frenos',
    descripcion: 'Revisión y service de frenos',
    problemaReportado: 'Ruidos o pérdida de eficacia al frenar.',
    diagnostico: 'Desgaste de pastillas y/o discos; se verifica el nivel de líquido de frenos.',
    trabajosRealizados: 'Cambio de pastillas de freno, rectificado/cambio de discos y purgado del líquido de frenos.',
  },
  {
    label: 'Alineación y balanceo',
    descripcion: 'Alineación y balanceo',
    problemaReportado: 'El vehículo se desvía o vibra el volante.',
    diagnostico: 'Desalineación de la dirección y desbalanceo de ruedas.',
    trabajosRealizados: 'Alineación de dirección, balanceo de las 4 ruedas y control de presión.',
  },
  {
    label: 'Batería / eléctrico',
    descripcion: 'Diagnóstico eléctrico / batería',
    problemaReportado: 'Dificultad para arrancar o fallas eléctricas.',
    diagnostico: 'Batería con bajo voltaje y/o fallas en alternador o masa.',
    trabajosRealizados: 'Prueba de batería y alternador, limpieza de bornes, revisión de fusibles y luces.',
  },
  {
    label: 'Neumáticos',
    descripcion: 'Service de neumáticos',
    problemaReportado: 'Desgaste irregular o pinchazo.',
    diagnostico: 'Se verifica el estado y desgaste de las cubiertas.',
    trabajosRealizados: 'Reparación/cambio de neumáticos, rotación y control de presión.',
  },
  {
    label: 'Aire acondicionado',
    descripcion: 'Service de aire acondicionado',
    problemaReportado: 'El aire acondicionado no enfría.',
    diagnostico: 'Baja carga de gas y posible obstrucción del circuito.',
    trabajosRealizados: 'Recarga de gas refrigerante, limpieza del circuito y control del compresor.',
  },
  {
    label: 'Diagnóstico general',
    descripcion: 'Diagnóstico general',
    problemaReportado: 'Revisión integral a solicitud del cliente.',
    diagnostico: 'Escaneo OBD y revisión general de sistemas.',
    trabajosRealizados: 'Escaneo de computadora, prueba en ruta y revisión de sistemas principales.',
  },
];
