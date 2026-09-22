import { Controller, Post, Body, Req, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';// Asegúrate de que la ruta sea correcta

import { LoginDto } from './dto/login.dto'; // Asegúrate de que la ruta sea correcta
import { JwtAuthGuard } from './jwt_auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Req() req, @Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto, req.ip);
  }


  // Logout protegido: requiere token válido
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Headers('authorization') authorization:string){
    return this.authService.logout(authorization)

  }

  @Post('verify')
  verify(@Body('token') token: string): any {
    const decoded = this.authService.verifyToken(token);
    return { valid: true, decoded };
  }
}