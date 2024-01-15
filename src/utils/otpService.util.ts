export class OtpService {
  public static generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
