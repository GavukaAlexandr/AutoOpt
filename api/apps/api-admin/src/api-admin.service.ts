import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiAdminService {
  getHello(): string {
    return 'Hello World!';
  }
}
