import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommonModule } from './common/common.module';
import { EnvConfiguration } from './common/config/env.config';
import { PokemonModule } from './pokemon/pokemon.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {}
