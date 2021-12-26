import { Test, TestingModule } from '@nestjs/testing';
import { ApiAdminController } from './api-admin.controller';
import { ApiAdminService } from './api-admin.service';

describe('ApiAdminController', () => {
  let apiAdminController: ApiAdminController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApiAdminController],
      providers: [ApiAdminService],
    }).compile();

    apiAdminController = app.get<ApiAdminController>(ApiAdminController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(apiAdminController.getHello()).toBe('Hello World!');
    });
  });
});
