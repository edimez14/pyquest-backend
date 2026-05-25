import { Module } from '@nestjs/common';
import { IconosController } from './iconos.controller';
import { IconosService } from './iconos.service';
import { DatabaseModule } from '../../database/database.module';
import { PuntosModule } from '../puntos/puntos.module';

@Module({
    imports: [DatabaseModule, PuntosModule],
    controllers: [IconosController],
    providers: [IconosService],
})
export class IconosModule { }
