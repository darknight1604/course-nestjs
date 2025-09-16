import { Test, TestingModule } from '@nestjs/testing';
import { CachingDatabaseService } from './caching-database.service';

describe('CachingDatabaseService', () => {
  let service: CachingDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CachingDatabaseService],
    }).compile();

    service = module.get<CachingDatabaseService>(CachingDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
