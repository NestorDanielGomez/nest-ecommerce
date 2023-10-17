import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>) { }


  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto
      const user = this.userRepository.create(createUserDto)
      await this.userRepository.save({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })
      delete user.password
      return user
    } catch (error) {
      this.handleDbErrors(error)
    }

  }

  private handleDbErrors(error: any): never {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail)
    }

    throw new InternalServerErrorException(`chequear log servers`)
  }

}
