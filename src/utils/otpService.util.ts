export class OtpService {
  public static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
