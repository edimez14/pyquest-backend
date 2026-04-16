import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserParamsDto } from './dto/find-user-params.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':idUsuario')
  findOne(@Param() params: FindUserParamsDto) {
    return this.usersService.findOne(params.idUsuario);
  }
}
