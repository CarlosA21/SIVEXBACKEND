import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/users.service'; // Asegúrate de que la ruta sea correcta
import { User } from 'src/users/entities/user.entity'; // Asegúrate de que la ruta sea correcta
import { UserPayload } from './interfaces/userPayload'; // Asegúrate de que la ruta sea correcta
import { LoginDto } from './dto/login.dto'; // Asegúrate de que la ruta sea correcta
import { SessionService } from '../sessions/session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) { }

  async login(loginDto: LoginDto, ipAddress: string): Promise<{ access_token: string }> {

    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    //crear sesion

    const session =await this.sessionService.create({
      ipAddress,
    }, user.id);


    const token = this.generateToken(user, session.id);

    return { access_token: token };
  }

  async logout(authHeader: string): Promise<{ message: string }> {

    // Extraer token del header Authorization: Bearer <token>
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) throw new UnauthorizedException('Token missing');

    // Decodificar/validar token y extraer sid
    const decoded = this.verifyToken(token) as UserPayload & { sid: number };

    if (!decoded?.sid) throw new UnauthorizedException('Invalid token (sid missing)');

    // Cerrar sesión por sid
    await this.sessionService.closeBySid(decoded.sid);
    return { message: 'Logout successful' };
  }

  generateToken(user: User, sid: number): string {
    const payload: UserPayload = {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      sid,
    };

    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): UserPayload {
    return this.jwtService.verify(token);
  }
}
