import { photos } from "@/lib/photos";

let seed = 20261123;

const rand = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;

const pick = (t) => t[Math.floor(rand() * t.length)];

const randomLivingId = () => String(400000 /* 4e5 */ + Math.floor(rand() * 599999));

export const currentAdmin = {
  name: "Sabbir Ahmed",
  role: "Super admin",
  photo: photos["p-ra"],
};

export const areas = [
  "Uttara",
  "Mirpur",
  "Dhanmondi",
  "Bashundhara",
  "Mohammadpur",
  "Banani",
  "Farmgate",
  "Badda",
];

export const universities = [
  "Daffodil International University",
  "North South University",
  "IUBAT",
  "Uttara University",
  "BUBT",
  "East West University",
  "BRAC University",
];

const jobTitles = [
  "Bank officer",
  "Software QA engineer",
  "Staff nurse",
  "School teacher",
  "Merchandiser",
  "Sales executive",
];

const femaleNames = [
  "Nusrat Jahan",
  "Farhana Islam",
  "Sadia Afrin",
  "Tahmina Akter",
  "Rumana Haque",
  "Mahjabin Chowdhury",
  "Sumaiya Rahman",
  "Nabila Hossain",
  "Ishrat Jahan",
  "Tasnia Ahmed",
  "Maliha Kabir",
  "Raisa Siddiqua",
  "Jannatul Ferdous",
  "Afsana Mim",
  "Lamisa Tabassum",
  "Sharmin Akter",
  "Nazia Haque",
  "Rubaiya Islam",
  "Tasnim Hoque",
  "Lamia Chowdhury",
  "Mim Rahman",
  "Sadia Islam",
];

const maleNames = [
  "Tanvir Hasan",
  "Rakib Hossain",
  "Arif Rahman",
  "Imran Kabir",
  "Shakib Ahmed",
  "Nayeem Islam",
  "Fahim Chowdhury",
  "Rafsan Haque",
  "Sajid Mahmud",
  "Mehedi Hasan",
  "Asif Iqbal",
  "Rifat Karim",
  "Zahid Hasan",
  "Tamim Rahman",
  "Siam Ahmed",
  "Abrar Faiyaz",
];

const landlordNames = [
  "Abdul Karim",
  "Rokeya Begum",
  "Motaleb Hossain",
  "Shamima Nasrin",
  "Kamal Uddin",
  "Hasina Akter",
  "Jahangir Alam",
  "Nurjahan Begum",
];

const namedPhotos = {
  "Nusrat Jahan": photos["p-nj"],
  "Farhana Islam": photos["p-fa"],
  "Tanvir Hasan": photos["p-ta"],
  "Abdul Karim": photos["p-kh"],
  "Rokeya Begum": photos["p-sk"],
};

const photoForName = (t) => namedPhotos[t] || null;

const surnames = [
  "Sarkar",
  "Mondal",
  "Talukder",
  "Biswas",
  "Mollah",
  "Bhuiyan",
  "Sheikh",
  "Khan",
  "Mia",
  "Pramanik",
];

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const hostelSeeds = [
  ["Uttara Scholars Hostel", "Uttara", "Girls", "Rahela Akter", photos.b0],
  ["Green Nest Boys Hostel", "Mirpur", "Boys", "Jalal Uddin", photos.b3],
  ["Dhanmondi Lake View Hostel", "Dhanmondi", "Girls", "Shirin Sultana", photos.b5],
  ["Bashundhara Campus Home", "Bashundhara", "Boys", "Mizanur Rahman", photos.r2],
  ["Sunrise Ladies Hostel", "Mohammadpur", "Girls", "Kohinoor Begum", photos.r1],
  ["North Gate Mess", "Uttara", "Boys", "Habib Ullah", photos.r3],
  ["Banani Working Women Hostel", "Banani", "Girls", "Selina Parvin", photos.r4],
  ["Farmgate Students Lodge", "Farmgate", "Boys", "Delwar Hossain", photos.b3],
  ["Badda Scholars Inn", "Badda", "Girls", "Morium Khatun", photos.b5],
  ["Mirpur 10 Youth Hostel", "Mirpur", "Boys", "Anwar Hossain", photos.r2],
  ["Lalmatia Girls Residence", "Mohammadpur", "Girls", "Parveen Akter", photos.r1],
  ["Sector 4 Boys Mess", "Uttara", "Boys", "Alamgir Kabir", photos.b0],
];

export const hostels = hostelSeeds.map(([t, a, e, r, i], o) => {
  let n = [48, 36, 60, 40, 32, 24, 44, 30, 28, 52, 36, 20][o];
  let l = Math.min(n, Math.round(n * (0.62 /* .62 */ + rand() * 0.36) /* .36 */));
  return {
    id: "h" + o,
    name: t,
    area: a,
    type: e,
    owner: r,
    photo: i,
    seats: n,
    filled: l,
    plan: o === 0 || o === 2 ? "Plus" : o % 3 === 0 ? "Free" : "Pro",
    rating: (4 + rand() * 0.9) /* .9 */
      .toFixed(1),
    safety: Math.round(72 + rand() * 27),
    status: o === 9 || o === 11 ? "pending" : o === 7 ? "paused" : "live",
    staff: 2 + Math.floor(rand() * 4),
    joined: `${monthNames[Math.floor(rand() * 10)]} 2026`,
    code: "H" + (2400 + o * 7),
    phone: `+880 17${Math.floor(10 + rand() * 89)} ${Math.floor(100 + rand() * 899)} ${Math.floor(100 + rand() * 899)}`,
    reports: Math.floor(rand() * 4),
    discount: rand() < 0.7 /* .7 */,
  };
});

hostels[7].pauseNote = "Paused by HQ: fire exit photos missing";

export const users = [];

for (let t = 0; t < 64; t++) {
  let a =
    t < femaleNames.length
      ? true
      : t < femaleNames.length + maleNames.length
        ? false
        : t < 46
          ? t % 2 === 1
          : rand() < 0.5; /* .5 */
  let e =
    t < femaleNames.length
      ? femaleNames[t]
      : t < femaleNames.length + maleNames.length
        ? maleNames[t - femaleNames.length]
        : t < femaleNames.length + maleNames.length + landlordNames.length
          ? landlordNames[t - femaleNames.length - maleNames.length]
          : `${pick(a ? femaleNames : maleNames).split(" ")[0]} ${pick(surnames)}`;
  let r =
    t >= femaleNames.length + maleNames.length &&
    t < femaleNames.length + maleNames.length + landlordNames.length;
  let i = r ? "landlord" : rand() < 0.7 /* .7 */ ? "student" : "job";
  let o = r
    ? null
    : rand() < 0.62 /* .62 */
      ? pick(hostels.filter((l) => (l.type === "Girls") === a && l.status === "live"))
      : null;
  let n = Math.floor(rand() * 18);
  users.push({
    id: "u" + t,
    name: e,
    photo: photoForName(e),
    lid: randomLivingId(),
    type: i,
    org:
      i === "student"
        ? pick(universities)
        : i === "job"
          ? pick(jobTitles)
          : `${1 + Math.floor(rand() * 4)} flats`,
    area: o ? o.area : pick(areas),
    hostel: o ? o.id : null,
    flat: !o && !r && rand() < 0.5 /* .5 */,
    level: n >= 15 ? 3 : n >= 5 ? 2 : 1,
    stays: n,
    reports: rand() < 0.08 /* .08 */ ? 1 : 0,
    status: t === 13 ? "suspended" : t === 40 ? "pending" : "active",
    nid: t !== 40,
    student: i === "student" && rand() < 0.9 /* .9 */,
    guardian: !r && rand() < 0.55 /* .55 */,
    face: t !== 40,
    joined: `${monthNames[Math.floor(rand() * 11)]} 2026`,
    active: pick(["Now", "5 min ago", "1 hr ago", "Today", "Yesterday", "3 days ago"]),
    device: rand() < 0.82 /* .82 */ ? "Android" : "iPhone",
    phone: `+880 1${Math.floor(3 + rand() * 6)}${Math.floor(10 + rand() * 89)} ${Math.floor(100 + rand() * 899)} ${Math.floor(100 + rand() * 899)}`,
    nidNo: `${Math.floor(1000 /* 1e3 */ + rand() * 8999)} ${Math.floor(100 + rand() * 899)} ${Math.floor(100 + rand() * 899)}`,
    address: `House ${Math.floor(2 + rand() * 60)}, Road ${Math.floor(1 + rand() * 20)}, ${pick(["Rajshahi", "Bogura", "Sylhet", "Khulna", "Rangpur", "Cumilla"])}`,
    fem: a,
  });
}

Object.assign(users[0], {
  type: "student",
  org: "Daffodil International University",
  hostel: "h0",
  area: "Uttara",
  student: true,
  level: 2,
  stays: 6,
  guardian: true,
});

Object.assign(users[1], {
  type: "job",
  org: "Bank officer",
  hostel: "h0",
  area: "Uttara",
  level: 2,
  stays: 7,
});

export const getUser = (t) => users.find((a) => a.id === t);

export const getHostel = (t) => hostels.find((a) => a.id === t);

export const verifications = [
  {
    id: "v1",
    uid: "u18",
    kind: "nid",
    score: 96,
    when: "4 min ago",
    flags: [],
    note: "",
  },
  {
    id: "v2",
    uid: "u40",
    kind: "nid",
    score: 58,
    when: "12 min ago",
    flags: ["Face match is low", "Photo is blurry"],
    note: "",
  },
  {
    id: "v3",
    uid: "u19",
    kind: "student",
    score: 91,
    when: "25 min ago",
    flags: [],
    note: "NSU ID card, valid to Dec 2027",
  },
  {
    id: "v4",
    uid: "u24",
    kind: "student",
    score: 88,
    when: "1 hr ago",
    flags: ["Card expires in 20 days"],
    note: "IUBAT ID card",
  },
  {
    id: "v5",
    uid: "u39",
    kind: "landlord",
    score: 0,
    when: "2 hrs ago",
    flags: [],
    note: "Holding tax receipt 2026 and deed copy",
  },
  {
    id: "v6",
    uid: "u20",
    kind: "guardian",
    score: 0,
    when: "3 hrs ago",
    flags: [],
    note: "Father, called and confirmed by phone OTP",
  },
  {
    id: "v7",
    uid: "u30",
    kind: "nid",
    score: 93,
    when: "Yesterday",
    flags: [],
    note: "",
  },
];

export const listingReviews = [
  {
    id: "l1",
    hid: "h9",
    kind: "New hostel",
    title: "Mirpur 10 Youth Hostel",
    change: "First listing \xB7 52 seats \xB7 from \u09F34,800",
    photo: photos.r2,
    when: "40 min ago",
    checks: {
      photos: true,
      prices: true,
      rules: true,
      fire: false,
    },
  },
  {
    id: "l2",
    hid: "h11",
    kind: "New hostel",
    title: "Sector 4 Boys Mess",
    change: "First listing \xB7 20 seats \xB7 from \u09F33,900",
    photo: photos.b0,
    when: "2 hrs ago",
    checks: {
      photos: true,
      prices: true,
      rules: false,
      fire: true,
    },
  },
  {
    id: "l3",
    hid: "h3",
    kind: "Price change",
    title: "Bashundhara Campus Home",
    change: "AC 2-bed \u09F37,200 \u2192 \u09F38,500 (+18%)",
    photo: photos.r2,
    when: "3 hrs ago",
    checks: {
      photos: true,
      prices: false,
      rules: true,
      fire: true,
    },
  },
  {
    id: "l4",
    uid: "u38",
    kind: "New flat",
    title: "2-bed flat for students \xB7 Uttara 11",
    change: "Landlord flat \xB7 \u09F318,000 a month \xB7 3 people",
    photo: photos.r4,
    when: "5 hrs ago",
    checks: {
      photos: true,
      prices: true,
      rules: true,
      fire: true,
    },
  },
  {
    id: "l5",
    hid: "h4",
    kind: "New photos",
    title: "Sunrise Ladies Hostel",
    change: "6 new photos of rooms and dining",
    photo: photos.r1,
    when: "Yesterday",
    checks: {
      photos: true,
      prices: true,
      rules: true,
      fire: true,
    },
  },
];

export const reports = [
  {
    id: "p1",
    uid: "u23",
    type: "Left without paying",
    by: "h1",
    filed: "12 Nov",
    left: 4,
    status: "Disputed",
    proof: "Unpaid Sep and Oct. Two app reminders sent.",
    reply: "I paid September in cash to the manager. I have a photo of the receipt.",
  },
  {
    id: "p2",
    uid: "u14",
    type: "Repeated rule breaking",
    by: "h0",
    filed: "2 Nov",
    left: 0,
    status: "Active",
    proof: "Warnings on 3 Oct and 12 Oct for returning after 1 am.",
    reply: "",
  },
  {
    id: "p3",
    uid: "u27",
    type: "Property damage",
    by: "h5",
    filed: "18 Nov",
    left: 9,
    status: "Waiting for reply",
    proof: "Broken window, photo and repair bill of \u09F33,200.",
    reply: "",
  },
  {
    id: "p4",
    uid: "u33",
    type: "Violence, theft or threat",
    by: "h3",
    filed: "20 Nov",
    left: 11,
    status: "HQ review",
    proof: "GD no. 1184, Bhatara Police Station, 19 Nov 2026.",
    reply: "",
  },
  {
    id: "p5",
    uid: "u8",
    type: "Left without paying",
    by: "h4",
    filed: "Mar 2025",
    left: 0,
    status: "Faded",
    proof: "Unpaid Feb 2025.",
    reply: "",
  },
  {
    id: "p6",
    uid: "u52",
    type: "Repeated rule breaking",
    by: "h10",
    filed: "21 Nov",
    left: 12,
    status: "Waiting for reply",
    proof: "Visitors in rooms after 8 pm on 3 days.",
    reply: "",
  },
];

export const safetyAlerts = [
  {
    id: "x1",
    sev: "high",
    kind: "Face did not match at the gate",
    where: "Uttara Scholars Hostel",
    who: "Living ID 539 207",
    when: "Tue 18 Nov, 8:42 pm",
    open: true,
  },
  {
    id: "x2",
    sev: "high",
    kind: "Reported by 3 hostels in 60 days",
    where: "Mirpur, Uttara",
    who: "u23",
    when: "Today, 11:10 am",
    open: true,
  },
  {
    id: "x3",
    sev: "med",
    kind: "9 failed Living ID scans in 10 minutes",
    where: "Green Nest Boys Hostel",
    who: "Gate tablet 2",
    when: "Today, 9:02 am",
    open: true,
  },
  {
    id: "x4",
    sev: "med",
    kind: "5 new accounts from one phone",
    where: "Android device \xB7\xB7 7F21",
    who: "Sign-up",
    when: "Yesterday, 11:48 pm",
    open: true,
  },
  {
    id: "x5",
    sev: "low",
    kind: "Hostel pulled the guest list twice in a day",
    where: "Bashundhara Campus Home",
    who: "Owner account",
    when: "Yesterday",
    open: false,
  },
];

export const lawRequests = [
  {
    id: "LR-0142",
    agency: "Uttara West Police Station, DMP",
    officer: "SI Mahfuz Alam",
    badge: "BP 8411209",
    caseNo: "GD 1184/26",
    subject: "u33",
    scope: ["Name and Living ID", "Stay history (last 12 months)", "Current hostel"],
    received: "21 Nov",
    due: "28 Nov",
    step: 1,
    legal: null,
    second: null,
    notify: true,
  },
  {
    id: "LR-0139",
    agency: "Mirpur Model Police Station, DMP",
    officer: "Inspector Rezaul Karim",
    badge: "BP 7902114",
    caseNo: "Case 22/26 (theft)",
    subject: "u23",
    scope: ["Name and Living ID", "Phone number", "Stay history (last 12 months)"],
    received: "17 Nov",
    due: "24 Nov",
    step: 2,
    legal: "Nadia Rahman",
    second: null,
    notify: true,
  },
  {
    id: "LR-0131",
    agency: "Bhatara Police Station, DMP",
    officer: "SI Kamrul Hasan",
    badge: "BP 8820431",
    caseNo: "GD 977/26",
    subject: "u27",
    scope: ["Name and Living ID", "Current hostel"],
    received: "2 Nov",
    due: "9 Nov",
    step: 3,
    legal: "Nadia Rahman",
    second: "Sabbir Ahmed",
    notify: true,
    outcome: "Released",
  },
  {
    id: "LR-0127",
    agency: "Unknown sender (email)",
    officer: "Not given",
    badge: "\u2014",
    caseNo: "None",
    subject: null,
    scope: ["All residents in Uttara"],
    received: "28 Oct",
    due: "\u2014",
    step: 3,
    legal: "Nadia Rahman",
    second: "Sabbir Ahmed",
    notify: false,
    outcome: "Refused: no case number, bulk request",
  },
];

export const approvals = [
  {
    id: "ap1",
    action: "Release data to police",
    target: "LR-0139 \xB7 Rakib Hossain",
    by: "Nadia Rahman",
    reason: "Case 22/26, scope checked",
    when: "2 hrs ago",
    status: "waiting",
    link: "law",
  },
  {
    id: "ap2",
    action: "Delete account",
    target: "Rafsan Haque",
    by: "Mitu Akter",
    reason: "User asked in app on 20 Nov",
    when: "Yesterday",
    status: "waiting",
    link: "users",
  },
  {
    id: "ap3",
    action: "Remove report",
    target: "Report p1 \xB7 Left without paying",
    by: "Mitu Akter",
    reason: "Receipt photo checks out",
    when: "Yesterday",
    status: "waiting",
    link: "reports",
  },
];

export const auditLog = [
  ["Today 2:58 pm", "Mitu Akter", "Approved NID check", "Sumaiya Rahman", "Score 97"],
  [
    "Today 2:41 pm",
    "Sabbir Ahmed",
    "Paused listing",
    "Farmgate Students Lodge",
    "Fire exit photos missing",
  ],
  ["Today 2:10 pm", "Rony Das", "Viewed phone number", "Tahmina Akter", "Support ticket T-2291"],
  ["Today 1:32 pm", "Nadia Rahman", "Started legal review", "LR-0142", "GD 1184/26"],
  [
    "Today 12:05 pm",
    "Sabbir Ahmed",
    "Changed feature switch",
    "Friends Zone \xB7 iOS",
    "Rollout 25% \u2192 50%",
  ],
  ["Today 11:47 am", "Mitu Akter", "Rejected NID check", "Account u61", "Photo of a screen"],
  [
    "Today 10:20 am",
    "Farah Kabir",
    "Sent push notice",
    "DIU students, Uttara",
    "Seats open near campus",
  ],
  [
    "Today 9:15 am",
    "Rony Das",
    "Opened hostel as support",
    "Green Nest Boys Hostel",
    "Owner asked for help with seats",
  ],
  [
    "Yesterday 6:40 pm",
    "Sabbir Ahmed",
    "Changed plan",
    "Dhanmondi Lake View Hostel",
    "Pro \u2192 Plus",
  ],
  [
    "Yesterday 4:12 pm",
    "Mitu Akter",
    "Suspended account",
    "Afsana Mim",
    "Three hostels reported threats",
  ],
  [
    "Yesterday 2:00 pm",
    "Imran Chowdhury",
    "Approved hostel",
    "Lalmatia Girls Residence",
    "Papers and visit done",
  ],
  [
    "Yesterday 11:02 am",
    "Nadia Rahman",
    "Refused police request",
    "LR-0127",
    "No case number, bulk request",
  ],
].map(([t, a, e, r, i], o) => ({
  id: "a" + o,
  when: t,
  by: a,
  act: e,
  target: r,
  why: i,
}));

export const campaigns = [
  {
    id: "c1",
    name: "Seats open near DIU",
    ch: "Push",
    aud: "Students \xB7 DIU \xB7 no hostel \xB7 Uttara, Ashulia",
    reach: 1840,
    open: 41,
    status: "Sent",
    when: "Today, 10:20 am",
  },
  {
    id: "c2",
    name: "Add your guardian",
    ch: "Banner",
    aud: "Living in a hostel \xB7 no guardian",
    reach: 2210,
    open: 18,
    status: "Running",
    when: "Since 15 Nov",
  },
  {
    id: "c3",
    name: "Level 2 is close",
    ch: "Push",
    aud: "4 stays \xB7 on time",
    reach: 612,
    open: 52,
    status: "Sent",
    when: "19 Nov",
  },
  {
    id: "c4",
    name: "Eid travel: tell your hostel",
    ch: "SMS",
    aud: "All residents",
    reach: 9420,
    open: 0,
    status: "Scheduled",
    when: "2 Mar 2027",
  },
  {
    id: "c5",
    name: "List your flat for verified students",
    ch: "Push",
    aud: "Landlords \xB7 Uttara, Mirpur",
    reach: 318,
    open: 0,
    status: "Draft",
    when: "\u2014",
  },
];

export const universityPartners = [
  {
    name: "Daffodil International University",
    short: "DIU",
    domain: "diu.edu.bd",
    students: 3120,
    status: "Partner",
    since: "Aug 2026",
  },
  {
    name: "North South University",
    short: "NSU",
    domain: "northsouth.edu",
    students: 1480,
    status: "Partner",
    since: "Sep 2026",
  },
  {
    name: "IUBAT",
    short: "IUBAT",
    domain: "iubat.edu",
    students: 960,
    status: "Talking",
    since: "\u2014",
  },
  {
    name: "Uttara University",
    short: "UU",
    domain: "uttarauniversity.edu.bd",
    students: 870,
    status: "Partner",
    since: "Oct 2026",
  },
  {
    name: "BUBT",
    short: "BUBT",
    domain: "bubt.edu.bd",
    students: 540,
    status: "Talking",
    since: "\u2014",
  },
  {
    name: "East West University",
    short: "EWU",
    domain: "ewubd.edu",
    students: 410,
    status: "Not yet",
    since: "\u2014",
  },
];

export const plans = [
  {
    id: "Free",
    price: 0,
    desc: "Get listed and verify residents",
    feats: ["Listing on MyStay ID", "Scan Living IDs", "Up to 20 seats", "1 staff seat"],
  },
  {
    id: "Pro",
    price: 1500,
    desc: "Run the whole hostel",
    feats: [
      "Everything in Free",
      "Up to 60 seats",
      "Meals, notices, requests",
      "4 staff seats",
      "Rent record",
    ],
  },
  {
    id: "Plus",
    price: 3500,
    desc: "Several hostels, top placement",
    feats: [
      "Everything in Pro",
      "Unlimited seats",
      "Up to 3 hostels",
      "Top of search in your area",
      "Priority support",
    ],
  },
];

export const invoices = hostels
  .filter((t) => t.plan !== "Free")
  .map((t, a) => ({
    id: `INV-26${String(1100 + a)}`,
    hid: t.id,
    plan: t.plan,
    amt: plans.find((e) => e.id === t.plan).price,
    month: "Nov 2026",
    status: a === 3 ? "Failed" : a === 5 ? "Due" : "Paid",
    via: a % 2 ? "bKash" : "Card",
  }));

export const featureFlags = [
  {
    key: "friends",
    name: "Friends Zone",
    desc: "See which friends live nearby",
    app: 25,
    web: null,
    android: true,
    ios: true,
    cities: "Dhaka",
  },
  {
    key: "livingmap",
    name: "Living Map",
    desc: "Map of verified places to stay",
    app: 100,
    web: null,
    android: true,
    ios: true,
    cities: "Dhaka",
  },
  {
    key: "hostelsearch",
    name: "Hostel search and seat requests",
    desc: "Students find hostels and ask for a seat",
    app: 100,
    web: 100,
    android: true,
    ios: true,
    cities: "Dhaka",
  },
  {
    key: "meals",
    name: "Meal on/off",
    desc: "Residents switch tomorrow\u2019s meals",
    app: 100,
    web: 100,
    android: true,
    ios: true,
    cities: "Dhaka",
  },
  {
    key: "levels",
    name: "Stay Levels and rewards",
    desc: "Discounts for repeat residents",
    app: 100,
    web: 100,
    android: true,
    ios: true,
    cities: "Dhaka",
  },
  {
    key: "flats",
    name: "Flat listings by landlords",
    desc: "Landlords list flats for verified tenants",
    app: 50,
    web: null,
    android: true,
    ios: false,
    cities: "Uttara, Mirpur",
  },
  {
    key: "facescan",
    name: "Face check at the gate",
    desc: "Gate tablet compares the face with the Living ID photo",
    app: null,
    web: 40,
    android: true,
    ios: true,
    cities: "Uttara",
  },
];

export const cities = [
  {
    name: "Dhaka",
    status: "Live",
    areas: [
      ["Uttara", true],
      ["Mirpur", true],
      ["Dhanmondi", true],
      ["Bashundhara", true],
      ["Mohammadpur", true],
      ["Banani", true],
      ["Farmgate", true],
      ["Badda", true],
      ["Gulshan", false],
      ["Motijheel", false],
    ],
  },
  {
    name: "Chattogram",
    status: "Planned",
    areas: [
      ["GEC", false],
      ["Chawkbazar", false],
      ["Agrabad", false],
    ],
  },
  {
    name: "Sylhet",
    status: "Planned",
    areas: [
      ["Zindabazar", false],
      ["Shahjalal Upashahar", false],
    ],
  },
];

export const contentPolicies = {
  reports: [
    ["Left without paying", "Unpaid months with dates", "2 years"],
    ["Property damage", "Photo and bill", "2 years"],
    ["Repeated rule breaking", "Dates of 2 warnings", "2 years"],
    ["Violence, theft or threat", "Police GD or case number", "Kept while the case is open"],
  ],
  rules: [
    "Gate closes at 11 pm. Late return? Ask in the app.",
    "Guests in the lobby only, 10 am to 8 pm.",
    "Change tomorrow\u2019s meals by 10 pm.",
    "No cooking in rooms.",
    "Keep noise low after 11 pm.",
    "No smoking anywhere inside.",
  ],
  help: [
    ["How do I get my Living ID?", "Mobile app", "Published", "1.2k views"],
    ["How do I ask for a seat?", "Mobile app", "Published", "980 views"],
    ["A hostel reported me. What now?", "Mobile app", "Published", "210 views"],
    ["How do I scan a Living ID at the desk?", "Business web", "Published", "340 views"],
    ["How do staff roles work?", "Business web", "Draft", "\u2014"],
  ],
};

export const supportTickets = [
  {
    id: "T-2297",
    from: "u3",
    fromType: "user",
    subj: "My Living ID photo looks old",
    ch: "App chat",
    pri: "Normal",
    status: "Open",
    who: "Rony Das",
    when: "6 min ago",
    msgs: [
      ["them", "Hi, my Living ID still shows my photo from last year. Can I change it?"],
      ["them", "I cut my hair and the guard looked at me twice \u{1F605}"],
    ],
  },
  {
    id: "T-2296",
    from: "h1",
    fromType: "hostel",
    subj: "Gate tablet keeps failing scans",
    ch: "Business web",
    pri: "High",
    status: "Open",
    who: null,
    when: "22 min ago",
    msgs: [
      ["them", "Tablet 2 at the gate failed 9 scans this morning. Residents are waiting outside."],
    ],
  },
  {
    id: "T-2295",
    from: "u23",
    fromType: "user",
    subj: "Report against me is wrong",
    ch: "App chat",
    pri: "High",
    status: "Open",
    who: "Mitu Akter",
    when: "1 hr ago",
    msgs: [
      ["them", "Green Nest says I did not pay September. I paid cash. I uploaded the receipt."],
      [
        "us",
        "Thanks Rakib. We have your receipt and marked the report as disputed while we check.",
      ],
    ],
  },
  {
    id: "T-2291",
    from: "u4",
    fromType: "user",
    subj: "Change phone number",
    ch: "App chat",
    pri: "Normal",
    status: "Waiting on user",
    who: "Rony Das",
    when: "3 hrs ago",
    msgs: [
      ["them", "I got a new SIM. How do I change my number?"],
      ["us", "You can change it in Settings \u2192 Phone. You will get a code on the new number."],
    ],
  },
  {
    id: "T-2288",
    from: "h6",
    fromType: "hostel",
    subj: "Upgrade to Plus for a second hostel",
    ch: "Business web",
    pri: "Normal",
    status: "Open",
    who: null,
    when: "Yesterday",
    msgs: [["them", "We are opening a second building in Banani. How do we add it?"]],
  },
  {
    id: "T-2280",
    from: "u38",
    fromType: "user",
    subj: "Flat listing still under review",
    ch: "Email",
    pri: "Low",
    status: "Solved",
    who: "Imran Chowdhury",
    when: "2 days ago",
    msgs: [
      ["them", "My flat is in review for 2 days."],
      ["us", "It is live now. Thanks for adding the holding tax receipt."],
    ],
  },
];

export const adminTeam = [
  {
    name: "Sabbir Ahmed",
    role: "Super admin",
    photo: photos["p-ra"],
    tfa: true,
    active: "Now",
    me: true,
  },
  {
    name: "Nadia Rahman",
    role: "Legal officer",
    photo: photos["p-nj"],
    tfa: true,
    active: "20 min ago",
  },
  {
    name: "Mitu Akter",
    role: "Trust & safety",
    photo: photos["p-fa"],
    tfa: true,
    active: "Now",
  },
  {
    name: "Rony Das",
    role: "Support",
    photo: photos["p-ta"],
    tfa: true,
    active: "5 min ago",
  },
  {
    name: "Imran Chowdhury",
    role: "Operations",
    photo: null,
    tfa: true,
    active: "1 hr ago",
  },
  {
    name: "Farah Kabir",
    role: "Growth",
    photo: null,
    tfa: false,
    active: "Yesterday",
  },
];

export const adminRoles = [
  "Super admin",
  "Trust & safety",
  "Operations",
  "Support",
  "Growth",
  "Legal officer",
];

export const permissionMatrix = [
  ["See users (masked)", [1, 1, 1, 1, 0, 1]],
  ["Show hidden details with a reason", [1, 1, 0, 1, 0, 1]],
  ["Approve ID checks", [1, 1, 0, 0, 0, 0]],
  ["Suspend accounts", [1, 1, 0, 0, 0, 0]],
  ["Approve hostels and listings", [1, 0, 1, 0, 0, 0]],
  ["Change plans", [1, 0, 1, 0, 0, 0]],
  ["Send campaigns", [1, 0, 0, 0, 1, 0]],
  ["App control and features", [1, 0, 0, 0, 0, 0]],
  ["Police requests", [1, 0, 0, 0, 0, 1]],
  ["Manage admins", [1, 0, 0, 0, 0, 0]],
];

export const areaUsers = [
  ["Uttara", 4120, 5],
  ["Mirpur", 2980, 3],
  ["Bashundhara", 1840, 1],
  ["Dhanmondi", 1610, 1],
  ["Mohammadpur", 1390, 2],
  ["Farmgate", 940, 1],
  ["Banani", 720, 1],
  ["Badda", 610, 1],
];

export const stays = users
  .filter((t) => t.hostel)
  .slice(0, 16)
  .map((t, a) => ({
    id: "s" + a,
    uid: t.id,
    hid: t.hostel,
    in: `${1 + ((a * 3) % 27)} ${monthNames[(a * 5) % 11]} 2026`,
    out: a % 5 === 0 ? `${3 + a} Nov 2026` : "",
    status: a === 3 ? "Disputed" : a % 5 === 0 ? "Moved out" : "Living here",
    via: a % 4 === 0 ? "Desk scan" : "Seat request",
  }));

export const totals = {
  users: 18420,
  verified: 15960,
  hostels: 148,
  seats: 6240,
  filled: 5410,
  landlords: 412,
  flats: 690,
  levels: [11820, 4870, 1730],
};

export const stayLevels = [
  {
    n: 1,
    name: "New",
    min: 0,
    perk: "Welcome perks at partner hostels",
    off: 5,
  },
  {
    n: 2,
    name: "Regular",
    min: 5,
    perk: "10% off admission at hostels that join",
    off: 10,
  },
  {
    n: 3,
    name: "Trusted",
    min: 15,
    perk: "15% off admission, priority seat requests",
    off: 15,
  },
];

let seedB = 777;

const randB = () => (seedB = (seedB * 1103515245 + 12345) % 2147483648) / 2147483648;

const todayUtc = Date.UTC(2026, 10, 23);

export const dailyMetrics = Array.from(
  {
    length: 90,
  },
  (t, a) => {
    let e = new Date(todayUtc - (89 - a) * 86400000 /* 864e5 */);
    let r = a / 89;
    let i = e.getUTCDay() === 5 ? 0.78 /* .78 */ : e.getUTCDay() === 6 ? 0.9 /* .9 */ : 1;
    let o = Math.round((60 + 80 * r * r + 25 * Math.sin(a / 4)) * i + randB() * 18);
    return {
      date: e.toISOString().slice(0, 10),
      signups: o,
      verified: Math.round(o * (0.8 /* .8 */ + randB() * 0.1) /* .1 */),
      dau: Math.round((5200 + 5400 * r + 600 * Math.sin(a / 3.5)) * i + randB() * 300),
      requests: Math.round((40 + 70 * r) * i + randB() * 14),
      scans: Math.round((2600 + 2900 * r) * i + randB() * 200),
      moveins: Math.round(8 + 14 * r + randB() * 6),
    };
  },
);

export const funnelSteps = [
  ["Signed up", 18420],
  ["Verified Living ID", 15960],
  ["Looked at a place", 11230],
  ["Sent a seat request", 5120],
  ["Moved in", 3410],
];

export const cohorts = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((t, a) => ({
  m: t,
  size: [820, 1140, 2210, 3180, 4020, 3610][a],
  ret: Array.from(
    {
      length: 6 - a,
    },
    (e, r) =>
      r === 0
        ? 100
        : Math.round(
            100 * Math.pow(0.86 /* .86 */ - r * 0.012 /* .012 */ + a * 0.006 /* .006 */, r) -
              randB() * 3,
          ),
  ),
}));

export const userMix = [
  ["Students", 11940, "primary"],
  ["Job holders", 6068, "teal"],
  ["Landlords", 412, "orange"],
];

export const signupSources = [
  ["Friend referral", 5210],
  ["University partner", 4380],
  ["Hostel QR at reception", 3960],
  ["Facebook", 2890],
  ["Google search", 1980],
];

export const cases = [
  {
    id: "CS-1048",
    title: "Rakib Hossain reported by 3 hostels",
    type: "Repeat reports",
    pri: "P1",
    status: "Investigating",
    who: "Mitu Akter",
    sla: 3.5,
    opened: "23 Nov, 11:10",
    links: ["u23", "h1", "p1"],
    notes: 2,
  },
  {
    id: "CS-1047",
    title: "Face mismatch at Uttara Scholars gate",
    type: "Identity",
    pri: "P1",
    status: "New",
    who: null,
    sla: 5,
    opened: "18 Nov, 20:42",
    links: ["h0"],
    notes: 0,
  },
  {
    id: "CS-1045",
    title: "5 accounts from one Android phone",
    type: "Fake accounts",
    pri: "P2",
    status: "Investigating",
    who: "Mitu Akter",
    sla: 14,
    opened: "22 Nov, 23:48",
    links: [],
    notes: 1,
  },
  {
    id: "CS-1043",
    title: "Rifat Karim theft GD 1184",
    type: "Police case",
    pri: "P1",
    status: "Waiting on police",
    who: "Nadia Rahman",
    sla: 40,
    opened: "20 Nov, 16:02",
    links: ["u33", "h3", "p4"],
    notes: 3,
  },
  {
    id: "CS-1040",
    title: "Hostel pulled guest list twice",
    type: "Hostel conduct",
    pri: "P3",
    status: "Waiting on hostel",
    who: "Imran Chowdhury",
    sla: 52,
    opened: "22 Nov, 13:15",
    links: ["h3"],
    notes: 1,
  },
  {
    id: "CS-1036",
    title: "Price jump 18% at Bashundhara Campus Home",
    type: "Listing",
    pri: "P3",
    status: "Investigating",
    who: "Imran Chowdhury",
    sla: 30,
    opened: "23 Nov, 12:30",
    links: ["h3"],
    notes: 0,
  },
  {
    id: "CS-1031",
    title: "Afsana Mim threats in Floor B",
    type: "Safety",
    pri: "P1",
    status: "Resolved",
    who: "Mitu Akter",
    sla: 0,
    opened: "19 Nov, 09:00",
    links: ["u13", "h2"],
    notes: 4,
  },
];

export const riskRules = [
  {
    id: "R-01",
    name: "Many accounts from one phone",
    when: "Same device signs up 3+ accounts in 24 h",
    then: "Hold new accounts \xB7 open a case",
    on: true,
    hits: 14,
    last: "23 Nov",
    sev: "high",
  },
  {
    id: "R-02",
    name: "Face mismatch at a gate",
    when: "Gate face check score below 60",
    then: "Alert the guard \xB7 open a case",
    on: true,
    hits: 3,
    last: "18 Nov",
    sev: "high",
  },
  {
    id: "R-03",
    name: "Reported by several hostels",
    when: "2+ active reports from different hostels in 90 days",
    then: "Safety alert \xB7 review queue",
    on: true,
    hits: 6,
    last: "23 Nov",
    sev: "high",
  },
  {
    id: "R-04",
    name: "Failed scans burst",
    when: "8+ failed Living ID scans on one tablet in 10 min",
    then: "Notify hostel \xB7 check device",
    on: true,
    hits: 9,
    last: "23 Nov",
    sev: "med",
  },
  {
    id: "R-05",
    name: "Sudden price jump",
    when: "Listing price up 15%+ in one edit",
    then: "Send listing to review",
    on: true,
    hits: 4,
    last: "23 Nov",
    sev: "low",
  },
  {
    id: "R-06",
    name: "Guest list pulled often",
    when: "Hostel copies the guest list 2+ times in a day",
    then: "Flag hostel \xB7 ask why",
    on: true,
    hits: 2,
    last: "22 Nov",
    sev: "med",
  },
  {
    id: "R-07",
    name: "New account asks for many seats",
    when: "Account under 7 days sends 5+ seat requests",
    then: "Slow down requests",
    on: false,
    hits: 0,
    last: "\u2014",
    sev: "low",
  },
];

export const services = [
  ["Mobile API", 99.98, 182],
  ["Living ID scan", 99.95, 176],
  ["Business web app", 99.97, 240],
  ["Push notices (FCM)", 99.9, 0],
  ["SMS gateway", 99.4, 0],
  ["NID check provider", 98.7, 1240],
  ["Search and map", 99.99, 95],
  ["Database", 100, 0],
].map(([t, a, e], r) => ({
  n: t,
  up: a,
  ms: e,
  bars: Array.from(
    {
      length: 60,
    },
    (i, o) =>
      r === 5 && (o === 41 || o === 42)
        ? "down"
        : (r === 4 && o === 52) || (r !== 7 && randB() < 0.02) /* .02 */
          ? "slow"
          : "ok",
  ),
  status: r === 5 ? "Slow" : "OK",
}));

export const incidents = [
  {
    id: "INC-31",
    title: "NID check provider slow",
    sev: "Minor",
    status: "Monitoring",
    start: "23 Nov, 08:40",
    impact: "ID checks take up to 4 min instead of 20 s",
    updates: [
      ["09:55", "Monitoring", "Provider fixed a queue. Checks back under 40 s."],
      ["09:10", "Identified", "Provider confirmed a slowdown on their side."],
      ["08:40", "Investigating", "Checks taking longer than usual."],
    ],
  },
  {
    id: "INC-30",
    title: "SMS codes delayed on one operator",
    sev: "Minor",
    status: "Resolved",
    start: "14 Nov, 19:05",
    impact: "Sign-in codes late by 2\u20135 min for one operator",
    updates: [["20:30", "Resolved", "Switched to backup route."]],
  },
  {
    id: "INC-28",
    title: "Living ID scans failing in Mirpur",
    sev: "Major",
    status: "Resolved",
    start: "2 Oct, 21:12",
    impact: "1,240 failed scans over 38 min",
    updates: [["21:50", "Resolved", "Rolled back scan service 3.2.1."]],
  },
];

export const backgroundJobs = [
  ["Send push notices", "running", 1240, "0.4 s"],
  ["NID checks", "running", 38, "24 s"],
  ["Fade old reports", "scheduled", 0, "Daily 03:00"],
  ["Delete NID images after 30 days", "scheduled", 0, "Daily 03:30"],
  ["Hostel invoices", "scheduled", 0, "1st of month"],
  ["Search index", "running", 12, "1.1 s"],
];

export const integrations = [
  {
    name: "Porichoy NID check",
    what: "Checks NID and face match",
    status: "Degraded",
    icon: "id",
    last: "2 min ago",
    calls: "1,320 today",
  },
  {
    name: "Firebase Cloud Messaging",
    what: "Push notices to Android and iOS",
    status: "Connected",
    icon: "bell",
    last: "Just now",
    calls: "84k today",
  },
  {
    name: "SSL Wireless SMS",
    what: "Sign-in codes and SMS campaigns",
    status: "Connected",
    icon: "sms",
    last: "1 min ago",
    calls: "6,410 today",
  },
  {
    name: "bKash Payments",
    what: "Hostel plan payments only",
    status: "Connected",
    icon: "pay",
    last: "1 hr ago",
    calls: "14 today",
  },
  {
    name: "Google Maps",
    what: "Living Map and area search",
    status: "Connected",
    icon: "map",
    last: "Just now",
    calls: "210k today",
  },
  {
    name: "Slack",
    what: "P1 safety alerts to #trust-safety",
    status: "Connected",
    icon: "chat",
    last: "12 min ago",
    calls: "9 today",
  },
  {
    name: "Sentry",
    what: "App crash reports",
    status: "Not connected",
    icon: "bug",
    last: "\u2014",
    calls: "\u2014",
  },
];

export const apiKeys = [
  {
    name: "Mobile app (prod)",
    key: "msk_live_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20227c21",
    scope: "Mobile API",
    created: "1 Jun 2026",
    last: "Just now",
    by: "Sabbir Ahmed",
  },
  {
    name: "Business web (prod)",
    key: "msk_live_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022a90e",
    scope: "Business API",
    created: "1 Jun 2026",
    last: "Just now",
    by: "Sabbir Ahmed",
  },
  {
    name: "DIU student check",
    key: "msk_live_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20223f44",
    scope: "Partner: student check only",
    created: "12 Aug 2026",
    last: "2 hrs ago",
    by: "Farah Kabir",
  },
  {
    name: "Staging tests",
    key: "msk_test_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20220b18",
    scope: "All (staging)",
    created: "3 Nov 2026",
    last: "Yesterday",
    by: "Rony Das",
  },
];

export const webhooks = [
  {
    url: "https://hooks.slack.com/services/\u2026/trust",
    events: "case.p1.opened, alert.high",
    ok: 99.8,
    last: "12 min ago",
  },
  {
    url: "https://partners.diu.edu.bd/mystay/students",
    events: "student.verified",
    ok: 100,
    last: "2 hrs ago",
  },
];

export const experiments = [
  {
    id: "EXP-12",
    name: "Seat request button text",
    app: "Mobile",
    status: "Running",
    split: "50/50",
    metric: "Seat requests per listing view",
    a: ["Request a seat", 4.1],
    b: ["Ask for a seat", 4.9],
    conf: 94,
    days: 9,
  },
  {
    id: "EXP-11",
    name: "Show Stay Level on hostel cards",
    app: "Mobile",
    status: "Running",
    split: "50/50",
    metric: "Hostels that give discounts",
    a: ["Hidden", 66],
    b: ["Shown", 71],
    conf: 81,
    days: 14,
  },
  {
    id: "EXP-09",
    name: "Guardian prompt after move-in",
    app: "Mobile",
    status: "Shipped B",
    split: "\u2014",
    metric: "Guardians added in 7 days",
    a: ["No prompt", 22],
    b: ["Prompt", 38],
    conf: 99,
    days: 21,
  },
  {
    id: "EXP-08",
    name: "Rent record reminder on the 8th",
    app: "Business web",
    status: "Stopped",
    split: "\u2014",
    metric: "Months marked by the 10th",
    a: ["No reminder", 71],
    b: ["Reminder", 72],
    conf: 40,
    days: 30,
  },
];

export const messageTemplates = [
  {
    id: "otp",
    name: "Sign-in code",
    ch: "SMS",
    lang: "EN + BN",
    vars: ["code"],
    body: "Your MyStay ID code is {code}. Never share it.",
    sent: "6.4k/day",
    status: "Live",
  },
  {
    id: "verified",
    name: "Living ID ready",
    ch: "Push",
    lang: "EN + BN",
    vars: ["first_name"],
    body: "{first_name}, your Living ID is verified. Show it at any MyStay hostel.",
    sent: "820/day",
    status: "Live",
  },
  {
    id: "seat",
    name: "Seat reserved",
    ch: "Push",
    lang: "EN + BN",
    vars: ["hostel", "seat", "date"],
    body: "{hostel} reserved seat {seat} for you. Move in on {date}.",
    sent: "110/day",
    status: "Live",
  },
  {
    id: "report",
    name: "A hostel reported you",
    ch: "Push + Email",
    lang: "EN + BN",
    vars: ["type", "days"],
    body: "A hostel filed a \u201C{type}\u201D report. You have {days} days to reply in the app.",
    sent: "4/day",
    status: "Live",
  },
  {
    id: "police",
    name: "Your data was shared with police",
    ch: "Email",
    lang: "EN",
    vars: ["agency", "fields"],
    body: "Under a lawful request from {agency}, we shared: {fields}.",
    sent: "Rare",
    status: "Needs Bangla",
  },
  {
    id: "plan",
    name: "Plan payment failed",
    ch: "Email",
    lang: "EN",
    vars: ["hostel", "amount"],
    body: "We could not take {amount} for {hostel}. Update your bKash or card.",
    sent: "1/day",
    status: "Live",
  },
];

export const privacyRequests = [
  {
    id: "DR-220",
    uid: "u29",
    type: "Delete my account",
    got: "20 Nov",
    due: "20 Dec",
    status: "Waiting for approval",
    note: "No open police case",
  },
  {
    id: "DR-219",
    uid: "u6",
    type: "Copy of my data",
    got: "19 Nov",
    due: "19 Dec",
    status: "Ready to send",
    note: "Export built: 14 files",
  },
  {
    id: "DR-214",
    uid: "u33",
    type: "Delete my account",
    got: "12 Nov",
    due: "12 Dec",
    status: "On hold (police case)",
    note: "GD 1184/26 open",
  },
  {
    id: "DR-209",
    uid: "u10",
    type: "Fix my details",
    got: "6 Nov",
    due: "6 Dec",
    status: "Done",
    note: "University name corrected",
  },
];

export const notifications = [
  {
    id: "n1",
    kind: "mention",
    who: "Mitu Akter",
    text: "mentioned you on CS-1048: \u201CSabbir, can you approve removing the Sep report?\u201D",
    when: "8 min ago",
    unread: true,
  },
  {
    id: "n2",
    kind: "system",
    who: "System",
    text: "NID check provider is slow. Incident INC-31 opened.",
    when: "1 hr ago",
    unread: true,
  },
  {
    id: "n3",
    kind: "approval",
    who: "Nadia Rahman",
    text: "asked for a second approval: release data to police (LR-0139).",
    when: "2 hrs ago",
    unread: true,
  },
  {
    id: "n4",
    kind: "system",
    who: "Rule R-01",
    text: "held 5 accounts made from one phone.",
    when: "Yesterday",
    unread: false,
  },
  {
    id: "n5",
    kind: "mention",
    who: "Imran Chowdhury",
    text: "assigned you CS-1036 (price jump).",
    when: "Yesterday",
    unread: false,
  },
];

export const adminSessions = [
  {
    who: "Sabbir Ahmed",
    device: "MacBook Pro \xB7 Chrome",
    ip: "103.112.54.18",
    where: "Dhaka (office)",
    when: "Now",
    current: true,
  },
  {
    who: "Sabbir Ahmed",
    device: "iPhone 15 \xB7 Safari",
    ip: "37.111.202.9",
    where: "Dhaka",
    when: "3 hrs ago",
  },
  {
    who: "Mitu Akter",
    device: "ThinkPad \xB7 Edge",
    ip: "103.112.54.21",
    where: "Dhaka (office)",
    when: "Now",
  },
  {
    who: "Farah Kabir",
    device: "Windows \xB7 Chrome",
    ip: "119.30.41.77",
    where: "Chattogram",
    when: "Yesterday",
    flag: "New city",
  },
];

export const notesStore = {};

export const userFilters = [
  ["all", "All users"],
  ["unverified", "Not verified"],
  ["reported", "Has a report"],
  ["looking", "Students still looking"],
  ["l3", "Level 3"],
];
