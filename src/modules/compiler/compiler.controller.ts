import { Body, Controller, Post } from '@nestjs/common';
import { CompilerService } from './compiler.service';
import { RunPythonDto } from './dto/run-python.dto';

@Controller('compiler')
export class CompilerController {
  constructor(private readonly compilerService: CompilerService) {}

  @Post('python/execute')
  executePython(@Body() payload: RunPythonDto) {
    return this.compilerService.executePython(payload);
  }
}
