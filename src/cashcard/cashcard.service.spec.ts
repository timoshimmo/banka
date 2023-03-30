import { Test, TestingModule } from '@nestjs/testing';
import { CashCardService } from './cashcard.service';

describe('AnchorService', () => {
  let service: CashCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashCardService],
    }).compile();

    service = module.get<CashCardService>(CashCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});