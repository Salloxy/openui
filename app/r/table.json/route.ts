import { loadRegistryItem } from "shadcn/registry"

export const dynamic = "force-static"

export async function GET() {
  return Response.json(await loadRegistryItem("table"))
}
