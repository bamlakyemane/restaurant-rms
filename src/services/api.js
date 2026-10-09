import { storage } from './storage'
import {
  seedUsers, seedMenu, seedTables, seedOrders, seedReservations,
} from '../data/seed'

const KEYS = {
  USERS: 'users',
  MENU: 'menu',
  TABLES: 'tables',
  ORDERS: 'orders',
  RESERVATIONS: 'reservations',
}

// ---- Helpers ----
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))
const uid = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/** Loads from storage; falls back to seed and persists it on first run. */
function load(key, seed) {
  const existing = storage.read(key)
  if (existing) return existing
  storage.write(key, seed)
  return seed
}

/** Persist a collection. */
function save(key, value) {
  storage.write(key, value)
  return value
}

// ---- Seed bootstrap (run once at import) ----
load(KEYS.USERS, seedUsers)
load(KEYS.MENU, seedMenu)
load(KEYS.TABLES, seedTables)
load(KEYS.ORDERS, seedOrders)
load(KEYS.RESERVATIONS, seedReservations)

// ==========================================================
// USERS
// ==========================================================
export const api = {
  async getUsers() {
    await delay()
    return load(KEYS.USERS, seedUsers)
  },

  async login(email, pin) {
    await delay(400)
    const users = load(KEYS.USERS, seedUsers)
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.pin === pin
    )
    if (!user) throw new Error('Invalid email or PIN')
    const { pin: _omit, ...safe } = user
    return safe
  },

  // ==========================================================
  // MENU
  // ==========================================================
  async getMenu() {
    await delay()
    return load(KEYS.MENU, seedMenu)
  },

  async createMenuItem(item) {
    await delay()
    const menu = load(KEYS.MENU, seedMenu)
    const newItem = { ...item, id: uid('m'), available: item.available ?? true }
    const next = [...menu, newItem]
    save(KEYS.MENU, next)
    return newItem
  },

  async updateMenuItem(id, patch) {
    await delay()
    const menu = load(KEYS.MENU, seedMenu)
    const next = menu.map((m) => (m.id === id ? { ...m, ...patch } : m))
    save(KEYS.MENU, next)
    return next.find((m) => m.id === id)
  },

  async deleteMenuItem(id) {
    await delay()
    const menu = load(KEYS.MENU, seedMenu)
    const next = menu.filter((m) => m.id !== id)
    save(KEYS.MENU, next)
    return true
  },

  // ==========================================================
  // TABLES
  // ==========================================================
  async getTables() {
    await delay()
    return load(KEYS.TABLES, seedTables)
  },

  async updateTable(id, patch) {
    await delay()
    const tables = load(KEYS.TABLES, seedTables)
    const next = tables.map((t) => (t.id === id ? { ...t, ...patch } : t))
    save(KEYS.TABLES, next)
    return next.find((t) => t.id === id)
  },

  // ==========================================================
  // ORDERS
  // ==========================================================
  async getOrders() {
    await delay()
    return load(KEYS.ORDERS, seedOrders)
  },

  async createOrder({ tableId, waiterId, items }) {
    await delay()
    const orders = load(KEYS.ORDERS, seedOrders)

    const order = {
      id: uid('o'),
      tableId,
      waiterId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      items: items.map((it) => ({
        id: uid('i'),
        menuItemId: it.menuItemId,
        name: it.name,
        price: it.price,
        qty: it.qty,
        notes: it.notes || '',
        status: 'pending',
      })),
    }

    const nextOrders = [...orders, order]
    save(KEYS.ORDERS, nextOrders)

    // Mark the table as occupied and link the order
    const tables = load(KEYS.TABLES, seedTables)
    save(
      KEYS.TABLES,
      tables.map((t) =>
        t.id === tableId ? { ...t, status: 'occupied', currentOrderId: order.id } : t
      )
    )

    return order
  },

  async updateOrder(id, patch) {
    await delay()
    const orders = load(KEYS.ORDERS, seedOrders)
    const next = orders.map((o) => (o.id === id ? { ...o, ...patch } : o))
    save(KEYS.ORDERS, next)
    return next.find((o) => o.id === id)
  },

  async updateOrderItemStatus(orderId, itemId, status) {
    await delay()
    const orders = load(KEYS.ORDERS, seedOrders)

    const next = orders.map((o) => {
      if (o.id !== orderId) return o
      const items = o.items.map((it) => (it.id === itemId ? { ...it, status } : it))

      // Derive order status from items
      const allServed = items.every((it) => it.status === 'served')
      const anyPreparing = items.some((it) => it.status === 'preparing' || it.status === 'ready')
      const orderStatus = allServed ? 'served' : anyPreparing ? 'preparing' : 'pending'

      return { ...o, items, status: orderStatus }
    })

    save(KEYS.ORDERS, next)
    return next.find((o) => o.id === orderId)
  },

  async payOrder(orderId) {
    await delay()
    const orders = load(KEYS.ORDERS, seedOrders)
    const order = orders.find((o) => o.id === orderId)
    if (!order) throw new Error('Order not found')

    const next = orders.map((o) => (o.id === orderId ? { ...o, status: 'paid' } : o))
    save(KEYS.ORDERS, next)

    // Free the table
    const tables = load(KEYS.TABLES, seedTables)
    save(
      KEYS.TABLES,
      tables.map((t) =>
        t.currentOrderId === orderId ? { ...t, status: 'free', currentOrderId: null } : t
      )
    )

    return { ...order, status: 'paid' }
  },

  // ==========================================================
  // RESERVATIONS
  // ==========================================================
  async getReservations() {
    await delay()
    return load(KEYS.RESERVATIONS, seedReservations)
  },

  async createReservation(res) {
    await delay()
    const reservations = load(KEYS.RESERVATIONS, seedReservations)
    const newRes = { ...res, id: uid('r'), status: 'confirmed' }
    save(KEYS.RESERVATIONS, [...reservations, newRes])
    return newRes
  },

  // ==========================================================
  // DEV
  // ==========================================================
  async resetDemoData() {
    await delay(300)
    storage.clearAll()
    load(KEYS.USERS, seedUsers)
    load(KEYS.MENU, seedMenu)
    load(KEYS.TABLES, seedTables)
    load(KEYS.ORDERS, seedOrders)
    load(KEYS.RESERVATIONS, seedReservations)
    return true
  },
}