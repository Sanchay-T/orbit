import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { IntegrationsPage } from "@/components/IntegrationsPage";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: connectors } = await supabase
    .from("connectors")
    .select("*")
    .eq("user_id", user.id);

  return <IntegrationsPage connectors={connectors ?? []} />;
}
