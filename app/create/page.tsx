import { requireAdmin } from "../../lib/requireAdmin";
import { getToday } from "../../utils/dates";
import { CreateDay } from "./create-day";

export default async function CreatePage() {
  await requireAdmin();

  return <CreateDay standardDate={getToday().toISOString()} />;
}
