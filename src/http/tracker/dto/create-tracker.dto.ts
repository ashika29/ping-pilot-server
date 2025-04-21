import { IsNotEmpty, IsUrl, IsObject } from 'class-validator';

export class CreateTrackerDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsObject()
  params: any;

  @IsObject()
  preference: any;
}
