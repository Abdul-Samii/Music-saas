import {
  Controller,
  Get,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private guard(secret: string | undefined) {
    const expected = process.env.ADMIN_SECRET ?? 'escalium-admin-secret';
    if (secret !== expected) throw new UnauthorizedException('Invalid admin secret');
  }

  @Get('stats')
  async stats(@Headers('x-admin-secret') secret: string) {
    this.guard(secret);
    return this.adminService.getStats();
  }

  @Get('users')
  async users(@Headers('x-admin-secret') secret: string) {
    this.guard(secret);
    return this.adminService.getUsers();
  }

}
