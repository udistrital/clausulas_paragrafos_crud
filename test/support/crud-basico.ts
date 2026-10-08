import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { crearApp, limpiarBd } from './app';
import { cuerpoTexto, crear, ID_INEXISTENTE, unico } from './factories';

/**
 * Casos comunes de /clausulas y /paragrafos: ambos tienen el mismo esquema,
 * DTO y comportamiento. Corre contra MongoDB real.
 */
export function pruebasCrudBasico(etiqueta: string, ruta: string) {
  describe(`${etiqueta} (integración con MongoDB)`, () => {
    let app: INestApplication;
    const http = () => request(app.getHttpServer());

    beforeAll(async () => {
      app = await crearApp();
    });

    afterAll(async () => {
      await limpiarBd(app);
      await app.close();
    });

    it('POST crea el registro (201) y el service fuerza es_editable y activo', async () => {
      const cuerpo = cuerpoTexto();
      const res = await http().post(ruta).send(cuerpo).expect(201);

      expect(res.body.Success).toBe(true);
      expect(res.body.Status).toBe(201);
      expect(res.body.Data._id).toMatch(/^[0-9a-f]{24}$/);
      expect(res.body.Data.nombre).toBe(cuerpo.nombre);
      expect(res.body.Data.es_editable).toBe(true);
      expect(res.body.Data.activo).toBe(true);
      expect(res.body.Data.fecha_creacion).toBeDefined();
    });

    it('GET lista incluye lo creado y filtra por query', async () => {
      const sufijo = unico();
      const creado = await crear(
        app,
        ruta,
        cuerpoTexto({ nombre: `filtro-${sufijo}` }),
      );
      await crear(app, ruta, cuerpoTexto());

      const todos = await http().get(ruta).expect(200);
      expect(todos.body.Data.length).toBeGreaterThanOrEqual(2);

      const filtrado = await http()
        .get(ruta)
        .query({ query: `nombre:filtro-${sufijo}` })
        .expect(200);
      expect(filtrado.body.Data).toHaveLength(1);
      expect(filtrado.body.Data[0]._id).toBe(creado._id);
    });

    it('GET pagina con limit y offset', async () => {
      const lote = `lote-${unico()}`;
      for (let i = 0; i < 3; i++) {
        await crear(app, ruta, cuerpoTexto({ descripcion: lote }));
      }

      const pagina1 = await http()
        .get(ruta)
        .query({ query: `descripcion:${lote}`, limit: 2 })
        .expect(200);
      expect(pagina1.body.Data).toHaveLength(2);

      const pagina2 = await http()
        .get(ruta)
        .query({ query: `descripcion:${lote}`, limit: 2, offset: 2 })
        .expect(200);
      expect(pagina2.body.Data).toHaveLength(1);
    });

    it('GET ordena con orderBy y sort', async () => {
      const lote = `orden-${unico()}`;
      for (const letra of ['b', 'a', 'c']) {
        await crear(
          app,
          ruta,
          cuerpoTexto({ nombre: `${lote}-${letra}`, descripcion: lote }),
        );
      }

      const asc = await http()
        .get(ruta)
        .query({ query: `descripcion:${lote}`, orderBy: 'nombre', sort: 'asc' })
        .expect(200);
      expect(asc.body.Data.map((x: any) => x.nombre)).toEqual([
        `${lote}-a`,
        `${lote}-b`,
        `${lote}-c`,
      ]);

      const desc = await http()
        .get(ruta)
        .query({
          query: `descripcion:${lote}`,
          orderBy: 'nombre',
          sort: 'desc',
        })
        .expect(200);
      expect(desc.body.Data.map((x: any) => x.nombre)).toEqual([
        `${lote}-c`,
        `${lote}-b`,
        `${lote}-a`,
      ]);
    });

    it('GET /:id devuelve el registro', async () => {
      const creado = await crear(app, ruta, cuerpoTexto());
      const res = await http().get(`${ruta}/${creado._id}`).expect(200);

      expect(res.body.Data._id).toBe(creado._id);
      expect(res.body.Data.nombre).toBe(creado.nombre);
    });

    it('PUT /:id devuelve el documento ya actualizado (returnDocument: after)', async () => {
      const creado = await crear(app, ruta, cuerpoTexto());
      const nuevoNombre = `editado-${unico()}`;

      const res = await http()
        .put(`${ruta}/${creado._id}`)
        .send(cuerpoTexto({ nombre: nuevoNombre, actualizado_por: 2 }))
        .expect(200);

      expect(res.body.Data.nombre).toBe(nuevoNombre);
      expect(res.body.Data.actualizado_por).toBe(2);
      expect(
        new Date(res.body.Data.fecha_modificacion).getTime(),
      ).toBeGreaterThanOrEqual(new Date(creado.fecha_modificacion).getTime());

      const releido = await http().get(`${ruta}/${creado._id}`).expect(200);
      expect(releido.body.Data.nombre).toBe(nuevoNombre);
    });

    it('DELETE /:id es lógico: el registro sigue existiendo con activo=false', async () => {
      const creado = await crear(app, ruta, cuerpoTexto());

      const res = await http().delete(`${ruta}/${creado._id}`).expect(200);
      expect(res.body.Data._id).toBe(creado._id);

      const releido = await http().get(`${ruta}/${creado._id}`).expect(200);
      expect(releido.body.Data.activo).toBe(false);
    });

    // HALLAZGO: el service lanza Error("<id> doesn't exist") y el controller no
    // lo captura, así que un id inexistente responde 500 y no 404.
    it('HALLAZGO: GET/PUT/DELETE con id inexistente responden 500', async () => {
      await http().get(`${ruta}/${ID_INEXISTENTE}`).expect(500);
      await http()
        .put(`${ruta}/${ID_INEXISTENTE}`)
        .send(cuerpoTexto())
        .expect(500);
      await http().delete(`${ruta}/${ID_INEXISTENTE}`).expect(500);
    });

    // HALLAZGO: un id con formato inválido produce CastError de Mongoose y
    // tampoco se captura: 500.
    it('HALLAZGO: GET con id mal formado responde 500', async () => {
      await http().get(`${ruta}/zzz`).expect(500);
    });

    // HALLAZGO: main.ts no registra ValidationPipe global, así que el DTO no se
    // valida. La petición sin `predeterminado` solo la frena el esquema de Mongoose.
    it('HALLAZGO: POST sin campos requeridos no lo rechaza el DTO (lo frena Mongoose con 500)', async () => {
      const incompleto: Record<string, unknown> = cuerpoTexto();
      delete incompleto.predeterminado;
      await http().post(ruta).send(incompleto).expect(500);
    });
  });
}
