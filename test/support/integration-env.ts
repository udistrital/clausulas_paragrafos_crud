// Se ejecuta antes de cargar AppModule (jest "setupFiles").
// Aísla las pruebas en una base propia para no tocar datos de desarrollo.
// ConfigModule no sobrescribe variables ya definidas en process.env, así que
// este valor tiene prioridad sobre el .env.
const nombreBd = process.env.INTEGRATION_DB_NAME ?? 'clausulas_integration';

if (!/(test|integration)/i.test(nombreBd)) {
  throw new Error(
    `Por seguridad la BD de integración debe contener "test" o "integration" ` +
      `(recibido: "${nombreBd}"). Las pruebas la eliminan al terminar.`,
  );
}

process.env.CLAUSUAS_PARAGRAFOS_DB_NAME = nombreBd;
