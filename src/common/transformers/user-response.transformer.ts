// dto/user-response.dto.ts
import { Expose } from 'class-transformer';

export class UserResponseTransformer {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
