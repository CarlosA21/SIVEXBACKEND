
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SessionService } from 'src/sessions/session.service';
import { UserPayload } from './interfaces/userPayload';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly sessionsService: SessionService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET ||
        'sJd+3X8KvV5W98L3aB7j1sd2!kL4qL9mB1p5Xx0q7zQ_!',
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: UserPayload & {sid: number}) {
    // Verificar que la sesión (sid) siga activa (endTime = null)
    const active = await this.sessionsService.findActiveBySid(payload.sid);
    if (!active) {
      throw new UnauthorizedException('Session is closed or expired');
    }


    // Lo que retornes aquí será req.user
    return payload;
  }
}