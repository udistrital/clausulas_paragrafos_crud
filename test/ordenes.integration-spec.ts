import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { crearApp, limpiarBd } from './support/app';
import {
  crear,
  crearClausula,
  crearParagrafo,
  ID_INEXISTENTE,
  nuevoContratoId,
} from './support/factories';

describe('/orden-clausulas y /orden-paragrafos (integración con MongoDB)', () => {
  let app: INestApplication;
  const http = () => request(app.getHttpServer());

  beforeAll(async () => {
    app = await crearApp();
  });

  afterAll(async () => {
    await limpiarBd(app);
    await app.close();
  });

  describe('/orden-clausulas', () => {
    const cuerpo = (clausulaIds: string[], contratoId: number) => ({
      clausula_ids: clausulaIds,
      contrato_id: contratoId,
      creado_por: 1,
      actualizado_por: 1,
    });

    it('POST guarda la lista ordenada de cláusulas del contrato (201)', async () => {
      const c1 = await crearClausula(app);
      const c2 = await crearClausula(app);
      const contratoId = nuevoContratoId();

      const res = await http()
        .post('/orden-clausulas')
        .send(cuerpo([c1._id, c2._id], contratoId))
        .expect(201);

      expect(res.body.Success).toBe(true);
      expect(res.body.Data.contrato_id).toBe(contratoId);
      expect(res.body.Data.clausula_ids).toEqual([c1._id, c2._id]);
      expect(res.body.Data.activo).toBe(true);
    });

    it('GET /:id y GET lista devuelven el registro', async () => {
      const c1 = await crearClausula(app);
      const creado = await crear(
        app,
        '/orden-clausulas',
        cuerpo([c1._id], nuevoContratoId()),
      );

      const porId = await http()
        .get(`/orden-clausulas/${creado._id}`)
        .expect(200);
      expect(porId.body.Data._id).toBe(creado._id);

      const lista = await http()
        .get('/orden-clausulas')
        .query({ query: `contrato_id:${creado.contrato_id}` })
        .expect(200);
      expect(lista.body.Data).toHaveLength(1);
      expect(lista.body.Data[0]._id).toBe(creado._id);
    });

    it('PUT con los ids invertidos conserva el nuevo orden', async () => {
      const c1 = await crearClausula(app);
      const c2 = await crearClausula(app);
      const contratoId = nuevoContratoId();
      const creado = await crear(
        app,
        '/orden-clausulas',
        cuerpo([c1._id, c2._id], contratoId),
      );

      const res = await http()
        .put(`/orden-clausulas/${creado._id}`)
        .send({ ...cuerpo([c2._id, c1._id], contratoId), actualizado_por: 2 })
        .expect(200);
      expect(res.body.Data.clausula_ids).toEqual([c2._id, c1._id]);

      // GET /:id devuelve las cláusulas pobladas (documentos completos), no solo ids
      const releido = await http()
        .get(`/orden-clausulas/${creado._id}`)
        .expect(200);
      expect(releido.body.Data.clausula_ids.map((c: any) => c._id)).toEqual([
        c2._id,
        c1._id,
      ]);
      expect(releido.body.Data.clausula_ids[0].nombre).toBe(c2.nombre);
    });

    it('DELETE es lógico (activo=false)', async () => {
      const c1 = await crearClausula(app);
      const creado = await crear(
        app,
        '/orden-clausulas',
        cuerpo([c1._id], nuevoContratoId()),
      );

      await http().delete(`/orden-clausulas/${creado._id}`).expect(200);
      const releido = await http()
        .get(`/orden-clausulas/${creado._id}`)
        .expect(200);
      expect(releido.body.Data.activo).toBe(false);
    });

    // HALLAZGO: igual que cláusulas, el id inexistente termina en 500.
    it('HALLAZGO: id inexistente responde 500', async () => {
      await http().get(`/orden-clausulas/${ID_INEXISTENTE}`).expect(500);
    });
  });

  describe('/orden-paragrafos', () => {
    const cuerpo = (
      paragrafoIds: string[],
      clausulaId: string,
      contratoId: number,
    ) => ({
      paragrafo_ids: paragrafoIds,
      contrato_id: contratoId,
      clausula_id: clausulaId,
      creado_por: 1,
      actualizado_por: 1,
    });

    it('POST guarda la lista ordenada de parágrafos de una cláusula (201)', async () => {
      const clausula = await crearClausula(app);
      const p1 = await crearParagrafo(app);
      const p2 = await crearParagrafo(app);
      const contratoId = nuevoContratoId();

      const res = await http()
        .post('/orden-paragrafos')
        .send(cuerpo([p1._id, p2._id], clausula._id, contratoId))
        .expect(201);

      expect(res.body.Data.contrato_id).toBe(contratoId);
      expect(res.body.Data.clausula_id).toBe(clausula._id);
      expect(res.body.Data.paragrafo_ids).toEqual([p1._id, p2._id]);
    });

    it('PUT con los ids invertidos conserva el nuevo orden', async () => {
      const clausula = await crearClausula(app);
      const p1 = await crearParagrafo(app);
      const p2 = await crearParagrafo(app);
      const contratoId = nuevoContratoId();
      const creado = await crear(
        app,
        '/orden-paragrafos',
        cuerpo([p1._id, p2._id], clausula._id, contratoId),
      );

      const res = await http()
        .put(`/orden-paragrafos/${creado._id}`)
        .send(cuerpo([p2._id, p1._id], clausula._id, contratoId))
        .expect(200);
      expect(res.body.Data.paragrafo_ids).toEqual([p2._id, p1._id]);
    });

    it('GET /:id y DELETE lógico', async () => {
      const clausula = await crearClausula(app);
      const p1 = await crearParagrafo(app);
      const creado = await crear(
        app,
        '/orden-paragrafos',
        cuerpo([p1._id], clausula._id, nuevoContratoId()),
      );

      const porId = await http()
        .get(`/orden-paragrafos/${creado._id}`)
        .expect(200);
      expect(porId.body.Data._id).toBe(creado._id);

      await http().delete(`/orden-paragrafos/${creado._id}`).expect(200);
      const releido = await http()
        .get(`/orden-paragrafos/${creado._id}`)
        .expect(200);
      expect(releido.body.Data.activo).toBe(false);
    });

    it('HALLAZGO: id inexistente responde 500', async () => {
      await http().get(`/orden-paragrafos/${ID_INEXISTENTE}`).expect(500);
    });
  });
});
