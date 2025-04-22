import {
  IsNotEmpty,
  IsUrl,
  IsObject,
  IsEmail,
  IsNumber,
} from 'class-validator';
import { CreateTrackerDto } from 'src/http/tracker/dto/create-tracker.dto';

export class MonitorDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsObject()
  params?: CreateTrackerDto['params'];

  @IsObject()
  preference?: CreateTrackerDto['preference'];

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
