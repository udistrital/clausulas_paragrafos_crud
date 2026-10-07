import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { crearApp, limpiarBd } from './support/app';
import {
  crearClausula,
  crearParagrafo,
  nuevoContratoId,
} from './support/factories';

describe('/contratos (integración con MongoDB)', () => {
  let app: INestApplication;
  const http = () => request(app.getHttpServer());

  beforeAll(async () => {
    app = await crearApp();
  });

  afterAll(async () => {
    await limpiarBd(app);
    await app.close();
  });

  /** Dos cláusulas; la primera con dos parágrafos y la segunda con uno. */
  async function sembrar() {
    const c1 = await crearClausula(app, { nombre: 'Primera' });
    const c2 = await crearClausula(app, { nombre: 'Segunda' });
    const p1 = await crearParagrafo(app, { nombre: 'Parágrafo 1' });
    const p2 = await crearParagrafo(app, { nombre: 'Parágrafo 2' });
    const p3 = await crearParagrafo(app, { nombre: 'Parágrafo 3' });
    return { c1, c2, p1, p2, p3 };
  }

  const estructura = (
    clausulaIds: string[],
    paragrafos: { clausula_id: string; paragrafo_ids: string[] }[],
    actualizadoPor = 1,
  ) => ({
    clausula_ids: clausulaIds,
    paragrafos,
    creado_por: 1,
    actualizado_por: actualizadoPor,
  });

  it('POST /:id crea las estructuras de cláusulas y parágrafos (201)', async () => {
    const { c1, c2, p1 } = await sembrar();
    const contratoId = nuevoContratoId();

    const res = await http()
      .post(`/contratos/${contratoId}`)
      .send(
        estructura(
          [c1._id, c2._id],
          [{ clausula_id: c1._id, paragrafo_ids: [p1._id] }],
        ),
      )
      .expect(201);

    expect(res.body.Success).toBe(true);
    expect(res.body.Data.ordenClausula.contrato_id).toBe(contratoId);
    expect(res.body.Data.ordenClausula.clausula_ids).toEqual([c1._id, c2._id]);
    expect(res.body.Data.ordenParagrafos).toHaveLength(1);
  });

  it('POST /:id repetido para el mismo contrato responde 409', async () => {
    const { c1 } = await sembrar();
    const contratoId = nuevoContratoId();
    const cuerpo = estructura([c1._id], []);

    await http().post(`/contratos/${contratoId}`).send(cuerpo).expect(201);
    const res = await http()
      .post(`/contratos/${contratoId}`)
      .send(cuerpo)
      .expect(409);

    expect(res.body.Success).toBe(false);
    expect(res.body.Status).toBe(409);
  });

  it('GET /:id devuelve las cláusulas en el orden guardado, con sus parágrafos anidados', async () => {
    const { c1, c2, p1, p2, p3 } = await sembrar();
    const contratoId = nuevoContratoId();
    await http()
      .post(`/contratos/${contratoId}`)
      .send(
        estructura(
          [c2._id, c1._id],
          [
            { clausula_id: c1._id, paragrafo_ids: [p2._id, p1._id] },
            { clausula_id: c2._id, paragrafo_ids: [p3._id] },
          ],
        ),
      )
      .expect(201);

    const res = await http().get(`/contratos/${contratoId}`).expect(200);
    const clausulas = res.body.Data;

    expect(clausulas.map((c: any) => c._id)).toEqual([c2._id, c1._id]);
    expect(clausulas[0].nombre).toBe('Segunda');
    expect(clausulas[0].paragrafos.map((p: any) => p._id)).toEqual([p3._id]);
    expect(clausulas[1].paragrafos.map((p: any) => p._id)).toEqual([
      p2._id,
      p1._id,
    ]);
  });

  it('PUT /:id reordena cláusulas y parágrafos', async () => {
    const { c1, c2, p1, p2 } = await sembrar();
    const contratoId = nuevoContratoId();
    await http()
      .post(`/contratos/${contratoId}`)
      .send(
        estructura(
          [c1._id, c2._id],
          [{ clausula_id: c1._id, paragrafo_ids: [p1._id, p2._id] }],
        ),
      )
      .expect(201);

    const put = await http()
      .put(`/contratos/${contratoId}`)
      .send(
        estructura(
          [c2._id, c1._id],
          [{ clausula_id: c1._id, paragrafo_ids: [p2._id, p1._id] }],
          2,
        ),
      )
      .expect(200);
    expect(put.body.Data.ordenClausula.clausula_ids).toEqual([c2._id, c1._id]);

    const res = await http().get(`/contratos/${contratoId}`).expect(200);
    expect(res.body.Data.map((c: any) => c._id)).toEqual([c2._id, c1._id]);
    expect(res.body.Data[1].paragrafos.map((p: any) => p._id)).toEqual([
      p2._id,
      p1._id,
    ]);
  });

  // HALLAZGO: PUT usa upsert y el update solo escribe clausula_ids y
  // fecha_modificacion. El documento nuevo queda sin `activo` ni `creado_por`,
  // y GET /contratos/:id filtra por activo=true: el contrato "creado" con PUT
  // existe en la BD pero GET responde lista vacía. Para crear hay que usar POST.
  it('HALLAZGO: PUT sobre un contrato sin estructura crea el documento sin `activo` y GET no lo ve', async () => {
    const { c1 } = await sembrar();
    const contratoId = nuevoContratoId();

    await http()
      .put(`/contratos/${contratoId}`)
      .send(estructura([c1._id], []))
      .expect(200);

    const existente = await http()
      .get('/orden-clausulas')
      .query({ query: `contrato_id:${contratoId}` })
      .expect(200);
    expect(existente.body.Data).toHaveLength(1);
    expect(existente.body.Data[0].activo).toBeUndefined();

    const res = await http().get(`/contratos/${contratoId}`).expect(200);
    expect(res.body.Data).toEqual([]);
  });

  it('GET /:id de un contrato sin estructura responde 200 con lista vacía', async () => {
    const res = await http().get(`/contratos/${nuevoContratoId()}`).expect(200);

    expect(res.body.Success).toBe(true);
    expect(res.body.Data).toEqual([]);
  });
});
