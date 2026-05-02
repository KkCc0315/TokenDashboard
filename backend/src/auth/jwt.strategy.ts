import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { UserRole } from '../users/user-role.enum';

interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'replace_me'),
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
