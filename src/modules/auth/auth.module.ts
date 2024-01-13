import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from './auth.service';
import { UserRepository } from '../../repositories/user.repository';
import { PasswordService } from '../../shared/helpers/passwordService.helper';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../database/models/User.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), MailModule],
  controllers: [AuthController],
  providers: [UserRepository, UserService, PasswordService],
  exports: [SequelizeModule],
})
export class AuthModule {}
