import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { IconosService } from './iconos.service';
import { CreateIconoDto } from './dto/create-icono.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('iconos')
@UseGuards(JwtAuthGuard)
export class IconosController {
    constructor(private readonly iconosService: IconosService) { }

    // GET /iconos - Catalogo de todos los iconos (incluye costo)
    @Get()
    findAll() {
        return this.iconosService.findAll();
    }

    // POST /iconos - Crear icono en el catalogo (admin/seeding)
    @Post()
    create(@Body() dto: CreateIconoDto) {
        return this.iconosService.create(dto);
    }

    // GET /iconos/usuario - Iconos desbloqueados por el usuario autenticado
    @Get('usuario')
    getIconosUsuario(@Req() request: Request & { user?: { sub: number } }) {
        return this.iconosService.getIconosUsuario(request.user!.sub);
    }

    // POST /iconos/usuario/:idIcono - Desbloquear un icono gratuito (costo 0)
    @Post('usuario/:idIcono')
    unlockIcono(
        @Req() request: Request & { user?: { sub: number } },
        @Param('idIcono', ParseIntPipe) idIcono: number,
    ) {
        return this.iconosService.unlockIcono(request.user!.sub, idIcono);
    }

    // POST /iconos/comprar/:idIcono - Comprar un icono con puntos (costo > 0)
    @Post('comprar/:idIcono')
    comprarIcono(
        @Req() request: Request & { user?: { sub: number } },
        @Param('idIcono', ParseIntPipe) idIcono: number,
    ) {
        return this.iconosService.comprarIcono(request.user!.sub, idIcono);
    }

    // GET /iconos/activo - Icono activo del perfil del usuario
    @Get('activo')
    getIconoActivo(@Req() request: Request & { user?: { sub: number } }) {
        return this.iconosService.getIconoActivo(request.user!.sub);
    }

    // PATCH /iconos/activo - Establecer icono activo (solo si lo posee)
    @Patch('activo')
    setIconoActivo(
        @Req() request: Request & { user?: { sub: number } },
        @Body('idIcono', ParseIntPipe) idIcono: number,
    ) {
        return this.iconosService.setIconoActivo(request.user!.sub, idIcono);
    }
}
