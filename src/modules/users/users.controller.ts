import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserParamsDto } from './dto/find-user-params.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':idUsuario')
  findOne(@Param() params: FindUserParamsDto) {
    return this.usersService.findOne(params.idUsuario);
  }
}
