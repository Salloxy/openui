import { loadRegistry } from "shadcn/registry"

export const dynamic = "force-static"

export async function GET() {
  return Response.json(await loadRegistry())
}
