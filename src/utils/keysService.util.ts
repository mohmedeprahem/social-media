import { join } from 'path';
const config = require(join(__dirname, '../../dist/config/database.config.js'));

export class KeysService {
  public static getDatabaseKeys(env: string): object {
    return config[env] || config.development;
  }
}
