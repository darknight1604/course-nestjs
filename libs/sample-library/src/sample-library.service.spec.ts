import { Test, TestingModule } from '@nestjs/testing';
import { SampleLibraryService } from './sample-library.service';

describe('SampleLibraryService', () => {
  let service: SampleLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SampleLibraryService],
    }).compile();

    service = module.get<SampleLibraryService>(SampleLibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
