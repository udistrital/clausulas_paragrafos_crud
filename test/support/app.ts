import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from '../../src/app.module';

/**
 * Levanta la aplicación completa (AppModule + MongoDB real), igual que
 * src/main.ts: sin ValidationPipe global.
 */
export async function crearApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  // logger apagado: las pruebas de hallazgos provocan 500 a propósito y el
  // stack de cada uno ensucia la salida.
  const app = moduleFixture.createNestApplication({ logger: false });
  await app.init();
  return app;
}

/** Elimina la BD de integración. Se niega si el nombre no parece de pruebas. */
export async function limpiarBd(app: INestApplication): Promise<void> {
  const conexion = app.get<Connection>(getConnectionToken());
  const nombre = conexion.db.databaseName;
  if (!/(test|integration)/i.test(nombre)) {
    throw new Error(`No se elimina la BD "${nombre}": no parece de pruebas.`);
  }
  await conexion.dropDatabase();
}
