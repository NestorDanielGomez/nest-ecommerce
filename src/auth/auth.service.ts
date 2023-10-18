import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
;

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

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    })
    if (!user)
      throw new UnauthorizedException("Credenciales no valida (email)")
    //compara la que viene del front con la que tengo en la base de datos.
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException("Credenciales no valida (constraseña)")
    return user
  }

  private handleDbErrors(error: any): never {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail)
    }

    throw new InternalServerErrorException(`chequear log servers`)
  }

}
