import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./current-user.decorator";
import type { AuthenticatedUser } from "./authenticated-user.interface";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post("login")
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post("refresh")
  @UseGuards(JwtAuthGuard)
  refreshToken(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.refreshToken(user.id, user.email);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getAuthenticatedUser(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getAuthenticatedUser(user.id);
  }
}
