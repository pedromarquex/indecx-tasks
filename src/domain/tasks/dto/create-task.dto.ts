import { Status } from '@/infra/database/schemas/task.schema';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
