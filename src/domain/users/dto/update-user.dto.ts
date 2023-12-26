import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 50, { message: 'name must be between 3 and 50 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;
}
