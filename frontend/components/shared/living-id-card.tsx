"use client"

import { GeneratedAvatar } from "@/components/hq/avatar"
import { shortOrg } from "@/lib/format"

export function LivingIdCard({ u, kind }: { u?: any; kind?: any }) {
  return (
    <div className="relative aspect-[1.58] w-full overflow-hidden rounded-xl border bg-gradient-to-br from-emerald-50 to-sky-50 p-3 dark:from-emerald-950/40 dark:to-sky-950/40">
      <div className="text-[10.5px] font-semibold tracking-wide text-emerald-800 uppercase dark:text-emerald-300">
        {kind === "student"
          ? "Student ID card"
          : kind === "landlord"
            ? "Holding tax receipt"
            : "National ID card \xB7 front"}
      </div>
      {kind === "landlord" ? (
        <div className="mt-3 grid gap-1.5">
          {[80, 95, 70, 88, 60].map((r, i) => (
            <span
              className="h-2 rounded bg-black/10 dark:bg-white/15"
              style={{
                width: r + "%",
              }}
              key={i}
            />
          ))}
          <span className="mt-2 size-10 rounded-full border-2 border-dashed border-emerald-700/40" />
        </div>
      ) : (
        <div className="mt-2 flex gap-3">
          <div className="w-[30%] overflow-hidden rounded-md border bg-white">
            <div className="aspect-[3/4]">
              {u.photo ? (
                <img
                  src={u.photo}
                  alt=""
                  className="size-full object-cover grayscale-[30%]"
                />
              ) : (
                <AvatarFill name={u.name} />
              )}
            </div>
          </div>
          <div className="grid flex-1 content-start gap-1.5 text-[11px] text-gray-800 dark:text-gray-200">
            <span>
              <span className="text-gray-500">Name</span>
              <br />
              <b className="font-semibold">{u.name}</b>
            </span>
            <span>
              <span className="text-gray-500">
                {kind === "student" ? "University" : "Date of birth"}
              </span>
              <br />
              {kind === "student"
                ? shortOrg(u.org)
                : "\u2022\u2022 \u2022\u2022\u2022 200\u2022"}
            </span>
            <span>
              <span className="text-gray-500">
                {kind === "student" ? "Valid to" : "ID no."}
              </span>
              <br />
              <span className="font-mono">
                {kind === "student"
                  ? "Dec 2027"
                  : "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022 " +
                    u.nidNo.slice(-3)}
              </span>
            </span>
          </div>
        </div>
      )}
      <span className="absolute right-2 bottom-1.5 text-[9.5px] text-gray-500">
        Sample for prototype
      </span>
    </div>
  )
}

const AvatarFill = ({ name: t }: { name?: any }) => (
  <div className={"size-full [&>svg]:size-full"}>
    <GeneratedAvatar name={t} size={120} />
  </div>
)
