import { INestApplication } from '@nestjs/common';
import request from 'supertest';

/** Sufijo único para no chocar entre pruebas ni entre corridas. */
export const unico = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/** contrato_id alto y aleatorio, lejos de los ids reales. */
export const nuevoContratoId = (): number =>
  9_000_000 + Math.floor(Math.random() * 900_000);

/** ObjectId válido que no existe en la BD. */
export const ID_INEXISTENTE = '64b000000000000000000000';

export const cuerpoTexto = (sobreescribir: Record<string, unknown> = {}) => ({
  nombre: `Texto ${unico()}`,
  descripcion: 'descripcion de prueba',
  predeterminado: false,
  creado_por: 1,
  actualizado_por: 1,
  ...sobreescribir,
});

/** POST y devuelve Data. Falla si no responde 201. */
export async function crear(
  app: INestApplication,
  ruta: string,
  cuerpo: Record<string, unknown>,
) {
  const res = await request(app.getHttpServer())
    .post(ruta)
    .send(cuerpo)
    .expect(201);
  return res.body.Data;
}

export const crearClausula = (
  app: INestApplication,
  sobreescribir: Record<string, unknown> = {},
) => crear(app, '/clausulas', cuerpoTexto(sobreescribir));

export const crearParagrafo = (
  app: INestApplication,
  sobreescribir: Record<string, unknown> = {},
) => crear(app, '/paragrafos', cuerpoTexto(sobreescribir));
