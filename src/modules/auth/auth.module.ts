import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from './auth.service';
import { UserRepository } from '../../database/repositories/user.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../database/models/User.entity';
import { JWTService, MailModule, PasswordService } from 'src/utils';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [UserRepository, UserService, PasswordService, JWTService],
  exports: [SequelizeModule],
})
export class AuthModule {}
