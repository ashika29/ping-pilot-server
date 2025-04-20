import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('trackers')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get()
  async getUserTrackers(@CurrentUser() user: any) {
    return await this.trackerService.findAllByUser(user.id);
  }

  @Post()
  async createTracker(@CurrentUser() user: any, @Body() dto: CreateTrackerDto) {
    return await this.trackerService.create(user, dto);
  }

  @Delete(':id')
  async deleteTracker(@Param('id', ParseIntPipe) id: number) {
    return await this.trackerService.delete(id);
  }
}
