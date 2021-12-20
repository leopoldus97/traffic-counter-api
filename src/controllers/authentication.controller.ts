import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionDocument } from 'src/data/session.schema';
import { AuthGuard } from 'src/guards/auth.guard';
import {
    AuthenticationError,
    AuthenticationService,
} from 'src/services/authentication.service';

@Controller('authentication')
export class AuthenticationController {
    private readonly log: Logger = new Logger(AuthenticationController.name);

    public constructor(
        private readonly authenticationService: AuthenticationService,
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    public getAuthenticationInfo() {
        return {};
    }

    @Post()
    public async authenticate(
        @Body() { username, password }: { username: string; password: string },
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            if (!username || !password || username.length < 1 || password.length < 1) {
                return res.status(400).send();
            }

            try {
                const session = await this.authenticationService.authenticate(username, password, req.ip);
                return res.status(200).send({
                    sessionToken: session.token,
                    sessionExpiryDate: new Date(
                        session.startDate.getTime() + session.lifetime,
                    ),
                });
            } catch (error) {
                if (error instanceof AuthenticationError) {
                    return res.status(409).send({ error: error.message });
                }
                throw error;
            }
        } catch (error) {
            this.log.error(error);
            return res.status(500).send();
        }
    }

    @UseGuards(AuthGuard)
    @Delete()
    public async deauthenticate(@Req() req: Request, @Res() res: Response) {
        try {
            const session = req.session as SessionDocument;
            session.expiryDate = new Date(); // Invalidate session by setting expiry date
            session.save();
            return res.status(200).send({});
        } catch (error) {
            this.log.error(error);
            return res.status(500).send();
        }
    }
}
