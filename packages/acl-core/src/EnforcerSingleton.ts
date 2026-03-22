import * as path from "path";
import { fileURLToPath } from "url";

import { Enforcer, newEnforcer } from "casbin";

// Polyfill __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EnforcerSingleton {
  private static instance: Enforcer | null = null;

  /**
   * Returns a singleton instance of the Casbin Enforcer.
   * Loads the built-in model.conf and policy.csv files.
   */
  public static async getInstance(): Promise<Enforcer> {
    if (!EnforcerSingleton.instance) {
      // Resolve path relative to compiled dist folder
      const modelPath = path.resolve(__dirname, "model.conf");
      const policyPath = path.resolve(__dirname, "policy.csv");
      
      EnforcerSingleton.instance = await newEnforcer(modelPath, policyPath);
    }
    return EnforcerSingleton.instance;
  }
}
