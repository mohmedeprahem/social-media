import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { CreateUserError } from '../errors/create-user-error';

@Catch(CreateUserError)
export class CreateUserExceptionFilter implements ExceptionFilter {
  catch(exception: CreateUserError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const isOTPSent = exception.isOTPSent;
    response.status(409).json({
      success: false,
      status: 409,
      message: 'User already existed',
      isOTPSent,
    });
  }
}
