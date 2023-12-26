import { Status } from '@/infra/database/schemas/task.schema';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
