/* =========================================================
   CampusEvents — Data Layer (localStorage "database")
   ========================================================= */

const EVENTS_KEY = "campusEvents_events";
const REGS_KEY = "campusEvents_regs";

const SEED_EVENTS = [
  {
    id: "evt001",
    title: "TechSpark National Symposium",
    category: "Technical",
    date: "2026-06-20",
    time: "09:30 AM",
    venue: "Main Auditorium, Block A",
    seats: 150,
    icon: "💻",
    description:
      "A flagship technical symposium featuring paper presentations, coding contests, and talks on AI, cloud computing, and emerging technologies. Open to all engineering departments."
  },
  {
    id: "evt002",
    title: "Web Development Bootcamp",
    category: "Workshop",
    date: "2026-06-25",
    time: "10:00 AM",
    venue: "Computer Lab 3, IT Block",
    seats: 60,
    icon: "🛠️",
    description:
      "A hands-on, full-day workshop covering HTML, CSS, JavaScript and modern frameworks. Participants will build and deploy a mini project by the end of the session."
  },
  {
    id: "evt003",
    title: "Rhythms — Cultural Fest Night",
    category: "Cultural",
    date: "2026-07-02",
    time: "06:00 PM",
    venue: "Open Air Theatre",
    seats: 400,
    icon: "🎭",
    description:
      "An evening of music, dance and drama performances by students from across the college. Food stalls and games will be open before the show begins."
  },
  {
    id: "evt004",
    title: "AI & Career Readiness Seminar",
    category: "Seminar",
    date: "2026-07-08",
    time: "11:00 AM",
    venue: "Seminar Hall 2",
    seats: 120,
    icon: "🎤",
    description:
      "Industry experts discuss how artificial intelligence is reshaping job roles and how students can prepare for careers in a rapidly changing tech landscape."
  },
  {
    id: "evt005",
    title: "Robotics Innovation Challenge",
    category: "Technical",
    date: "2026-07-12",
    time: "09:00 AM",
    venue: "Mechanical Workshop, Block C",
    seats: 80,
    icon: "🤖",
    description:
      "Teams design and build robots to compete in obstacle navigation and task-completion rounds. Prizes for the top three teams and best design award."
  },
  {
    id: "evt006",
    title: "Photography & Design Workshop",
    category: "Workshop",
    date: "2026-07-18",
    time: "02:00 PM",
    venue: "Media Lab, Block B",
    seats: 50,
    icon: "📸",
    description:
      "Learn the fundamentals of photography composition, lighting and basic photo editing with a professional photographer and design mentor."
  }
];

function generateId(prefix) {
  return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error("Error reading from storage:", err);
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Error writing to storage:", err);
  }
}

function seedDatabase() {
  if (localStorage.getItem(EVENTS_KEY) === null) {
    writeStore(EVENTS_KEY, SEED_EVENTS);
  }
  if (localStorage.getItem(REGS_KEY) === null) {
    writeStore(REGS_KEY, []);
  }
}
seedDatabase();

const DB = {
  /* ---------- EVENTS ---------- */
  getEvents() {
    return readStore(EVENTS_KEY, []).slice().sort((a, b) => a.date.localeCompare(b.date));
  },

  getEvent(id) {
    return this.getEvents().find(e => e.id === id) || null;
  },

  addEvent(data) {
    const events = readStore(EVENTS_KEY, []);
    const event = Object.assign({ id: generateId("evt") }, data);
    events.push(event);
    writeStore(EVENTS_KEY, events);
    return event;
  },

  updateEvent(id, data) {
    const events = readStore(EVENTS_KEY, []);
    const idx = events.findIndex(e => e.id === id);
    if (idx === -1) return null;
    events[idx] = Object.assign({}, events[idx], data, { id });
    writeStore(EVENTS_KEY, events);
    return events[idx];
  },

  deleteEvent(id) {
    let events = readStore(EVENTS_KEY, []);
    events = events.filter(e => e.id !== id);
    writeStore(EVENTS_KEY, events);

    // Also remove registrations tied to this event
    let regs = readStore(REGS_KEY, []);
    regs = regs.filter(r => r.eventId !== id);
    writeStore(REGS_KEY, regs);
  },

  /* ---------- REGISTRATIONS ---------- */
  getRegs() {
    return readStore(REGS_KEY, []).slice().sort((a, b) => (a.registeredAt < b.registeredAt ? 1 : -1));
  },

  addReg(data) {
    const regs = readStore(REGS_KEY, []);
    const reg = Object.assign(
      {
        id: generateId("REG"),
        registeredAt: new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      },
      data
    );
    regs.push(reg);
    writeStore(REGS_KEY, regs);
    return reg;
  },

  deleteReg(id) {
    let regs = readStore(REGS_KEY, []);
    regs = regs.filter(r => r.id !== id);
    writeStore(REGS_KEY, regs);
  },

  countRegsForEvent(eventId) {
    return readStore(REGS_KEY, []).filter(r => r.eventId === eventId).length;
  },

  seatsLeft(event) {
    const taken = this.countRegsForEvent(event.id);
    return Math.max(0, Number(event.seats) - taken);
  }
};
