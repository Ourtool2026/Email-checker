import { photos } from "@/lib/photos";

let seedC = 4242;

const randC = () => (seedC = (seedC * 1103515245 + 12345) % 2147483648) / 2147483648;

export const TODAY = "2026-11-23";

export const teamMembers = {
  marketing: [
    ["Farah Kabir", "Growth lead", null],
    ["Tanzila Rahman", "Content", null],
    ["Shuvo Ahmed", "Design", null],
    ["Mehjabin Ara", "Campus partnerships", null],
  ],
  finance: [
    ["Ayesha Siddika", "Finance lead", photos["p-sk"]],
    ["Mahmud Hasan", "Accountant", photos["p-kh"]],
  ],
  tech: [
    ["Arif Hossain", "Engineering lead", null],
    ["Nabil Rahman", "Backend", null],
    ["Sadia Noor", "Mobile", null],
    ["Tareq Aziz", "Infra & SRE", null],
  ],
};

export const allMembers = Object.values(teamMembers).flat();

export const memberPhoto = (t) => (allMembers.find((a) => a[0] === t) || [])[2] || null;

const task = (t, a, e, r, i, o, n, l, d, u, s, m) => ({
  team: t,
  id: a,
  title: e,
  status: r,
  pri: i,
  who: o,
  due: n,
  labels: l,
  sub: d,
  comments: u,
  link: s,
  desc: m || "",
  log: [],
});

export const tasks = [
  task(
    "marketing",
    "MKT-142",
    "DIU orientation week booth plan",
    "In progress",
    "High",
    "Mehjabin Ara",
    "2026-11-26",
    ["Event", "DIU"],
    [
      ["Book booth with DIU student affairs", true],
      ["Print 200 QR standees", true],
      ["Ambassador rota for 3 days", false],
      ["Giveaway: 500 stickers", false],
    ],
    6,
    null,
    "Booth at the DIU permanent campus during orientation. Goal: 600 sign-ups, 70% verified within 48 hours.",
  ),
  task(
    "marketing",
    "MKT-141",
    'Reel: "How to get a Living ID in 2 minutes"',
    "Review",
    "High",
    "Tanzila Rahman",
    "2026-11-24",
    ["Content", "Reel"],
    [
      ["Script", true],
      ["Shoot", true],
      ["Edit and captions (EN + BN)", true],
      ["Approve with legal", false],
    ],
    4,
  ),
  task(
    "marketing",
    "MKT-139",
    "Landlord campaign: Uttara and Mirpur",
    "To do",
    "Medium",
    "Farah Kabir",
    "2026-11-30",
    ["Campaign", "Landlords"],
    [
      ["Audience in Campaigns & push", false],
      ["Leaflets for 40 buildings", false],
    ],
    2,
  ),
  task(
    "marketing",
    "MKT-137",
    "Refresh app store screenshots",
    "In progress",
    "Medium",
    "Shuvo Ahmed",
    "2026-11-22",
    ["Design", "App store"],
    [
      ["Android 6 screens", true],
      ["iOS 6 screens", false],
      ["Bangla versions", false],
    ],
    3,
  ),
  task(
    "marketing",
    "MKT-135",
    "Ambassador payout list for November",
    "To do",
    "High",
    "Mehjabin Ara",
    "2026-12-01",
    ["Ambassadors", "Finance"],
    [
      ["Export referrals", false],
      ["Send to Finance", false],
    ],
    1,
    {
      k: "team",
      id: "finance",
      label: "Finance approval",
    },
  ),
  task(
    "marketing",
    "MKT-133",
    "NSU partnership one-pager",
    "Backlog",
    "Low",
    "Farah Kabir",
    "2026-12-10",
    ["Partners"],
    [],
    0,
  ),
  task(
    "marketing",
    "MKT-130",
    "Facebook ads: Uttara girls hostels",
    "Done",
    "Medium",
    "Farah Kabir",
    "2026-11-18",
    ["Ads"],
    [
      ["Creatives", true],
      ["Launch", true],
    ],
    5,
  ),
  task(
    "marketing",
    "MKT-128",
    'Blog: "5 checks before you rent in Dhaka"',
    "Backlog",
    "Low",
    "Tanzila Rahman",
    "2026-12-05",
    ["Content", "SEO"],
    [],
    0,
  ),
  task(
    "finance",
    "FIN-061",
    "November close",
    "In progress",
    "High",
    "Ayesha Siddika",
    "2026-12-03",
    ["Close"],
    [
      ["Bank and bKash reconciliation", true],
      ["Accruals: NID checks, SMS", false],
      ["Ambassador payouts", false],
      ["Board pack", false],
    ],
    3,
  ),
  task(
    "finance",
    "FIN-060",
    "Chase 3 failed plan payments",
    "To do",
    "High",
    "Mahmud Hasan",
    "2026-11-25",
    ["Collections"],
    [
      ["Bashundhara Campus Home", false],
      ["Mirpur 10 Youth Hostel", false],
      ["North Gate Mess", false],
    ],
    2,
    {
      k: "page",
      id: "plans",
      label: "Plans & billing",
    },
  ),
  task(
    "finance",
    "FIN-058",
    "Renegotiate NID check price (over budget 32%)",
    "In progress",
    "High",
    "Ayesha Siddika",
    "2026-11-28",
    ["Vendors", "Cost"],
    [
      ["Usage report from Porichoy", true],
      ["Ask for tier at 50k checks", false],
    ],
    4,
  ),
  task(
    "finance",
    "FIN-055",
    "VAT return for October",
    "Done",
    "Medium",
    "Mahmud Hasan",
    "2026-11-15",
    ["Tax"],
    [["Mushak 9.1", true]],
    1,
  ),
  task(
    "finance",
    "FIN-054",
    "Budget 2027 draft",
    "Backlog",
    "Medium",
    "Ayesha Siddika",
    "2026-12-20",
    ["Planning"],
    [],
    0,
  ),
  task(
    "tech",
    "ENG-412",
    "Crash in meal toggle on Android 2.4.1",
    "In progress",
    "Urgent",
    "Sadia Noor",
    "2026-11-23",
    ["Bug", "Android", "Crash"],
    [
      ["Reproduce", true],
      ["Fix null state", true],
      ["Hotfix 2.4.2 to 10%", false],
    ],
    7,
    {
      k: "page",
      id: "support",
      label: "3 support tickets",
    },
  ),
  task(
    "tech",
    "ENG-410",
    "Add index seats(hostel_id, status)",
    "Review",
    "High",
    "Nabil Rahman",
    "2026-11-24",
    ["Database", "Performance"],
    [
      ["Create concurrently on replica first", true],
      ["Check plan", true],
    ],
    3,
    null,
    "Slow query on the hostel page: 410 ms average, 2.1k calls a day.",
  ),
  task(
    "tech",
    "ENG-408",
    "Listing card cache: refill lock (stop thundering herd)",
    "In progress",
    "High",
    "Nabil Rahman",
    "2026-11-27",
    ["Scale", "Cache"],
    [
      ["Redis lock per key", true],
      ["Serve old copy while refilling", false],
      ["Load test 2k req/s", false],
    ],
    5,
  ),
  task(
    "tech",
    "ENG-405",
    "Move hostel search to Meilisearch",
    "To do",
    "High",
    "Arif Hossain",
    "2026-12-08",
    ["Scale", "Search"],
    [
      ["Index listing cards", false],
      ["Geo filter by area", false],
      ["Shadow traffic 10%", false],
    ],
    2,
  ),
  task(
    "tech",
    "ENG-401",
    "NID provider: retry with backoff + fallback queue",
    "Review",
    "Medium",
    "Tareq Aziz",
    "2026-11-25",
    ["Reliability"],
    [
      ["Backoff", true],
      ["Alert at 2 min wait", true],
    ],
    2,
    {
      k: "page",
      id: "status",
      label: "INC-31",
    },
  ),
  task(
    "tech",
    "ENG-399",
    "Camera permission crash on iOS scan",
    "To do",
    "Medium",
    "Sadia Noor",
    "2026-11-29",
    ["Bug", "iOS"],
    [],
    1,
  ),
  task(
    "tech",
    "ENG-396",
    "Rate limits per endpoint at the gateway",
    "Backlog",
    "Medium",
    "Tareq Aziz",
    "2026-12-12",
    ["Scale", "Security"],
    [],
    0,
  ),
  task(
    "tech",
    "ENG-390",
    "Batch view counters in Redis",
    "Done",
    "Medium",
    "Nabil Rahman",
    "2026-11-19",
    ["Scale"],
    [["Ship", true]],
    2,
  ),
];

export const taskStages = ["Backlog", "To do", "In progress", "Review", "Done"];

export const contentCalendar = [
  [2, "Facebook", "Seat open in Uttara: 3 verified hostels", "Published"],
  [4, "Instagram", "Carousel: what a Living ID shows", "Published"],
  [6, "TikTok", "Day in a girls hostel", "Published"],
  [9, "YouTube", "How guardians get updates", "Published"],
  [11, "Facebook", "DIU partnership news", "Published"],
  [13, "Instagram", "Reel: hostel food tour", "Published"],
  [16, "Facebook", "Landlords: verified tenants only", "Published"],
  [18, "TikTok", "Late return? Ask in app", "Published"],
  [20, "Instagram", "Story: meal vote results", "Published"],
  [24, "Instagram", "Reel: Living ID in 2 minutes", "Scheduled"],
  [24, "Facebook", "Orientation week booth", "Scheduled"],
  [26, "TikTok", "Booth day live", "Scheduled"],
  [27, "LinkedIn", "Hiring: backend engineer", "Draft"],
  [28, "Facebook", "Stay Level 2 rewards", "Draft"],
  [30, "Instagram", "November recap", "Idea"],
].map(([t, a, e, r], i) => ({
  id: "po" + i,
  d: t,
  ch: a,
  t: e,
  st: r,
  who: ["Tanzila Rahman", "Shuvo Ahmed", "Farah Kabir"][i % 3],
}));

export const channelSpend = [
  ["Ambassadors", 38000 /* 38e3 */, null, 1240, 1150],
  ["Facebook ads", 120000 /* 12e4 */, 18400, 1310, 1080],
  ["Campus events", 45000 /* 45e3 */, null, 920, 860],
  ["Instagram", 60000 /* 6e4 */, 9100, 610, 500],
  ["TikTok", 25000 /* 25e3 */, 12000 /* 12e3 */, 410, 290],
  ["Google search", 30000 /* 3e4 */, 4100, 380, 300],
];

export const ambassadors = [
  ["Mehedi Hasan", "DIU", 214, 198, "Gold"],
  ["Nusrat Jahan", "DIU", 176, 161, "Gold"],
  ["Rafsan Haque", "NSU", 142, 120, "Silver"],
  ["Lamia Chowdhury", "Uttara University", 118, 109, "Silver"],
  ["Arif Rahman", "IUBAT", 97, 88, "Bronze"],
  ["Sumaiya Rahman", "BUBT", 71, 60, "Bronze"],
  ["Tamim Rahman", "EWU", 44, 37, "Bronze"],
];

export const okrs = [
  {
    o: "Become the default way students find a safe place in Uttara",
    krs: [
      ["Verified users in Uttara", 4120, 6000 /* 6e3 */],
      ["Hostels live in Uttara", 60, 80],
      ["Seat requests per week", 410, 600],
    ],
  },
  {
    o: "Make landlords trust verified tenants",
    krs: [
      ["Landlords verified", 412, 800],
      ["Flats rented to students", 214, 400],
    ],
  },
];

export const monthlyFinance = [
  ["Jun", 62000 /* 62e3 */, 14000 /* 14e3 */, 2000 /* 2e3 */, 1500],
  ["Jul", 81000 /* 81e3 */, 21000 /* 21e3 */, 3000 /* 3e3 */, 5000 /* 5e3 */],
  ["Aug", 104000 /* 104e3 */, 25500, 4000 /* 4e3 */, 6500],
  ["Sep", 128000 /* 128e3 */, 27000 /* 27e3 */, 5000 /* 5e3 */, 8000 /* 8e3 */],
  ["Oct", 151000 /* 151e3 */, 26500, 6000 /* 6e3 */, 9500],
  ["Nov", 172500, 25000 /* 25e3 */, 7500, 11000 /* 11e3 */],
].map(([t, a, e, r, i]) => ({
  m: t,
  v: a,
  n: e,
  e: r,
  c: i,
}));

export const budgetLines = [
  ["Salaries", 520000 /* 52e4 */, 550000 /* 55e4 */],
  ["Marketing", 318000 /* 318e3 */, 350000 /* 35e4 */],
  ["NID checks", 132000 /* 132e3 */, 100000 /* 1e5 */],
  ["Cloud & servers", 96000 /* 96e3 */, 110000 /* 11e4 */],
  ["SMS", 64000 /* 64e3 */, 70000 /* 7e4 */],
  ["Office & rent", 45000 /* 45e3 */, 50000 /* 5e4 */],
  ["Legal & compliance", 30000 /* 3e4 */, 40000 /* 4e4 */],
];

export const spendRequests = [
  {
    id: "SR-118",
    who: "Farah Kabir",
    what: "DIU orientation booth and giveaways",
    cat: "Marketing",
    amt: 60000 /* 6e4 */,
    steps: [
      ["Team lead", "done"],
      ["Finance", "wait"],
      ["CEO", "todo"],
    ],
    when: "Today",
  },
  {
    id: "SR-117",
    who: "Tareq Aziz",
    what: "Second database read replica (monthly)",
    cat: "Cloud & servers",
    amt: 18500,
    steps: [
      ["Team lead", "done"],
      ["Finance", "wait"],
      ["CEO", "skip"],
    ],
    when: "Yesterday",
  },
  {
    id: "SR-116",
    who: "Mitu Akter",
    what: "Background-check service, 3-month trial",
    cat: "Legal & compliance",
    amt: 25000 /* 25e3 */,
    steps: [
      ["Team lead", "done"],
      ["Finance", "wait"],
      ["CEO", "todo"],
    ],
    when: "2 days ago",
  },
  {
    id: "SR-112",
    who: "Imran Chowdhury",
    what: "200 QR standees for hostel receptions",
    cat: "Marketing",
    amt: 14000 /* 14e3 */,
    steps: [
      ["Team lead", "done"],
      ["Finance", "done"],
      ["CEO", "skip"],
    ],
    when: "18 Nov",
    done: "Approved",
  },
];

export const expenses = [
  ["23 Nov", "AWS (cloud)", "Cloud & servers", 31840, "Card", true],
  ["22 Nov", "Porichoy NID checks", "NID checks", 44100, "Bank", true],
  ["21 Nov", "SSL Wireless SMS", "SMS", 21300, "Bank", true],
  ["20 Nov", "Meta ads", "Marketing", 40000 /* 4e4 */, "Card", true],
  ["19 Nov", "Printing: QR standees", "Marketing", 14000 /* 14e3 */, "bKash", false],
  ["18 Nov", "Office rent Mirpur", "Office & rent", 45000 /* 45e3 */, "Bank", true],
  ["15 Nov", "Law firm retainer", "Legal & compliance", 30000 /* 3e4 */, "Bank", true],
];

export const receivablesAging = [
  ["Not due", 96000 /* 96e3 */, 52],
  ["1\u201330 days", 18000 /* 18e3 */, 6],
  ["31\u201360 days", 7500, 3],
  ["60+ days", 3500, 1],
];

export const unitCosts = [
  ["Cost per verified sign-up", 62, 71, "\u09F3"],
  ["Cost per NID check", 8.2, 8.2, "\u09F3"],
  ["Cloud cost per active user / month", 3.1, 3.6, "\u09F3"],
  ["SMS cost per active user / month", 2.1, 2.3, "\u09F3"],
  ["Revenue per paying hostel / month", 1983, 1902, "\u09F3"],
];

const techToday = Date.UTC(2026, 10, 23);

export const latencySeries = Array.from(
  {
    length: 30,
  },
  (t, a) => ({
    date: new Date(techToday - (29 - a) * 86400000 /* 864e5 */).toISOString().slice(0, 10),
    p50: Math.round(118 + 30 * Math.sin(a / 3) + randC() * 18),
    p95: Math.round(380 + 70 * Math.sin(a / 3) + (a === 22 ? 260 : 0) + randC() * 50),
    rps: Math.round(620 + a * 18 + randC() * 60),
    hit: +(93 + a * 0.1 /* .1 */ + randC()).toFixed(1),
  }),
);

export const endpoints = [
  ["GET /v1/me/home", 5100, 35, 110, 0.1 /* .1 */, 91],
  ["GET /v1/listings/search", 4200, 48, 140, 0.1 /* .1 */, 96],
  ["GET /v1/hostels/:id", 3100, 22, 90, 0.05 /* .05 */, 98],
  ["GET /v1/map/tiles", 2900, 15, 60, 0, 99],
  ["POST /v1/scan", 2600, 85, 240, 0.4 /* .4 */, 0],
  ["POST /v1/meals", 900, 40, 130, 0.2 /* .2 */, 0],
  ["POST /v1/seat-requests", 140, 120, 380, 0.6 /* .6 */, 0],
  ["GET /v1/hostels/:id/seats", 620, 410, 980, 0.3 /* .3 */, 0],
];

export const cacheKeys = [
  ["search:uttara:girls:max6000", 1240, "60 s"],
  ["card:hostel:h0", 860, "5 min"],
  ["tiles:z14:uttara", 640, "10 min"],
  ["card:hostel:h2", 410, "5 min"],
  ["home:feed:diu", 380, "60 s"],
];

export const slowQueries = [
  [
    "SELECT \u2026 FROM seats JOIN rooms \u2026 WHERE hostel_id = $1 AND status = $2",
    410,
    2100,
    "No index on seats(hostel_id, status)",
    "ENG-410",
  ],
  [
    "SELECT count(*) FROM reports WHERE user_id = $1 AND \u2026",
    180,
    9800,
    "Count on every profile open; cache it",
    null,
  ],
  [
    "UPDATE listings SET views = views + 1 \u2026",
    95,
    0,
    "Fixed: counters now batched in Redis",
    "ENG-390",
  ],
];

export const rollouts = [
  {
    app: "Android",
    v: "2.4.1",
    stage: 40,
    status: "Halted",
    note: "Crash in meal toggle (ENG-412)",
    crash: 99.6,
  },
  {
    app: "iOS",
    v: "2.4.0",
    stage: 100,
    status: "Live",
    note: "Full rollout 12 Nov",
    crash: 99.8,
  },
  {
    app: "Business web",
    v: "1.9.3",
    stage: 100,
    status: "Live",
    note: "Deployed 18 Nov",
    crash: 99.97,
  },
];

export const deploys = [
  ["1.9.3", "Business web", "18 Nov, 14:20", "Tareq Aziz", "Live"],
  ["api-3.4.0", "API", "20 Nov, 11:05", "Nabil Rahman", "Live"],
  ["api-3.3.9", "API", "17 Nov, 16:40", "Nabil Rahman", "Rolled back"],
  ["scan-3.2.2", "Scan service", "3 Oct, 10:00", "Tareq Aziz", "Live"],
];

export const crashes = [
  ["NullPointer in MealToggle.onChange", "Android 2.4.1", 312, "Rising", "ENG-412"],
  ["Camera permission crash on scan", "iOS 2.4.0", 41, "Flat", "ENG-399"],
  ["Image cache out of memory", "Android 2.3.x", 18, "Falling", null],
];

export const onCall = [
  ["This week", "Tareq Aziz", "Nabil Rahman"],
  ["30 Nov", "Nabil Rahman", "Sadia Noor"],
  ["7 Dec", "Sadia Noor", "Arif Hossain"],
  ["14 Dec", "Arif Hossain", "Tareq Aziz"],
];

export const runbooks = [
  ["Living ID scans failing", "Scan service", "12 steps", "2 Oct"],
  ["NID provider slow", "Integrations", "8 steps", "23 Nov"],
  ["Cache stampede on a hot key", "Redis", "6 steps", "20 Nov"],
  ["Replica lag over 5 s", "Database", "7 steps", "9 Nov"],
  ["Push notices delayed", "FCM", "5 steps", "14 Nov"],
];

export const infraCosts = [
  ["Compute (API, jobs)", 38000 /* 38e3 */],
  ["Database (Postgres + replica)", 24000 /* 24e3 */],
  ["Search", 11000 /* 11e3 */],
  ["Redis", 9000 /* 9e3 */],
  ["CDN and storage", 6000 /* 6e3 */],
  ["Logs and monitoring", 4000 /* 4e3 */],
  ["Backups", 3000 /* 3e3 */],
];

export const scalingPlan = [
  ["Connection pooler (PgBouncer)", "done"],
  ["One read replica for reports and HQ", "done"],
  ["Listing cards in Redis", "done"],
  ["View counters batched", "done"],
  ["Photos on CDN, 3 sizes", "done"],
  ["Refill lock on hot keys", "doing"],
  ["Hostel search on Meilisearch", "doing"],
  ["Rate limits per endpoint", "todo"],
  ["Change events refresh cache and search", "todo"],
  ["Split database by city", "later"],
];
