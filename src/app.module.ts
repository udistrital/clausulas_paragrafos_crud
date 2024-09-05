import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { environment } from './config/configuration';
import { ClausulaModule } from './clausula/clausula.module';
import { ParagrafoModule } from './paragrafo/paragrafo.module';
import { OrdenParagrafoModule } from './orden_paragrafo/orden_paragrafo.module';
import { OrdenClausulaModule } from './orden_clausula/orden_clausula.module';
import { PlantillaTipoContratoModule } from './plantilla_tipo_contrato/plantilla_tipo_contrato.module';


@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${environment.USER}:${environment.PASS}@` + `${environment.HOST}:${environment.PORT}/${environment.DB}?authSource=${environment.AUTH_DB}`),
    ClausulaModule,
    ParagrafoModule,
    OrdenParagrafoModule,
    OrdenClausulaModule,
    PlantillaTipoContratoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }