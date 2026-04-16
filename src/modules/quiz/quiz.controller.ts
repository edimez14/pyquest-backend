import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { FindQuizQueryDto } from './dto/find-quiz-query.dto';
import { FindQuizParamsDto } from './dto/find-quiz-params.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ResponderQuizDto } from './dto/responder-quiz.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('quiz')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  findAll(@Query() query: FindQuizQueryDto) {
    return this.quizService.findAll(query);
  }

  @Get(':idQuiz')
  findOne(@Param() params: FindQuizParamsDto) {
    return this.quizService.findOne(params.idQuiz);
  }

  @Post()
  create(@Body() dto: CreateQuizDto) {
    return this.quizService.create(dto);
  }

  @Post(':idQuiz/responder')
  responder(@Param() params: FindQuizParamsDto, @Body() dto: ResponderQuizDto) {
    return this.quizService.responder(params.idQuiz, dto);
  }

  @Patch(':idQuiz')
  update(@Param() params: FindQuizParamsDto, @Body() dto: UpdateQuizDto) {
    return this.quizService.update(params.idQuiz, dto);
  }

  @Delete(':idQuiz')
  remove(@Param() params: FindQuizParamsDto) {
    return this.quizService.remove(params.idQuiz);
  }
}
