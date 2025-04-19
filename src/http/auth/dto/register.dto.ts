import { IsEmail, IsString, MinLength } from 'class-validator';
import { Match } from '../../../common/decorators/match.decorator';
export class RegisterDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @Match('password', { message: 'Password confirmation does not match' })
  password_confirm: string;
}
