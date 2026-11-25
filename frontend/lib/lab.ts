import {
  BedDoubleIcon,
  ClipboardListIcon,
  FlagIcon,
  IdCardIcon,
  UserPlusIcon,
} from "lucide-react"
import { toast } from "@/components/hq/toast"
import {
  auditLog,
  campaigns,
  featureFlags,
  getHostel,
  listingReviews,
  notifications,
  reports,
  stays,
  users,
  verifications,
} from "@/lib/data/core"
import { freshness, rentals } from "@/lib/data/ops"

;(function () {
  if (typeof window === "undefined" || window.MS) return
  const t = "ms-lab-log"
  const a = {}
  const e = {}
  let r = null
  try {
    r = new BroadcastChannel("ms-lab")
  } catch {}
  function i() {
    try {
      return JSON.parse(localStorage.getItem(t)) || []
    } catch {
      return []
    }
  }
  function o(d?) {
    try {
      localStorage.setItem(t, JSON.stringify(d.slice(-500)))
    } catch {}
  }
  function n(d?, u?) {
    if (d && d.id && !a[d.id]) {
      a[d.id] = 1
      ;(e[d.type] || []).concat(e["*"] || []).forEach(function (s) {
        try {
          s(d.data || {}, d, !!u)
        } catch (m) {
          console.error("[lab]", d.type, m)
        }
      })
    }
  }
  const l = {
    app: null,
    ready: false,
    emit: function (d, u) {
      const s = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        type: d,
        data: u || {},
        from: l.app,
        at: Date.now(),
      }
      const m = i()
      m.push(s)
      o(m)
      try {
        if (r) {
          r.postMessage(s)
        }
      } catch {}
      try {
        if (window.parent !== window) {
          window.parent.postMessage(
            {
              msLab: s,
            },
            "*"
          )
        }
      } catch {}
      n(s, false)
      return s
    },
    on: function (d, u) {
      ;(e[d] = e[d] || []).push(u)
    },
    log: i,
    start: function (d) {
      l.app = d
      i().forEach(function (u) {
        n(u, true)
      })
      l.ready = true
    },
    reset: function () {
      o([])
      try {
        if (r) {
          r.postMessage({
            reset: 1,
          })
        }
      } catch {}
      location.reload()
    },
    has: function (d, u) {
      return i().some(function (s) {
        return s.type === d && (!u || u(s.data))
      })
    },
    last: function (d, u) {
      const s = i().filter(function (m) {
        return m.type === d && (!u || u(m.data))
      })
      return s[s.length - 1]
    },
  }
  if (r) {
    r.onmessage = function (d) {
      const u = d.data
      if (u && u.reset) {
        location.reload()
        return
      }
      if (l.ready) {
        n(u, false)
      }
    }
  }
  window.addEventListener("storage", function (d) {
    if (d.key === t) {
      if (!d.newValue || d.newValue === "[]") {
        location.reload()
        return
      }
      if (l.ready) {
        try {
          JSON.parse(d.newValue).forEach(function (u) {
            n(u, false)
          })
        } catch {}
      }
    }
  })
  window.MS = l
})()

const LAB_LIVING_ID = "482915"

const nowLabel = () =>
  "Today " +
  new Date()
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
    .toLowerCase()

function ensureLabUser(t?, a?) {
  let e = users.find((r) => r.id === "ulab")
  if (!e) {
    e = {
      ...users[0],
      id: "ulab",
      name: t || "Nusrat Jahan",
      lid: LAB_LIVING_ID,
      type: "student",
      org: a || "Daffodil International University",
      area: "Uttara",
      hostel: null,
      flat: false,
      level: 1,
      stays: 3,
      reports: 0,
      status: "pending",
      nid: false,
      face: false,
      student: true,
      guardian: true,
      joined: "Nov 2026",
      active: "Now",
      device: "Android",
      lab: true,
    }
    users.unshift(e)
  }
  return e
}

function findLabUser(t?, a?) {
  if (a === LAB_LIVING_ID) {
    return ensureLabUser(t)
  }
  let e = users.find((r) => r.name === t)
  if (!e) {
    e = {
      ...users[2],
      id: "ux" + a,
      name: t,
      lid: a,
      hostel: "h0",
    }
    users.push(e)
  }
  return e
}

const labAudit = (t?, a?, e?, r?) =>
  auditLog.unshift({
    id: "alab" + Math.random().toString(36).slice(2),
    when: nowLabel(),
    by: t,
    act: a,
    target: e,
    why: r,
  })

const labNotify = (t?, a?, e = "system") => {
  notifications.unshift({
    id: "nlab" + Math.random(),
    kind: e,
    who: "Test lab",
    text: t,
    when: a ? "Earlier" : "Just now",
    unread: !a,
  })
}

export function connectLab(t?) {
  const a = window.MS
  if (a) {
    a.on("id.submitted", (e, r, i) => {
      const o = ensureLabUser(e.name, e.org)
      o.status = "pending"
      o.nid = false
      o.face = false
      if (!verifications.some((n) => n.id === "v-" + r.id)) {
        verifications.unshift({
          id: "v-" + r.id,
          uid: o.id,
          kind: "nid",
          score: 94,
          when: i ? "Today" : "Just now",
          flags: [],
          note: "Sent from the test phone",
          lab: true,
        })
      }
      labNotify(`${e.name} sent her NID and selfie for a Living ID check.`, i)
      if (!i) {
        toast(
          `New Living ID check from ${e.name.split(" ")[0]} (test phone)`,
          IdCardIcon
        )
      }
      t()
    })
    a.on("seat.requested", (e, r, i) => {
      ensureLabUser(e.name, e.org)
      labAudit(
        "Test phone",
        "Sent seat request",
        "Uttara Scholars Hostel",
        `${e.name} \xB7 ${e.want}`
      )
      labNotify(`${e.name} asked Uttara Scholars Hostel for a seat.`, i)
      if (!i) {
        toast("Seat request sent to Uttara Scholars Hostel", UserPlusIcon)
      }
      t()
    })
    a.on("seat.updated", (e, r, i) => {
      const o = ensureLabUser()
      const n =
        e.status === "accepted"
          ? "Seat reserved"
          : e.status === "visit"
            ? "Visit booked"
            : "Declined"
      labAudit(
        "Rahela Akter (hostel)",
        e.status === "accepted"
          ? "Accepted seat request"
          : e.status === "visit"
            ? "Booked a visit"
            : "Declined seat request",
        o.name,
        e.seat ? `Seat ${e.seat}` : e.visit || "\u2014"
      )
      if (e.status === "accepted" && !stays.some((l) => l.id === "slab")) {
        stays.unshift({
          id: "slab",
          uid: o.id,
          hid: "h0",
          in: "1 Dec 2026",
          out: "",
          status: "Seat reserved",
          via: "Seat request",
        })
      }
      if (!i) {
        toast(
          `Uttara Scholars Hostel: ${n.toLowerCase()} for ${o.name.split(" ")[0]}`,
          BedDoubleIcon
        )
      }
      t()
    })
    a.on("stay.movein", (e, r, i) => {
      const o = ensureLabUser()
      o.hostel = "h0"
      const n = stays.find((l) => l.id === "slab")
      if (n) {
        n.status = "Living here"
        n.in = "23 Nov 2026"
        n.via = "Desk scan"
      } else {
        stays.unshift({
          id: "slab",
          uid: o.id,
          hid: "h0",
          in: "23 Nov 2026",
          out: "",
          status: "Living here",
          via: "Desk scan",
        })
      }
      labAudit(
        "Rahela Akter (hostel)",
        "Moved in by desk scan",
        o.name,
        `Seat ${e.seat}`
      )
      if (!i) {
        toast(
          `${o.name.split(" ")[0]} moved in to Uttara Scholars Hostel`,
          BedDoubleIcon
        )
      }
      t()
    })
    a.on("listing.submitted", (e, r, i) => {
      if (!listingReviews.some((o) => o.id === "l-" + r.id)) {
        listingReviews.unshift({
          id: "l-" + r.id,
          hid: "h0",
          kind: "Listing update",
          title: "Uttara Scholars Hostel",
          change: e.change,
          photo: getHostel("h0").photo,
          when: i ? "Today" : "Just now",
          checks: {
            photos: true,
            prices: true,
            rules: true,
            fire: true,
          },
          lab: true,
        })
        labNotify(
          "Uttara Scholars Hostel changed its listing. It is waiting in Listing review.",
          i
        )
        if (!i)
          toast("Listing change from Uttara Scholars Hostel", ClipboardListIcon)
        t()
      }
    })
    a.on("report.filed", (e, r, i) => {
      if (reports.some((n) => n.id === e.id)) {
        return
      }
      const o = findLabUser(e.who, e.lid)
      reports.unshift({
        id: e.id,
        uid: o.id,
        type: e.type,
        by: "h0",
        filed: "23 Nov",
        left: 14,
        status: "Waiting for reply",
        proof: e.proof,
        reply: "",
        lab: true,
      })
      labNotify(`Uttara Scholars Hostel filed a report about ${e.who}.`, i)
      if (!i) {
        toast(
          `New report from Uttara Scholars Hostel about ${e.who.split(" ")[0]}`,
          FlagIcon
        )
      }
      t()
    })
    a.on("flat.status", (e, r, i) => {
      const o =
        e.why ||
        (e.status === "rented"
          ? "Agreement active"
          : e.status === "reserved"
            ? "Accepted a tenant \xB7 waiting to sign"
            : e.status === "live"
              ? "Re-listed with a fresh date"
              : "Tenant gave notice")
      rentals.unshift({
        id: "rm-" + r.id,
        title: e.title || "Flat 5B, Kamrul Villa",
        area: "Dhanmondi",
        by: "Kamrul Hasan",
        why: o,
        status: e.status,
        when: i ? "Today" : "Just now",
      })
      if (e.status === "rented") {
        freshness.rentedWeek++
        freshness.live--
      }
      if (e.status === "reserved") {
        freshness.reserved++
        freshness.live--
      }
      if (e.status === "live") {
        freshness.live++
      }
      labAudit(
        "Kamrul Hasan (landlord)",
        e.status === "live" ? "Re-listed" : "Listing left search",
        e.title || "Flat 5B, Kamrul Villa",
        o
      )
      if (!i) {
        toast(
          e.status === "live"
            ? "Flat 5B is back in search as a new listing"
            : `Flat 5B left search: ${o}`,
          ClipboardListIcon
        )
      }
      t()
    })
    a.on("id.decided", (e, r, i) => {
      if (!i) {
        return
      }
      const o = verifications.find((l) => l.lab && !l.done)
      const n = users.find((l) => l.id === "ulab")
      if (o) {
        o.done = true
      }
      if (n && e.ok) {
        n.nid = true
        n.face = true
        n.status = "active"
      }
      t()
    })
    a.on("listing.decided", (e, r, i) => {
      if (!i) {
        return
      }
      const o = listingReviews.find((n) => n.id === e.id)
      if (o) {
        o.done = e.d
      }
      t()
    })
    a.on("hostel.status", (e, r, i) => {
      if (!i) {
        return
      }
      const o = getHostel(e.hid)
      if (o) {
        o.status = e.status
        o.pauseNote = e.note
      }
      t()
    })
    a.on("report.decided", (e, r, i) => {
      if (!i) {
        return
      }
      const o = reports.find((n) => n.id === e.id)
      if (o) {
        o.status = e.status
      }
      t()
    })
    a.on("app.flag", (e, r, i) => {
      if (!i) {
        return
      }
      const o = featureFlags.find((n) => n.key === e.key)
      if (o) {
        o[e.field] = e.value
      }
      t()
    })
    a.on("push.sent", (e, r, i) => {
      if (i && !campaigns.some((o) => o.id === e.id)) {
        campaigns.unshift({
          id: e.id,
          name: e.title,
          ch: e.ch,
          aud: e.aud,
          reach: e.reach,
          open: 0,
          status: "Sent",
          when: "Today",
        })
        t()
      }
    })
    a.start("hq")
  }
}
