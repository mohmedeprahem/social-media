import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../../database/repositories/user.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../database/models/User.entity';
import { JWTService, MailModule, PasswordService } from 'src/utils';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    UserRepository,
    AuthService,
    PasswordService,
    JWTService,
    AtStrategy,
    RtStrategy,
  ],
  exports: [SequelizeModule],
})
export class AuthModule {}
