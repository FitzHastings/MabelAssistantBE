import { Test, TestingModule } from '@nestjs/testing';
import { StopwatchService } from 'src/stopwatch/stopwatch.service';


describe('StopwatchService', () => {
    let service: StopwatchService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StopwatchService]
        }).compile();

        service = module.get<StopwatchService>(StopwatchService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
