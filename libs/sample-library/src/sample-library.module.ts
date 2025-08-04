import { Module } from '@nestjs/common';
import { SampleLibraryService } from './sample-library.service';

@Module({
  providers: [SampleLibraryService],
  exports: [SampleLibraryService],
})
export class SampleLibraryModule {}
