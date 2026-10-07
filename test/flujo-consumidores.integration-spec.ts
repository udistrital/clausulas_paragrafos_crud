import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { crearApp, limpiarBd } from './support/app';
import { crear, nuevoContratoId } from './support/factories';
import { sembrarPlantilla } from './support/plantilla';

/**
 * Reproduce, contra MongoDB real, las llamadas que hacen los servicios que
 * consumen este CRUD. Si cambia el contrato HTTP, estas pruebas lo detectan.
 */
describe('Contrato HTTP con los consumidores (integración con MongoDB)', () => {
  let app: INestApplication;
  const http = () => request(app.getHttpServer());

  beforeAll(async () => {
    app = await crearApp();
  });

  afterAll(async () => {
    await limpiarBd(app);
    await app.close();
  });

  /**
   * gestion_contractual_mf, paso "Cláusulas y parágrafos"
   * (paso-clausulas-paragrafos.component.ts):
   *   1. GET contratos/:id            -> si viene vacío:
   *   2. GET plantilla-tipo-contratos/tipo-contrato/:tipo?query=...
   *   3. POST contratos/:id con { clausula_ids, paragrafos, creado_por, actualizado_por }
   *   4. usa response.Data.ordenClausula.contrato_id
   */
  it('MF: contrato nuevo se arma desde la plantilla del tipo de contrato', async () => {
    const tipo = 80_000 + Math.floor(Math.random() * 10_000);
    const unidadEjecutora = 6818;
    const { cuerpoPlantilla, clausulas, paragrafos } = await sembrarPlantilla(
      app,
      {
        tipoContratoId: tipo,
        unidadEjecutoraId: unidadEjecutora,
        reversionSaldo: false,
        aplicaPoliza: true,
      },
    );
    await crear(app, '/plantilla-tipo-contratos', cuerpoPlantilla);
    const contratoId = nuevoContratoId();

    // 1. el contrato aún no tiene estructura
    const vacio = await http().get(`/contratos/${contratoId}`).expect(200);
    expect(vacio.body.Success).toBe(true);
    expect(vacio.body.Data).toEqual([]);

    // 2. se consulta la plantilla del tipo de contrato con los filtros del MF
    const plantilla = await http()
      .get(`/plantilla-tipo-contratos/tipo-contrato/${tipo}`)
      .query({
        query: `reversion_saldo:false;aplica_poliza:true;unidad_ejecutora_id:${unidadEjecutora}`,
      })
      .expect(200);
    expect(plantilla.body.Success).toBe(true);
    const clausulasPlantilla: any[] = plantilla.body.Data;
    expect(clausulasPlantilla.length).toBeGreaterThan(0);

    // 3. el MF arma el cuerpo igual que crearContratoDesdePlantilla()
    const nuevoContrato = {
      clausula_ids: clausulasPlantilla.map((c) => c._id),
      paragrafos: clausulasPlantilla
        .map((c) => ({
          clausula_id: c._id,
          paragrafo_ids: c.paragrafos.map((p: any) => p._id),
        }))
        .filter((p) => p.paragrafo_ids.length > 0),
      creado_por: 123,
      actualizado_por: 123,
    };
    const creado = await http()
      .post(`/contratos/${contratoId}`)
      .send(nuevoContrato)
      .expect(201);

    // 4. el MF lee el contrato_id de la respuesta
    expect(creado.body.Success).toBe(true);
    expect(creado.body.Data.ordenClausula.contrato_id).toBe(contratoId);

    // y ahora GET contratos/:id ya devuelve la estructura copiada de la plantilla
    const guardado = await http().get(`/contratos/${contratoId}`).expect(200);
    expect(guardado.body.Data.map((c: any) => c._id)).toEqual(
      clausulas.map((c) => c._id),
    );
    expect(guardado.body.Data[0].paragrafos.map((p: any) => p._id)).toEqual(
      paragrafos.map((p) => p._id),
    );
  });

  /**
   * minuta_contractual_mid (minuta.service.ts, obtenerPlantillaClausulas):
   *   GET contratos/:id y pasa el arreglo a la plantilla como `clausulas`.
   * La plantilla recorre cada cláusula y sus parágrafos, así que importa la forma.
   */
  it('minuta: GET contratos/:id entrega un arreglo de cláusulas con parágrafos', async () => {
    const { clausulas, paragrafos } = await sembrarPlantilla(app, {
      tipoContratoId: 90_000 + Math.floor(Math.random() * 10_000),
    });
    const contratoId = nuevoContratoId();
    await http()
      .post(`/contratos/${contratoId}`)
      .send({
        clausula_ids: clausulas.map((c) => c._id),
        paragrafos: [
          {
            clausula_id: clausulas[0]._id,
            paragrafo_ids: paragrafos.map((p) => p._id),
          },
        ],
        creado_por: 1,
        actualizado_por: 1,
      })
      .expect(201);

    const res = await http().get(`/contratos/${contratoId}`).expect(200);

    expect(Array.isArray(res.body.Data)).toBe(true);
    expect(res.body.Data).toHaveLength(2);
    for (const clausula of res.body.Data) {
      expect(typeof clausula._id).toBe('string');
      expect(clausula).toHaveProperty('nombre');
      expect(clausula).toHaveProperty('descripcion');
      expect(Array.isArray(clausula.paragrafos)).toBe(true);
    }
  });
});
