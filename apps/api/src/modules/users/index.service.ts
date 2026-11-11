import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto, UpdateUserDto, User } from './index.schema';
import { AuthService } from '../auth/index.service';
import { UsersRepository } from './index.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async create(email: string, password: string, name: string) {
    const existing = await this.findByEmail(email);
    if (existing) throw new ConflictException('Email already in use');

    const hash = await bcrypt.hash(password, 10);

    const data = await this.repository.create({
      email,
      passwordHash: hash,
      name,
    });

    return {
      message: 'User was created successfully',
      token: await this.authService.createToken({
        sub: data.id,
        email: data.email,
      }),
    };
  }

  async findById(id: string): Promise<User> {
    const data = await this.repository.findById(id);
    if (!data) throw new NotFoundException('User not found');
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      created_at: data.createdAt.toISOString(),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.repository.findByEmail(email);
    if (!data) return null;
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      created_at: data.createdAt.toISOString(),
    };
  }

  async delete(id: string, requesterId: string): Promise<void> {
    if (id !== requesterId)
      throw new ForbiddenException('You do not have permission to delete this user');

    try {
      await this.repository.delete(id);
    } catch (error) {
      throw new Error(`Failed to deactivate user: ${error.message}`);
    }
  }

  async update(
    id: string,
    requesterId: string,
    dto: UpdateUserDto,
  ): Promise<void> {
    if (id !== requesterId)
      throw new ForbiddenException('You do not have permission to update this user');

    try {
      await this.repository.update(id, dto);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async changePassword(
    id: string,
    requesterId: string,
    dto: ChangePasswordDto,
  ): Promise<void> {
    if (id !== requesterId)
      throw new ForbiddenException(
        'You do not have permission to change this user password',
      );

    const data = await this.repository.findById(id);

    if (!data)
      throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(
      dto.currentPassword,
      data.passwordHash,
    );
    if (!isMatch) throw new UnauthorizedException('Incorrect current password');

    const newHash = await bcrypt.hash(dto.newPassword, 10);

    try {
      await this.repository.update(id, { passwordHash: newHash });
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }
}
