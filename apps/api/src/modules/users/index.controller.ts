import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Request,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './index.service';
import type {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
} from './index.schema';
import { CurrentUser, SkipAuth } from '../auth/index.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SkipAuth()
  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body.email, body.password, body.name);
  }

  @Get('me')
  async getMe(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @SkipAuth()
  @Get('get-by-email/:email')
  async findByEmail(@Param('email') email: string) {
    // Rota pública usada no passo de e-mail do login: expõe só o necessário para a tela
    const user = await this.usersService.findByEmail(email);
    return user ? { email: user.email, name: user.name } : null;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.usersService.delete(id, user.sub);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.usersService.update(id, user.sub, dto);
  }

  @Patch(':id/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.usersService.changePassword(id, user.sub, dto);
  }
}
