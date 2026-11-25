"use client"

import { useState } from "react"
import {
  CalendarIcon,
  LayoutGridIcon,
  LinkIcon,
  ListIcon,
  MessageSquareIcon,
  PlusIcon,
} from "lucide-react"
import { SearchInput } from "@/components/shared/search-input"
import { NewTaskDialog } from "@/components/teams/new-task-dialog"
import {
  formatDue,
  isDueSoon,
  isOverdue,
  personPhoto,
  stageDots,
  taskPriorityTones,
} from "@/components/teams/shared"
import { TaskDrawer } from "@/components/teams/task-drawer"
import { Avatar } from "@/components/hq/avatar"
import { Badge } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { Progress } from "@/components/hq/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { Tabs } from "@/components/hq/tabs"
import { Tooltip } from "@/components/hq/tooltip"
import { currentAdmin } from "@/lib/data/core"
import { taskStages, tasks, teamMembers } from "@/lib/data/teams"
import { refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export function TeamBoard({ team, nav }: { team?: any; nav?: any }) {
  const [e, r] = useState("board")
  const [i, o] = useState("all")
  const [n, l] = useState("")
  const [d, u] = useState(null)
  const [s, m] = useState(false)
  const [f, h] = useState(null)
  const B = team
    ? teamMembers[team].map((x) => x[0])
    : [...new Set(tasks.map((x) => x.who))]
  const y = tasks.filter(
    (x) =>
      (!team || x.team === team) &&
      (i === "all" || x.who === i) &&
      (!n ||
        (x.title + x.id + x.labels.join(" "))
          .toLowerCase()
          .includes(n.toLowerCase()))
  )
  const W = d && tasks.find((x) => x.id === d)
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput
          value={n}
          onChange={l}
          placeholder="Find a task or label"
          className="w-full sm:w-64"
        />
        <div className="flex items-center -space-x-1.5 pl-1">
          {B.map((x) => (
            <Tooltip label={x} key={x}>
              <button
                onClick={() => o(i === x ? "all" : x)}
                className={cn(
                  "rounded-full ring-2 ring-background transition",
                  i === x
                    ? "z-10 scale-110 ring-primary"
                    : i !== "all" && "opacity-40"
                )}
              >
                <Avatar name={x} photo={personPhoto(x)} size={30} />
              </button>
            </Tooltip>
          ))}
        </div>
        <div className="ml-2 flex gap-3 text-[12.5px] text-muted-foreground">
          <span>
            <b className="font-semibold text-destructive">
              {y.filter(isOverdue).length}
            </b>
            {" overdue"}
          </span>
          <span>
            <b className="font-semibold text-warning">
              {y.filter(isDueSoon).length}
            </b>
            {" due in 2 days"}
          </span>
          <span>
            <b className="font-semibold text-foreground">
              {y.filter((x) => x.status === "Done").length}
            </b>
            /{y.length}
            {" done"}
          </span>
        </div>
        <div className="ml-auto flex gap-2">
          <Tabs
            size="sm"
            value={e}
            onChange={r}
            items={[
              {
                value: "board",
                label: "Board",
                icon: LayoutGridIcon,
              },
              {
                value: "list",
                label: "List",
                icon: ListIcon,
              },
            ]}
          />
          <Button size="sm" onClick={() => m(true)}>
            <PlusIcon />
            New task
          </Button>
        </div>
      </div>
      {e === "board" ? (
        <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {taskStages.map((x) => {
            const k = y.filter((N) => N.status === x)
            return (
              <section
                onDragOver={(N) => N.preventDefault()}
                onDrop={() => {
                  if (f) {
                    const N = tasks.find((q) => q.id === f)
                    N.status = x
                    N.log.unshift([
                      currentAdmin.name,
                      `moved to ${x}`,
                      "Just now",
                    ])
                    h(null)
                    refresh()
                  }
                }}
                className="flex w-[272px] shrink-0 flex-col gap-1.5 rounded-3xl border border-surface-border bg-surface p-1.5"
                key={x}
              >
                <header className="flex items-center gap-2 px-3 pt-2 pb-1">
                  <span className={cn("size-2 rounded-full", stageDots[x])} />
                  <h3 className="flex-1 text-[13.5px] font-semibold">{x}</h3>
                  <span className="rounded-md border bg-card px-1.5 text-[12px] tabular-nums">
                    {k.length}
                  </span>
                  <button
                    aria-label={`Add to ${x}`}
                    onClick={() => m(x)}
                    className="rounded-md p-0.5 text-muted-foreground hover:bg-card"
                  >
                    <PlusIcon className="size-4" />
                  </button>
                </header>
                {k.map((N) => {
                  const q = N.sub.filter((_) => _[1]).length
                  return (
                    <article
                      draggable
                      onDragStart={() => h(N.id)}
                      onClick={() => u(N.id)}
                      className="grid cursor-pointer gap-2 rounded-2xl border bg-card p-3 shadow-card hover:border-ring/40"
                      key={N.id}
                    >
                      <div className="flex flex-wrap gap-1">
                        {N.labels.map((_) => (
                          <span
                            className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                            key={_}
                          >
                            {_}
                          </span>
                        ))}
                      </div>
                      <span
                        className={cn(
                          "text-[13.5px] leading-snug font-medium",
                          N.status === "Done" &&
                            "text-muted-foreground line-through"
                        )}
                      >
                        {N.title}
                      </span>
                      {N.sub.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(q / N.sub.length) * 100}
                            tone={q === N.sub.length ? "success" : "primary"}
                            className="flex-1"
                          />
                          <span className="text-[11.5px] text-muted-foreground tabular-nums">
                            {q}/{N.sub.length}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[12px]">
                        <Badge tone={taskPriorityTones[N.pri]} dot={false}>
                          {N.pri}
                        </Badge>
                        <span
                          className={cn(
                            "flex items-center gap-1",
                            isOverdue(N)
                              ? "font-semibold text-destructive"
                              : isDueSoon(N)
                                ? "font-medium text-warning"
                                : "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="size-3.5" />
                          {formatDue(N.due)}
                        </span>
                        <span className="ml-auto flex items-center gap-2 text-muted-foreground">
                          {N.comments > 0 && (
                            <span className="flex items-center gap-0.5">
                              <MessageSquareIcon className="size-3.5" />
                              {N.comments}
                            </span>
                          )}
                          {N.link && <LinkIcon className="size-3.5" />}
                        </span>
                        <Avatar
                          name={N.who}
                          photo={personPhoto(N.who)}
                          size={22}
                        />
                      </div>
                    </article>
                  )
                })}
                {!k.length && (
                  <div className="rounded-2xl border border-dashed px-3 py-6 text-center text-[12.5px] text-muted-foreground">
                    Drop tasks here
                  </div>
                )}
              </section>
            )
          })}
        </div>
      ) : (
        <Card flush>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {y.map((x) => {
                const k = x.sub.filter((N) => N[1]).length
                return (
                  <TableRow onClick={() => u(x.id)} key={x.id}>
                    <TableCell>
                      <div className="grid leading-tight">
                        <span className="font-medium">{x.title}</span>
                        <span className="font-mono text-[11.5px] text-muted-foreground">
                          {x.id}
                          {" \xB7 "}
                          {x.labels.join(", ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "size-2 rounded-full",
                            stageDots[x.status]
                          )}
                        />
                        {x.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge tone={taskPriorityTones[x.pri]} dot={false}>
                        {x.pri}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={x.who}
                          photo={personPhoto(x.who)}
                          size={22}
                        />
                        {x.who}
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        isOverdue(x) && "font-semibold text-destructive"
                      )}
                    >
                      {formatDue(x.due)}
                    </TableCell>
                    <TableCell>
                      {x.sub.length ? (
                        <div className="flex w-28 items-center gap-2">
                          <Progress value={(k / x.sub.length) * 100} />
                          <span className="text-[11.5px] text-muted-foreground">
                            {k}/{x.sub.length}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
      {W && <TaskDrawer t={W} onClose={() => u(null)} nav={nav} />}
      <NewTaskDialog
        open={!!s}
        stage={typeof s == "string" ? s : "To do"}
        team={team || "marketing"}
        onClose={() => m(false)}
      />
    </>
  )
}
