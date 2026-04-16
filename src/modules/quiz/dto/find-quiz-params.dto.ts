import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class FindQuizParamsDto {
  @Type(() => Number)
  @IsInt({ message: 'El idQuiz debe ser un número entero' })
  @Min(1, { message: 'El idQuiz debe ser mayor o igual a 1' })
  idQuiz!: number;
}
