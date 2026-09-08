import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocentesModule } from './docentes/docentes.module.js';
import { EspaciosModule } from './espacios/espacios.module.js';
import { FacultadesModule } from './facultades/facultades.module.js';
import { RecursosModule } from './recursos/recursos.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get('DB_PORT', '3306'), 10),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_DATABASE', 'eduspace_manager'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
      }),
    }),
    DocentesModule,
    EspaciosModule,
    FacultadesModule,
    RecursosModule,
  ],
})
export class AppModule {}
