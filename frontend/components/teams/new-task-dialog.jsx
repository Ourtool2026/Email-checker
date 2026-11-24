"use client";

import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { taskPriorityTones } from "@/components/teams/shared";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { currentAdmin } from "@/lib/data/core";
import { tasks, teamMembers } from "@/lib/data/teams";
import { refresh } from "@/lib/store";

export function NewTaskDialog({ open: t, stage, team, onClose }) {
  let [i, o] = useState({
    title: "",
    who: teamMembers[team][0][0],
    pri: "Medium",
    due: "2026-11-28",
    labels: "",
  });
  return t ? (
    <Dialog
      open
      onClose={onClose}
      title="New task"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!i.title.trim()}
            onClick={() => {
              let n = team === "tech" ? "ENG" : team === "finance" ? "FIN" : "MKT";
              tasks.unshift({
                team: team,
                id: `${n}-${200 + tasks.length}`,
                title: i.title,
                status: stage,
                pri: i.pri,
                who: i.who,
                due: i.due,
                labels: i.labels
                  .split(",")
                  .map((l) => l.trim())
                  .filter(Boolean),
                sub: [],
                comments: 0,
                link: null,
                desc: "",
                log: [[currentAdmin.name, "created the task", "Just now"]],
              });
              onClose();
              refresh();
              toast("Task created");
            }}
          >
            <LuPlus />
            Create
          </Button>
        </>
      }
    >
      <Field label="Title">
        <Input
          value={i.title}
          onChange={(n) =>
            o({
              ...i,
              title: n.target.value,
            })
          }
          placeholder="What needs doing"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Owner">
          <Select
            value={i.who}
            onChange={(n) =>
              o({
                ...i,
                who: n.target.value,
              })
            }
          >
            {teamMembers[team].map((n) => (
              <option key={n[0]}>{n[0]}</option>
            ))}
          </Select>
        </Field>
        <Field label="Priority">
          <Select
            value={i.pri}
            onChange={(n) =>
              o({
                ...i,
                pri: n.target.value,
              })
            }
          >
            {Object.keys(taskPriorityTones).map((n) => (
              <option key={n}>{n}</option>
            ))}
          </Select>
        </Field>
        <Field label="Due">
          <Input
            type="date"
            value={i.due}
            onChange={(n) =>
              o({
                ...i,
                due: n.target.value,
              })
            }
          />
        </Field>
      </div>
      <Field label="Labels" hint="Comma separated">
        <Input
          value={i.labels}
          onChange={(n) =>
            o({
              ...i,
              labels: n.target.value,
            })
          }
          placeholder="e.g. Content, DIU"
        />
      </Field>
    </Dialog>
  ) : null;
}
