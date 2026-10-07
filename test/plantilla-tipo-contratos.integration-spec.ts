import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { crearApp, limpiarBd } from './support/app';
import { crear, ID_INEXISTENTE } from './support/factories';
import { esperarHasta, sembrarPlantilla } from './support/plantilla';

describe('/plantilla-tipo-contratos (integración con MongoDB)', () => {
  let app: INestApplication;
  const http = () => request(app.getHttpServer());
  /** tipo_contrato_id distinto por prueba para que no se mezclen versiones. */
  let siguienteTipo = 70_000 + Math.floor(Math.random() * 10_000);
  const nuevoTipo = () => ++siguienteTipo;

  beforeAll(async () => {
    app = await crearApp();
  });

  afterAll(async () => {
    await limpiarBd(app);
    await app.close();
  });

  it('POST crea la plantilla (201) con version_actual=true', async () => {
    const tipo = nuevoTipo();
    const { cuerpoPlantilla, ordenClausula } = await sembrarPlantilla(app, {
      tipoContratoId: tipo,
    });

    const res = await http()
      .post('/plantilla-tipo-contratos')
      .send(cuerpoPlantilla)
      .expect(201);

    expect(res.body.Success).toBe(true);
    expect(res.body.Data.tipo_contrato_id).toBe(tipo);
    expect(res.body.Data.version_actual).toBe(true);
    expect(res.body.Data.activo).toBe(true);
    expect(res.body.Data.orden_clausula_id).toBe(ordenClausula._id);
  });

  // HALLAZGO: currentVersion arranca en 1 y se le suma 1, así que la primera
  // versión de un tipo de contrato queda numerada 2.
  it('HALLAZGO: la primera versión de un tipo de contrato queda en 2', async () => {
    const { cuerpoPlantilla } = await sembrarPlantilla(app, {
      tipoContratoId: nuevoTipo(),
    });

    const res = await http()
      .post('/plantilla-tipo-contratos')
      .send(cuerpoPlantilla)
      .expect(201);

    expect(res.body.Data.version).toBe(2);
  });

  it('un segundo POST del mismo tipo sube la versión y deja solo la nueva como actual', async () => {
    const tipo = nuevoTipo();
    const primera = await sembrarPlantilla(app, { tipoContratoId: tipo });
    const v1 = await crear(
      app,
      '/plantilla-tipo-contratos',
      primera.cuerpoPlantilla,
    );
    const segunda = await sembrarPlantilla(app, { tipoContratoId: tipo });
    const v2 = await crear(
      app,
      '/plantilla-tipo-contratos',
      segunda.cuerpoPlantilla,
    );

    expect(v2.version).toBe(v1.version + 1);
    expect(v2.version_actual).toBe(true);

    // El service marca la anterior sin esperar el save(); se sondea hasta que se refleje.
    const reflejado = await esperarHasta(async () => {
      const res = await http()
        .get('/plantilla-tipo-contratos')
        .query({ query: `tipo_contrato_id:${tipo}` })
        .expect(200);
      const anterior = res.body.Data.find((x: any) => x._id === v1._id);
      return anterior?.version_actual === false;
    });
    expect(reflejado).toBe(true);
  });

  it('GET lista devuelve Metadata.count y las órdenes pobladas', async () => {
    const tipo = nuevoTipo();
    const { cuerpoPlantilla, ordenClausula } = await sembrarPlantilla(app, {
      tipoContratoId: tipo,
    });
    await crear(app, '/plantilla-tipo-contratos', cuerpoPlantilla);

    const res = await http()
      .get('/plantilla-tipo-contratos')
      .query({ query: `tipo_contrato_id:${tipo}` })
      .expect(200);

    expect(res.body.Metadata.count).toBe(1);
    expect(res.body.Data).toHaveLength(1);
    // populate: la referencia llega como documento y no como id
    expect(res.body.Data[0].orden_clausula_id._id).toBe(ordenClausula._id);
    expect(res.body.Data[0].orden_paragrafo_ids).toHaveLength(1);
  });

  it('GET /:id resuelve cláusulas y parágrafos con $lookup', async () => {
    const { cuerpoPlantilla, clausulas, paragrafos } = await sembrarPlantilla(
      app,
      { tipoContratoId: nuevoTipo() },
    );
    const creada = await crear(
      app,
      '/plantilla-tipo-contratos',
      cuerpoPlantilla,
    );

    const res = await http()
      .get(`/plantilla-tipo-contratos/${creada._id}`)
      .expect(200);

    expect(res.body.Data).toHaveLength(2);
    expect(res.body.Data[0].clausulas._id).toBe(clausulas[0]._id);
    expect(
      res.body.Data[0].clausulas.paragrafos.map((p: any) => p._id),
    ).toEqual([paragrafos[0]._id, paragrafos[1]._id]);
    expect(res.body.Data[1].clausulas._id).toBe(clausulas[1]._id);
    expect(res.body.Data[1].clausulas.paragrafos).toEqual([]);
  });

  describe('GET /tipo-contrato/:tipo_contrato_id (lo que consume el MF)', () => {
    it('devuelve las cláusulas en orden con sus parágrafos anidados', async () => {
      const tipo = nuevoTipo();
      const { cuerpoPlantilla, clausulas, paragrafos } = await sembrarPlantilla(
        app,
        { tipoContratoId: tipo, unidadEjecutoraId: 6818 },
      );
      await crear(app, '/plantilla-tipo-contratos', cuerpoPlantilla);

      const res = await http()
        .get(`/plantilla-tipo-contratos/tipo-contrato/${tipo}`)
        .query({
          query:
            'reversion_saldo:false;aplica_poliza:true;unidad_ejecutora_id:6818',
        })
        .expect(200);

      expect(res.body.Data.map((c: any) => c._id)).toEqual([
        clausulas[0]._id,
        clausulas[1]._id,
      ]);
      expect(res.body.Data[0].nombre).toBe('Primera');
      expect(res.body.Data[0].paragrafos.map((p: any) => p._id)).toEqual([
        paragrafos[0]._id,
        paragrafos[1]._id,
      ]);
      expect(res.body.Data[1].paragrafos).toEqual([]);
    });

    it('sin filtros devuelve la plantilla del tipo', async () => {
      const tipo = nuevoTipo();
      const { cuerpoPlantilla } = await sembrarPlantilla(app, {
        tipoContratoId: tipo,
      });
      await crear(app, '/plantilla-tipo-contratos', cuerpoPlantilla);

      const res = await http()
        .get(`/plantilla-tipo-contratos/tipo-contrato/${tipo}`)
        .expect(200);
      expect(res.body.Data).toHaveLength(2);
    });

    // HALLAZGO: el $match solo filtra por tipo_contrato_id (y el query); no
    // exige version_actual=true y el service toma raw[0]. Con dos versiones del
    // mismo tipo se sirve la primera creada (la antigua), no la vigente.
    it('HALLAZGO: con dos versiones del mismo tipo sirve la más antigua, no la vigente', async () => {
      const tipo = nuevoTipo();
      const vieja = await sembrarPlantilla(app, { tipoContratoId: tipo });
      await crear(app, '/plantilla-tipo-contratos', vieja.cuerpoPlantilla);
      const nueva = await sembrarPlantilla(app, { tipoContratoId: tipo });
      await crear(app, '/plantilla-tipo-contratos', nueva.cuerpoPlantilla);

      const res = await http()
        .get(`/plantilla-tipo-contratos/tipo-contrato/${tipo}`)
        .expect(200);

      expect(res.body.Data.map((c: any) => c._id)).toEqual(
        vieja.clausulas.map((c) => c._id),
      );
    });

    it('responde 404 si los filtros no coinciden (aplica_poliza distinto)', async () => {
      const tipo = nuevoTipo();
      const { cuerpoPlantilla } = await sembrarPlantilla(app, {
        tipoContratoId: tipo,
        aplicaPoliza: true,
      });
      await crear(app, '/plantilla-tipo-contratos', cuerpoPlantilla);

      const res = await http()
        .get(`/plantilla-tipo-contratos/tipo-contrato/${tipo}`)
        .query({ query: 'aplica_poliza:false' })
        .expect(404);
      expect(res.body.Success).toBe(false);
    });

    it('responde 404 para un tipo de contrato sin plantilla', async () => {
      const res = await http()
        .get('/plantilla-tipo-contratos/tipo-contrato/999999')
        .expect(404);
      expect(res.body.Status).toBe(404);
    });
  });

  it('PUT /:id devuelve la plantilla actualizada', async () => {
    const { cuerpoPlantilla } = await sembrarPlantilla(app, {
      tipoContratoId: nuevoTipo(),
      reversionSaldo: false,
    });
    const creada = await crear(
      app,
      '/plantilla-tipo-contratos',
      cuerpoPlantilla,
    );

    const res = await http()
      .put(`/plantilla-tipo-contratos/${creada._id}`)
      .send({ ...cuerpoPlantilla, reversion_saldo: true, actualizado_por: 2 })
      .expect(200);

    expect(res.body.Data.reversion_saldo).toBe(true);
    expect(res.body.Data.actualizado_por).toBe(2);
  });

  it('DELETE /:id es lógico (activo=false)', async () => {
    const { cuerpoPlantilla } = await sembrarPlantilla(app, {
      tipoContratoId: nuevoTipo(),
    });
    const creada = await crear(
      app,
      '/plantilla-tipo-contratos',
      cuerpoPlantilla,
    );

    await http().delete(`/plantilla-tipo-contratos/${creada._id}`).expect(200);

    const lista = await http()
      .get('/plantilla-tipo-contratos')
      .query({ query: `tipo_contrato_id:${creada.tipo_contrato_id}` })
      .expect(200);
    expect(lista.body.Data[0].activo).toBe(false);
  });

  it('PUT y DELETE de una plantilla inexistente responden 400 y 404', async () => {
    const { cuerpoPlantilla } = await sembrarPlantilla(app, {
      tipoContratoId: nuevoTipo(),
    });

    await http()
      .put(`/plantilla-tipo-contratos/${ID_INEXISTENTE}`)
      .send(cuerpoPlantilla)
      .expect(400);
    await http()
      .delete(`/plantilla-tipo-contratos/${ID_INEXISTENTE}`)
      .expect(404);
  });
});
