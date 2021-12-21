import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticationService } from 'src/services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

    private readonly log: Logger = new Logger(AuthGuard.name);

    public constructor(private readonly authenticationService: AuthenticationService) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest() as Request;
        const token = req.get('x-session-token');

        if(!token) {
            return false;
        }

        try {
            const session = await this.authenticationService.getSession(token);

            session.lastRequestDate = new Date();
            await session.save();

            req.session = session;
            return true;
        } catch (error) {
            this.log.error(error.message || error);
            return false;
        }
    }
}
