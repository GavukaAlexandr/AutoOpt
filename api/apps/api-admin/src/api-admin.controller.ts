import { Controller, Get } from '@nestjs/common';
import { ApiAdminService } from './api-admin.service';

@Controller()
export class ApiAdminController {
  constructor(private readonly apiAdminService: ApiAdminService) {}

  @Get()
  getHello(): string {
    return this.apiAdminService.getHello();
  }
}
