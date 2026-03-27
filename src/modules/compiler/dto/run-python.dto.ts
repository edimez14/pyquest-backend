import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class RunPythonDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  code!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  stdin?: string;

  @IsOptional()
  @IsInt()
  @Min(500)
  timeoutMs?: number;
}
