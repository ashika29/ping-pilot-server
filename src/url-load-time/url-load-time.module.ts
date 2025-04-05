import { Module } from '@nestjs/common';
import { UrlLoadTimeService } from './url-load-time.service';
import { UrlLoadTimeController } from './url-load-time.controller';

@Module({
  controllers: [UrlLoadTimeController],
  providers: [UrlLoadTimeService],
})
export class UrlLoadTimeModule {}
