import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email must be a valid email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  @Length(6, 20, { message: 'password must be between 6 and 20 characters' })
  password: string;
}
