import { INestApplication } from '@nestjs/common';
import {
  crear,
  crearClausula,
  crearParagrafo,
  nuevoContratoId,
} from './factories';

export interface PlantillaSembrada {
  clausulas: any[];
  paragrafos: any[];
  ordenClausula: any;
  ordenParagrafo: any;
  cuerpoPlantilla: Record<string, unknown>;
}

/**
 * Siembra lo que necesita una plantilla por tipo de contrato: dos cláusulas
 * (nombres "Primera" y "Segunda"), dos parágrafos colgando de la primera, y sus
 * dos documentos de orden. No crea la plantilla: devuelve su cuerpo para poder
 * probar el POST.
 */
export async function sembrarPlantilla(
  app: INestApplication,
  opciones: {
    tipoContratoId: number;
    unidadEjecutoraId?: number;
    reversionSaldo?: boolean;
    aplicaPoliza?: boolean;
  },
): Promise<PlantillaSembrada> {
  const c1 = await crearClausula(app, { nombre: 'Primera' });
  const c2 = await crearClausula(app, { nombre: 'Segunda' });
  const p1 = await crearParagrafo(app, { nombre: 'Parágrafo A' });
  const p2 = await crearParagrafo(app, { nombre: 'Parágrafo B' });
  const contratoPlantilla = nuevoContratoId();

  const ordenClausula = await crear(app, '/orden-clausulas', {
    clausula_ids: [c1._id, c2._id],
    contrato_id: contratoPlantilla,
    creado_por: 1,
    actualizado_por: 1,
  });
  const ordenParagrafo = await crear(app, '/orden-paragrafos', {
    paragrafo_ids: [p1._id, p2._id],
    contrato_id: contratoPlantilla,
    clausula_id: c1._id,
    creado_por: 1,
    actualizado_por: 1,
  });

  return {
    clausulas: [c1, c2],
    paragrafos: [p1, p2],
    ordenClausula,
    ordenParagrafo,
    cuerpoPlantilla: {
      tipo_contrato_id: opciones.tipoContratoId,
      unidad_ejecutora_id: opciones.unidadEjecutoraId ?? 1,
      orden_clausula_id: ordenClausula._id,
      orden_paragrafo_ids: [ordenParagrafo._id],
      reversion_saldo: opciones.reversionSaldo ?? false,
      aplica_poliza: opciones.aplicaPoliza ?? true,
      creado_por: 1,
      actualizado_por: 1,
    },
  };
}

/** Espera (con tope) a que se cumpla una condición asíncrona. */
export async function esperarHasta(
  condicion: () => Promise<boolean>,
  tiempoMaxMs = 3000,
): Promise<boolean> {
  const inicio = Date.now();
  while (Date.now() - inicio < tiempoMaxMs) {
    if (await condicion()) return true;
    await new Promise((resolver) => setTimeout(resolver, 100));
  }
  return false;
}
