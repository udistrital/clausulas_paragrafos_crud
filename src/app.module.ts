import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { ClausulaModule } from './clausula/clausula.module';
import { ParagrafoModule } from './paragrafo/paragrafo.module';
import { OrdenParagrafoModule } from './orden_paragrafo/orden_paragrafo.module';
import { OrdenClausulaModule } from './orden_clausula/orden_clausula.module';
import { PlantillaTipoContratoModule } from './plantilla_tipo_contrato/plantilla_tipo_contrato.module';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService : ConfigService) => ({
        uri: `mongodb://${configService.get('DB_HOST')}:${configService.get('DB_PORT')}/${configService.get('DB_NAME')}`
      }),
      inject: [ConfigService]
    }),
    ClausulaModule,
    ParagrafoModule,
    OrdenClausulaModule,
    OrdenParagrafoModule,
    PlantillaTipoContratoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }