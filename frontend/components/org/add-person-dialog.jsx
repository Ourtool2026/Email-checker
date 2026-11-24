"use client";

import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { offices, orgPeople, orgTeams } from "@/lib/data/org";
import { logAudit, refresh } from "@/lib/store";

export function AddPersonDialog({ open: t, onClose }) {
  let [e, r] = useState({
    kind: "person",
    name: "",
    title: "",
    team: "eng",
    parent: "cto",
    loc: "mirpur",
  });
  return t ? (
    <Dialog
      open
      onClose={onClose}
      title="Add to the organization"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!e.title.trim() || (e.kind === "person" && !e.name.trim())}
            onClick={() => {
              orgPeople.push({
                id: "n" + Date.now(),
                name: e.kind === "role" ? "Open role" : e.name,
                title: e.title,
                team: e.team,
                parent: e.parent,
                loc: e.loc,
                status: e.kind === "role" ? null : "online",
                joined: "Nov 2026",
                open: e.kind === "role",
              });
              logAudit(e.kind === "role" ? "Opened role" : "Added person", e.title, "\u2014");
              onClose();
              refresh();
              toast(
                e.kind === "role"
                  ? "Role added to the chart"
                  : "Added. Invite them from Admin team for HQ access.",
              );
            }}
          >
            <LuPlus />
            Add
          </Button>
        </>
      }
    >
      <Tabs
        value={e.kind}
        onChange={(i) =>
          r({
            ...e,
            kind: i,
          })
        }
        items={[
          {
            value: "person",
            label: "New person",
          },
          {
            value: "role",
            label: "Open role",
          },
        ]}
      />
      {e.kind === "person" && (
        <Field label="Name">
          <Input
            value={e.name}
            onChange={(i) =>
              r({
                ...e,
                name: i.target.value,
              })
            }
          />
        </Field>
      )}
      <Field label="Title">
        <Input
          value={e.title}
          onChange={(i) =>
            r({
              ...e,
              title: i.target.value,
            })
          }
          placeholder="e.g. Safety reviewer"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Team">
          <Select
            value={e.team}
            onChange={(i) =>
              r({
                ...e,
                team: i.target.value,
              })
            }
          >
            {Object.entries(orgTeams)
              .filter(([i]) => i !== "exec")
              .map(([i, [o]]) => (
                <option value={i} key={i}>
                  {o}
                </option>
              ))}
          </Select>
        </Field>
        <Field label="Reports to">
          <Select
            value={e.parent}
            onChange={(i) =>
              r({
                ...e,
                parent: i.target.value,
              })
            }
          >
            {orgPeople
              .filter((i) => !i.open)
              .map((i) => (
                <option value={i.id} key={i.id}>
                  {i.name}
                </option>
              ))}
          </Select>
        </Field>
        <Field label="Where">
          <Select
            value={e.loc}
            onChange={(i) =>
              r({
                ...e,
                loc: i.target.value,
              })
            }
          >
            {Object.entries(offices).map(([i, [o]]) => (
              <option value={i} key={i}>
                {o}
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </Dialog>
  ) : null;
}
