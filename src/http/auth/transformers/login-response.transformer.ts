import { Expose, Type } from 'class-transformer';
import { UserResponseTransformer } from 'src/common/transformers/user-response.transformer';

export class LoginResponseTransformer {
  @Expose()
  message: string;

  @Expose()
  token: string;

  @Expose()
  refreshToken: string;

  @Expose()
  @Type(() => UserResponseTransformer)
  user: UserResponseTransformer;
}
