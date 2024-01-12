import { join } from "path";
const config = require(join(__dirname, '../../database/config'));

export class Utils{
  public static getDatabaseKeys(env : string): object{
    return config[env] || config.development;
  }
}
