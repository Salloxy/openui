import type { OpenUITableColumn } from "@/components/openui/table"

export type DemoUser = {
  id: string
  user: string
  email: string
  role: string
  team: string
  status: "Active" | "Paused" | "Pending"
  lastSeen: string
  score: number
}

const firstNames = [
  "Ari",
  "Maya",
  "Noah",
  "Leah",
  "Eli",
  "Nina",
  "Sam",
  "Iris",
  "Theo",
  "Zoe",
]

const lastNames = [
  "Cohen",
  "Reed",
  "Stone",
  "Levin",
  "Hart",
  "Brooks",
  "Shaw",
  "Lane",
  "Wells",
  "Fox",
]

const roles = ["Designer", "Engineer", "Manager", "Analyst", "Researcher"]
const teams = ["Support", "Product", "Data", "Growth", "Platform"]
const statuses: DemoUser["status"][] = ["Active", "Paused", "Pending"]

export const demoUsers: DemoUser[] = Array.from({ length: 600 }, (_, index) => {
  const row = index + 1
  const firstName = firstNames[index % firstNames.length]
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length]
  const slug = `${firstName}.${lastName}${row}`.toLowerCase()

  return {
    id: `#${String(row).padStart(3, "0")}`,
    user: `${firstName} ${lastName}`,
    email: `${slug}@example.com`,
    role: roles[row % roles.length],
    team: teams[row % teams.length],
    status: statuses[index % statuses.length],
    lastSeen: `2026-05-${String((index % 28) + 1).padStart(2, "0")}`,
    score: 52 + ((row * 7) % 49),
  }
})

export const demoColumns: OpenUITableColumn<DemoUser>[] = [
  {
    key: "id",
    label: "ID",
    type: "shortText",
    width: 96,
  },
  {
    key: "user",
    label: "User",
    type: "longText",
    render: (row) => (
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{row.user}</span>
        <span className="truncate text-muted-foreground">{row.email}</span>
      </span>
    ),
  },
  {
    key: "role",
    label: "Role",
    type: "shortText",
  },
  {
    key: "team",
    label: "Team",
    type: "shortText",
  },
  {
    key: "status",
    label: "Status",
    type: "status",
    render: (row) => (
      <span className="text-xs font-semibold uppercase tracking-wider">
        {row.status}
      </span>
    ),
  },
  {
    key: "lastSeen",
    label: "Last seen",
    type: "date",
  },
  {
    key: "score",
    label: "Score",
    type: "number",
    align: "right",
  },
]
