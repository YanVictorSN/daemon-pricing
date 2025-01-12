import { SupabaseClient } from "@supabase/supabase-js";
import { Context } from "@ubiquity-os/ubiquity-os-kernel";

import { Database } from "../../types/database";
import { Super } from "./super";

type LabelRow = Database["public"]["Tables"]["labels"]["Row"];

export class Label extends Super {
  constructor(supabase: SupabaseClient, context: Context) {
    super(supabase, context);
  }

  async saveLabelChange({
    previousLabel,
    currentLabel,
    authorized,
    userId,
    repositoryId,
  }: {
    previousLabel: string;
    currentLabel: string;
    authorized: boolean;
    userId: number;
    repositoryId: number;
  }): Promise<LabelRow> {
    const { data, error } = await this.supabase
      .from("labels")
      .insert({
        label_from: previousLabel,
        label_to: currentLabel,
        authorized: authorized,
        user_id: userId,
        repository_id: repositoryId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getLabelChanges(repositoryNodeId: string) {
    const { data, error } = await this.supabase.from("labels").select("*").eq("repository_id", repositoryNodeId).eq("authorized", false);

    if (error) throw new Error(error.message);
    return data;
  }

  async approveLabelChange(id: number): Promise<null> {
    const { data, error } = await this.supabase.from("labels").update({ authorized: true }).eq("id", id);

    if (error) throw new Error(error.message);
    return data;
  }
}
