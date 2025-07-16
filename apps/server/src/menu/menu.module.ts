import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MenuController],
  // providers: [MenuService], // MenuService 제거
})
export class MenuModule {}
