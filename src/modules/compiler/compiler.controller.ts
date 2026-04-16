import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CompilerService } from './compiler.service';
import { RunPythonDto } from './dto/run-python.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('compiler')
@UseGuards(JwtAuthGuard)
export class CompilerController {
  constructor(private readonly compilerService: CompilerService) {}

  @Post('python/execute')
  executePython(@Body() payload: RunPythonDto) {
    return this.compilerService.executePython(payload);
  }
}
