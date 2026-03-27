import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':idUsuario')
  findOne(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.usersService.findOne(idUsuario);
  }
}
