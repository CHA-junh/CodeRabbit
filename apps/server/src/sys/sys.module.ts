import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblUserRole } from '../entities/tbl-user-role.entity';
import { TblUserRolePgmGrp } from '../entities/tbl-user-role-pgm-grp.entity';
import { TblMenuInf } from '../entities/tbl-menu-inf.entity';
import { SysController } from './sys.controller';
import { SysService } from './sys.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TblUserRole, TblUserRolePgmGrp, TblMenuInf]),
  ],
  controllers: [SysController],
  providers: [SysService],
})
export class SysModule {}
