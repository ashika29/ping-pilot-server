import { Expose, Type } from 'class-transformer';
import { UserResponseTransformer } from 'src/common/transformers/user-response.transformer';

export class LoginResponseTransformer {
  @Expose()
  message: string;

  @Expose()
  @Type(() => UserResponseTransformer)
  user: UserResponseTransformer;
}
