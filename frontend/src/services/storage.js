const NS = "tm_v1";

function read() {
  try {
    return JSON.parse(localStorage.getItem(NS)) || null;
  } catch {
    return null;
  }
}

function write(data) {
  localStorage.setItem(NS, JSON.stringify(data));
}

export function getDB() {
  let db = read();
  if (!db) {
    db = seed();
    write(db);
  }
  return db;
}

export function setDB(db) {
  write(db);
}

function seed() {
  const now = new Date().toISOString();
  return {
    session: null,
    users: [
      // demo user
      {
        id: 1,
        name: "Demo User",
        email: "demo@demo.com",
        password_hash: "demo", // mock saja
        created_at: now,
      },
    ],
    categories: [
      { id: 1, user_id: 1, name: "Personal", created_at: now },
      { id: 2, user_id: 1, name: "Work", created_at: now },
    ],
    statuses: [
      { id: 1, name: "Todo" },
      { id: 2, name: "Doing" },
      { id: 3, name: "Done" },
    ],
    priorities: [
      { id: 1, name: "Low" },
      { id: 2, name: "Medium" },
      { id: 3, name: "High" },
    ],
    tasks: [
      {
        id: 1,
        user_id: 1,
        category_id: 2,
        status_id: 1,
        priority_id: 2,
        title: "First task",
        description: "This is a seeded task",
        due_date: null,
        created_at: now,
        updated_at: now,
      },
    ],
    counters: {
      user: 1,
      category: 2,
      task: 1,
    },
  };
}

export function nextId(type) {
  const db = getDB();
  db.counters[type] = (db.counters[type] || 0) + 1;
  setDB(db);
  return db.counters[type];
}
