import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User, UserRepository } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from './hash.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InsertResult } from 'typeorm';
import { randomUUID } from 'crypto';
import { isError } from '../utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: UserRepository,
    private hashService: HashService
  ) { }

  async create(user: User): Promise<InsertResult | InternalServerErrorException | BadRequestException> {
    try {
      if (!isError(await this.findUserById(user.id!))) {
        throw new Error("User id is already being used");
      }

      if (!isError(await this.findUserByUsername(user.username!))) {
        return new BadRequestException(`Username ${user.username} is already being used`);
      }

      if (!isError(await this.findUserByEmail(user.email!))) {
        return new BadRequestException(`Email ${user.email} is already registered`);
      }

      const result = await this.userRepository.insert({ ...user!, password: await this.hashService.hashPassword(user.password!) });
      return result;
    }
    catch (err) {
      return new InternalServerErrorException(err.message);
    }
  }

  async find(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserById(id: string): Promise<User | NotFoundException | InternalServerErrorException> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) return new NotFoundException("User not found");
      return user;
    }
    catch (err) {
      return new InternalServerErrorException(err.message);
    }
  }

  async findUserByUsername(username: string): Promise<User | NotFoundException | InternalServerErrorException> {
    try {
      const user = await this.userRepository.findOneBy({ username });
      if (!user) return new NotFoundException("User not found");
      return user;
    }
    catch (err) {
      return new InternalServerErrorException(err.message);
    }
  }

  async findUserByEmail(email: string): Promise<User | NotFoundException | InternalServerErrorException> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) return new NotFoundException("User not found");
      return user;
    }
    catch (err) {
      return new InternalServerErrorException(err.message);
    }
  }

  async findUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | NotFoundException | InternalServerErrorException> {
    try {
      const user = await this.userRepository.findOneBy([
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]);
      if (!user) return new NotFoundException("User not found");
      return user;
    }
    catch (err) {
      return new InternalServerErrorException(err.message);
    }
  }
}
