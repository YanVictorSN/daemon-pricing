import { SupabaseClient } from "@supabase/supabase-js";
import { Context } from "@ubiquity-os/ubiquity-os-kernel";
import { Database } from "../../types/database";
import { Super } from "./super";

type AccessRow = Database["public"]["Tables"]["access"]["Row"];

export class Access extends Super {
  constructor(supabase: SupabaseClient, context: Context) {
    super(supabase, context);
  }

  public async getAccess(userId: number, repositoryId: number): Promise<AccessRow | null> {
    const { data, error } = await this.supabase
      .from("access")
      .select("*")
      .filter("user_id", "eq", userId)
      .filter("repository_id", "eq", repositoryId)
      .limit(1)
      .maybeSingle();

    if (error) {
      this.context.logger.error(error.message, error);
      throw new Error(error.message);
    }
    return data;
  }

  public async setAccess(userId: number, repositoryId: number, labels: string[]): Promise<AccessRow | null> {
    if (!labels.length) {
      return this.clearAccess(userId, repositoryId);
    }
    const { data, error } = await this.supabase
      .from("access")
      .upsert({
        user_id: userId,
        repository_id: repositoryId,
        labels: labels,
      })
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  public async clearAccess(userId: number, repositoryId: number): Promise<null> {
    const { data, error } = await this.supabase.from("access").delete().filter("user_id", "eq", userId).filter("repository_id", "eq", repositoryId);
    if (error) throw new Error(error.message);
    return data;
  }
}
