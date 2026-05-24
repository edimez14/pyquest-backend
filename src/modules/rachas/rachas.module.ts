import { Module } from '@nestjs/common';
import { RachasController } from './rachas.controller';
import { RachasService } from './rachas.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RachasController],
  providers: [RachasService],
  exports: [RachasService],
})
export class RachasModule {}
