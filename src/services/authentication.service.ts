import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { Session, SessionDocument } from 'src/data/session.schema';
import { User, UserDocument } from 'src/data/user.schema';
import * as uuid from 'uuid';

export class AuthenticationError extends Error {
    public code: string;

    constructor(message: string, code?: string) {
        super(message);
        this.code = code || null;
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

@Injectable()
export class AuthenticationService {
    private readonly log: Logger = new Logger(AuthenticationService.name);

    constructor(
        @InjectModel(Session.name)
        private readonly sessionModel: Model<SessionDocument>,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) { }

    public async authenticate(
        username: string,
        password: string,
        ipAddress: string,
    ): Promise<SessionDocument> {
        let session: SessionDocument;
        try {
            const hashedPassword = crypto
                .createHash('sha256')
                .update(password, 'utf8')
                .digest('hex');
            const user = await this.userModel.findOne({
                username,
                password: hashedPassword,
                enabled: true,
            });
            if (!user) {
                throw new AuthenticationError('Provided credentials did not match any user','USER_NOT_FOUND');
            }
            user.lastLoginDate = new Date();
            await user.save();

            session = await new this.sessionModel({
                userId: user.id,
                token: uuid.v4(),
                lifetime: 7 * 24 * 3600 * 1000,
                initialIpAddress: ipAddress,
            });
            await session.save();
            this.log.log(`user ${user.username} authenticated successfully`);
            return session;
        } catch (error) {
            this.log.log(`authentication of user ${username} failed: ${error.message || error}`,);
            if (session) {
                await session.delete();
            }
            throw error;
        }
    }

    public async getSession(token: string): Promise<SessionDocument> {
        const session = await this.sessionModel.findOne({ token });
        if (!session) {
            throw new AuthenticationError('Session not found', 'SESSION_NOT_FOUND');
        }
        if (session.expiryDate || new Date().getTime() - session.lastRequestDate.getTime() > session.lifetime) {
            throw new AuthenticationError('Session has already expired','SESSION_EXPIRED');
        }
        return session;
    }
}
