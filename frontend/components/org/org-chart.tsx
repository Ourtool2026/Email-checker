"use client"

import {
  ChevronDownIcon,
  ChevronUpIcon,
  ListChecksIcon,
  MapPinIcon,
  PhoneCallIcon,
  UserPlusIcon,
} from "lucide-react"
import { Avatar } from "@/components/hq/avatar"
import { Badge } from "@/components/hq/badge"
import { Tooltip } from "@/components/hq/tooltip"
import {
  childrenOf,
  descendantsOf,
  offices,
  orgPhoto,
  orgTeams,
  presence,
  workloadOf,
} from "@/lib/data/org"
import { cn } from "@/lib/utils"

function OrgNode({
  o: t,
  sel,
  dim,
  hit,
  onPick,
  folded,
  toggle,
}: {
  o?: any
  sel?: any
  dim?: any
  hit?: any
  onPick?: any
  folded?: any
  toggle?: any
}) {
  const [l, d, u] = orgTeams[t.team]
  const s = childrenOf(t.id)
  const m = descendantsOf(t.id).filter((f) => !f.open).length
  return t.open ? (
    <button
      onClick={() => onPick(t)}
      className={cn(
        "flex w-[196px] flex-col items-center gap-1.5 rounded-2xl border-2 border-dashed p-3 text-center transition hover:border-primary/50",
        dim && "opacity-25"
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <UserPlusIcon className="size-5" />
      </span>
      <span className="text-[13px] font-semibold">Hiring</span>
      <span className="text-[12px] leading-tight text-muted-foreground">
        {t.title}
      </span>
      <Badge tone={d} dot={false}>
        {l}
      </Badge>
    </button>
  ) : (
    <div
      className={cn(
        "relative flex flex-col items-center transition",
        dim && "opacity-25"
      )}
    >
      <button
        onClick={() => onPick(t)}
        className={cn(
          "relative w-[196px] overflow-hidden rounded-2xl border bg-card text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-float",
          sel && "ring-2 ring-primary",
          hit && "ring-2 ring-warning",
          t.parent === null && "w-[220px]"
        )}
      >
        <span
          className="absolute inset-x-0 top-0 h-1"
          style={{
            background: `var(--${d === "danger" ? "destructive" : d})`,
          }}
        />
        <div className="flex items-center gap-2.5 p-3 pt-3.5">
          <span className="relative">
            <Avatar name={t.name} photo={orgPhoto(t.name)} size={40} />
            <span
              className={cn(
                "absolute right-0 bottom-0 size-3 rounded-full ring-2 ring-card",
                presence[t.status][1]
              )}
            />
          </span>
          <span className="grid min-w-0 flex-1 leading-tight">
            <span className="truncate text-[13.5px] font-semibold">
              {t.name}
            </span>
            <span className="truncate text-[12px] text-muted-foreground">
              {t.title}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 border-t px-3 py-1.5 text-[11.5px] text-muted-foreground">
          <MapPinIcon className="size-3" />
          <span className="flex-1 truncate">
            {offices[t.loc][0]}
            {t.city ? ` \xB7 ${t.city}` : ""}
          </span>
          {t.oncall && (
            <Tooltip label="On call this week">
              <PhoneCallIcon className="size-3.5 text-primary" />
            </Tooltip>
          )}
          {workloadOf(t.name).length > 0 && (
            <span className="flex items-center gap-0.5">
              <ListChecksIcon className="size-3" />
              {workloadOf(t.name).length}
            </span>
          )}
        </div>
      </button>
      {s.length > 0 && (
        <button
          onClick={toggle}
          className="relative z-10 -mt-2.5 flex h-5 items-center gap-0.5 rounded-full border bg-card px-1.5 text-[11px] font-semibold text-muted-foreground shadow-card hover:text-foreground"
        >
          {m || s.length}
          {folded ? (
            <ChevronDownIcon className="size-3" />
          ) : (
            <ChevronUpIcon className="size-3" />
          )}
        </button>
      )}
    </div>
  )
}

export function OrgBranch({ o, ...props }: { o?: any; [key: string]: any }) {
  const e = childrenOf(o.id)
  const r = props.folded.includes(o.id)
  return (
    <li>
      <OrgNode
        o={o}
        sel={props.sel === o.id}
        dim={props.dimmed(o)}
        hit={props.hits(o)}
        onPick={props.onPick}
        folded={r}
        toggle={() =>
          props.setFolded(
            r ? props.folded.filter((i) => i !== o.id) : [...props.folded, o.id]
          )
        }
      />
      {e.length > 0 &&
        !r &&
        (e.every((i) => !childrenOf(i.id).length) ? (
          <div className="org-stack">
            {e.map((i) => (
              <OrgNode
                o={i}
                sel={props.sel === i.id}
                dim={props.dimmed(i)}
                hit={props.hits(i)}
                onPick={props.onPick}
                key={i.id}
              />
            ))}
          </div>
        ) : (
          <ul>
            {e.map((i) => (
              <OrgBranch o={i} {...props} key={i.id} />
            ))}
          </ul>
        ))}
    </li>
  )
}
