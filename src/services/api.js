import { storage } from "./storage";
import {
  seedUsers,
  seedMenu,
  seedOrders,
  seedReservations,
} from "../data/seed";

const KEYS = {
  USERS: "users",
  MENU: "menu",
  ORDERS: "orders",
  RESERVATIONS: "reservations",
};

// ---- Helpers ----
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));
const uid = (prefix) =>
  `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function load(key, seed) {
  const existing = storage.read(key);
  if (existing) return existing;
  storage.write(key, seed);
  return seed;
}

function save(key, value) {
  storage.write(key, value);
  return value;
}

// ---- Bootstrap ----
load(KEYS.USERS, seedUsers);
load(KEYS.MENU, seedMenu);
load(KEYS.ORDERS, seedOrders);
load(KEYS.RESERVATIONS, seedReservations);

// ==========================================================
export const api = {
  // ---- USERS ----
  async getUsers() {
    await delay();
    return load(KEYS.USERS, seedUsers);
  },

  async login(email, pin) {
    await delay(400);
    const users = load(KEYS.USERS, seedUsers);
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.pin === pin,
    );
    if (!user) throw new Error("Invalid email or PIN");
    const safe = { ...user };
    delete safe.pin;
    return safe;
  },

  async createUser(payload) {
    await delay();
    const users = load(KEYS.USERS, seedUsers);
    const exists = users.some(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase(),
    );
    if (exists) throw new Error("Email already exists");
    const newUser = { ...payload, id: uid("u") };
    save(KEYS.USERS, [...users, newUser]);
    const safe = { ...newUser };
    delete safe.pin;
    return safe;
  },

  async updateUser(id, patch) {
    await delay();
    const users = load(KEYS.USERS, seedUsers);
    // If email is changing, ensure it's not taken by someone else
    if (patch.email) {
      const taken = users.some(
        (u) =>
          u.id !== id && u.email.toLowerCase() === patch.email.toLowerCase(),
      );
      if (taken) throw new Error("Email already in use");
    }
    const next = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
    save(KEYS.USERS, next);
    const updated = next.find((u) => u.id === id);
    const safe = { ...updated };
    delete safe.pin;
    return safe;
  },

  async deleteUser(id) {
    await delay();
    const users = load(KEYS.USERS, seedUsers);
    save(
      KEYS.USERS,
      users.filter((u) => u.id !== id),
    );
    return true;
  },

  // ---- MENU ----
  async getMenu() {
    await delay();
    return load(KEYS.MENU, seedMenu);
  },

  async createMenuItem(item) {
    await delay();
    const menu = load(KEYS.MENU, seedMenu);
    const newItem = {
      ...item,
      id: uid("m"),
      available: item.available ?? true,
    };
    save(KEYS.MENU, [...menu, newItem]);
    return newItem;
  },

  async updateMenuItem(id, patch) {
    await delay();
    const menu = load(KEYS.MENU, seedMenu);
    const next = menu.map((m) => (m.id === id ? { ...m, ...patch } : m));
    save(KEYS.MENU, next);
    return next.find((m) => m.id === id);
  },

  async deleteMenuItem(id) {
    await delay();
    const menu = load(KEYS.MENU, seedMenu);
    save(
      KEYS.MENU,
      menu.filter((m) => m.id !== id),
    );
    return true;
  },

  // ---- ORDERS ----
  async getOrders() {
    await delay();
    return load(KEYS.ORDERS, seedOrders);
  },

  async createOrder({ waiterId, items }) {
    await delay();
    const orders = load(KEYS.ORDERS, seedOrders);

    const order = {
      id: uid("o"),
      waiterId,
      status: "pending",
      createdAt: new Date().toISOString(),
      items: items.map((it) => ({
        id: uid("i"),
        menuItemId: it.menuItemId,
        name: it.name,
        price: it.price,
        qty: it.qty,
        notes: it.notes || "",
        status: "pending",
      })),
    };

    save(KEYS.ORDERS, [...orders, order]);
    return order;
  },

  async updateOrder(id, patch) {
    await delay();
    const orders = load(KEYS.ORDERS, seedOrders);
    const next = orders.map((o) => (o.id === id ? { ...o, ...patch } : o));
    save(KEYS.ORDERS, next);
    return next.find((o) => o.id === id);
  },

  async updateOrderItemStatus(orderId, itemId, status) {
    await delay();
    const orders = load(KEYS.ORDERS, seedOrders);

    const next = orders.map((o) => {
      if (o.id !== orderId) return o;
      const items = o.items.map((it) =>
        it.id === itemId ? { ...it, status } : it,
      );

      const allServed = items.every((it) => it.status === "served");
      const anyProgress = items.some(
        (it) => it.status === "preparing" || it.status === "ready",
      );
      const orderStatus = allServed
        ? "served"
        : anyProgress
          ? "preparing"
          : "pending";

      return { ...o, items, status: orderStatus };
    });

    save(KEYS.ORDERS, next);
    return next.find((o) => o.id === orderId);
  },

  async payOrder(orderId) {
    await delay();
    const orders = load(KEYS.ORDERS, seedOrders);
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");

    const next = orders.map((o) =>
      o.id === orderId ? { ...o, status: "paid" } : o,
    );
    save(KEYS.ORDERS, next);
    return { ...order, status: "paid" };
  },

  // ---- RESERVATIONS ----
  async getReservations() {
    await delay();
    return load(KEYS.RESERVATIONS, seedReservations);
  },

  async createReservation(res) {
    await delay();
    const reservations = load(KEYS.RESERVATIONS, seedReservations);
    const newRes = {
      ...res,
      id: uid("r"),
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    save(KEYS.RESERVATIONS, [...reservations, newRes]);
    return newRes;
  },

  async updateReservation(id, patch) {
    await delay();
    const reservations = load(KEYS.RESERVATIONS, seedReservations);
    const next = reservations.map((r) =>
      r.id === id ? { ...r, ...patch } : r,
    );
    save(KEYS.RESERVATIONS, next);
    return next.find((r) => r.id === id);
  },

  async deleteReservation(id) {
    await delay();
    const reservations = load(KEYS.RESERVATIONS, seedReservations);
    save(
      KEYS.RESERVATIONS,
      reservations.filter((r) => r.id !== id),
    );
    return true;
  },
  // ---- DEV ----
  async resetDemoData() {
    await delay(300);
    storage.clearAll();
    load(KEYS.USERS, seedUsers);
    load(KEYS.MENU, seedMenu);
    load(KEYS.ORDERS, seedOrders);
    load(KEYS.RESERVATIONS, seedReservations);
    return true;
  },
};
