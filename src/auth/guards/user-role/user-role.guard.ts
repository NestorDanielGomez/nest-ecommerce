import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get("roles", context.getHandler())

    if (!validRoles) return true //estoy validando en otro lugar

    const req = context.switchToHttp().getRequest()
    const user = req.user as User

    if (!user) throw new BadRequestException("usuario no encontrado")

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true
      }
    }
    throw new ForbiddenException(`El usuario ${user.fullName} necesita un rol valido: [${validRoles}]`)
  }
}
