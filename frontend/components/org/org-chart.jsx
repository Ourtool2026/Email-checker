"use client";

import {
  LuChevronDown,
  LuChevronUp,
  LuListChecks,
  LuMapPin,
  LuPhoneCall,
  LuUserPlus,
} from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import {
  childrenOf,
  descendantsOf,
  offices,
  orgPhoto,
  orgTeams,
  presence,
  workloadOf,
} from "@/lib/data/org";
import { cn } from "@/lib/utils";

function OrgNode({ o: t, sel, dim, hit, onPick, folded, toggle }) {
  let [l, d, u] = orgTeams[t.team];
  let s = childrenOf(t.id);
  let m = descendantsOf(t.id).filter((f) => !f.open).length;
  return t.open ? (
    <button
      onClick={() => onPick(t)}
      className={cn(
        "flex w-[196px] flex-col items-center gap-1.5 rounded-2xl border-2 border-dashed p-3 text-center transition hover:border-primary/50",
        dim && "opacity-25",
      )}
    >
      <span className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full">
        <LuUserPlus className="size-5" />
      </span>
      <span className="text-[13px] font-semibold">Hiring</span>
      <span className="text-muted-foreground text-[12px] leading-tight">{t.title}</span>
      <Badge tone={d} dot={false}>
        {l}
      </Badge>
    </button>
  ) : (
    <div className={cn("relative flex flex-col items-center transition", dim && "opacity-25")}>
      <button
        onClick={() => onPick(t)}
        className={cn(
          "bg-card relative w-[196px] overflow-hidden rounded-2xl border text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-float",
          sel && "ring-primary ring-2",
          hit && "ring-warning ring-2",
          t.parent === null && "w-[220px]",
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
                "ring-card absolute right-0 bottom-0 size-3 rounded-full ring-2",
                presence[t.status][1],
              )}
            />
          </span>
          <span className="grid min-w-0 flex-1 leading-tight">
            <span className="truncate text-[13.5px] font-semibold">{t.name}</span>
            <span className="text-muted-foreground truncate text-[12px]">{t.title}</span>
          </span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 border-t px-3 py-1.5 text-[11.5px]">
          <LuMapPin className="size-3" />
          <span className="flex-1 truncate">
            {offices[t.loc][0]}
            {t.city ? ` \xB7 ${t.city}` : ""}
          </span>
          {t.oncall && (
            <Tooltip label="On call this week">
              <LuPhoneCall className="text-primary size-3.5" />
            </Tooltip>
          )}
          {workloadOf(t.name).length > 0 && (
            <span className="flex items-center gap-0.5">
              <LuListChecks className="size-3" />
              {workloadOf(t.name).length}
            </span>
          )}
        </div>
      </button>
      {s.length > 0 && (
        <button
          onClick={toggle}
          className="bg-card text-muted-foreground hover:text-foreground relative z-10 -mt-2.5 flex h-5 items-center gap-0.5 rounded-full border px-1.5 text-[11px] font-semibold shadow-card"
        >
          {m || s.length}
          {folded ? <LuChevronDown className="size-3" /> : <LuChevronUp className="size-3" />}
        </button>
      )}
    </div>
  );
}

export function OrgBranch({ o, ...props }) {
  let e = childrenOf(o.id);
  let r = props.folded.includes(o.id);
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
          props.setFolded(r ? props.folded.filter((i) => i !== o.id) : [...props.folded, o.id])
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
  );
}
