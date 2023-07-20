import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User, UserRepository } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from './hash.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: UserRepository,
    private hashService: HashService
  ) { }

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
