import * as bcrypt from 'bcrypt';

export class PasswordService {
  private async generateSalt(): Promise<string> {
    return await bcrypt.genSalt(10);
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await this.generateSalt();
    return await bcrypt.hash(password, salt);
  }

  public async comparePassword(
    password: string,
    correctPassword: string,
  ): Promise<boolean> {
    return (await bcrypt.compare(password, correctPassword)) ? true : false;
  }
}
