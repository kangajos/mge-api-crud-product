import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) { }

  async create(username: string, password: string) {
    const isUserExist = await this.findByUsername(username);
    if (isUserExist) {
      throw new BadRequestException('Username already exist');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async getAllUsers() {
    return this.userRepository.find({ select: ['id', 'username'] });
  }

  async validateUser(username: string, password: string) {
    const user = await this.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.jwtService.sign({ username }, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
  }

  async getUserById(id: string): Promise<User> {
    const userId = parseInt(id);
    const user = await this.userRepository.findOne({ where: { id: userId }, select: ['id', 'username'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateData: any): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { username, password } = updateData
    if (password) {
      user.password = await bcrypt.hash(password, 10)
    }
    user.username = username
    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}
