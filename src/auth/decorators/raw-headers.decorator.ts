import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetRawHeaders = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest()
        const user = req.rawHeaders

    }
)