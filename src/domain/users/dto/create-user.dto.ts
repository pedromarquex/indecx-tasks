import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  @Length(3, 50, { message: 'name must be between 3 and 50 characters' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email must be a valid email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  @Length(6, 50, { message: 'password must be between 6 and 50 characters' })
  password: string;
}
