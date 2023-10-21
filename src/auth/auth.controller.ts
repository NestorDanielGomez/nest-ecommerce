import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, GetRawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post("login")
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get("private")
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    //puedo mandar un arreglo tambien ["user", "email"]
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser("email") userEmail: string,
    @GetRawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders

  ) {
    return {
      ok: true,
      message: "Ruta privada",
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }

  @Get("private2")
  @SetMetadata("roles", ["admin", "super-user"])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }
}
