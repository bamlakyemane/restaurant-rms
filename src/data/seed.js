// ---- Users ----
export const seedUsers = [
  { id: 'u1', name: 'Alice Admin',  email: 'admin@rms.dev',  role: 'admin',  pin: '1111', avatar: '👩‍💼' },
  { id: 'u2', name: 'Willy Waiter', email: 'waiter@rms.dev', role: 'waiter', pin: '2222', avatar: '🧑‍🍳' },
  { id: 'u3', name: 'Chef Chris',   email: 'chef@rms.dev',   role: 'chef',   pin: '3333', avatar: '👨‍🍳' },
]

// ---- Menu ----
export const seedMenu = [
  { id: 'm1',  name: 'Garlic Bread',        category: 'Starters', price: 4.50,  description: 'Toasted baguette with garlic butter',       available: true,  prepTime: 5,  image: '🥖' },
  { id: 'm2',  name: 'Bruschetta',          category: 'Starters', price: 6.00,  description: 'Tomato, basil, olive oil on toast',         available: true,  prepTime: 7,  image: '🍅' },
  { id: 'm3',  name: 'Caesar Salad',        category: 'Starters', price: 7.50,  description: 'Romaine, parmesan, croutons',               available: true,  prepTime: 8,  image: '🥗' },
  { id: 'm4',  name: 'Margherita Pizza',    category: 'Mains',    price: 11.00, description: 'Tomato, mozzarella, basil',                 available: true,  prepTime: 15, image: '🍕' },
  { id: 'm5',  name: 'Spaghetti Carbonara', category: 'Mains',    price: 13.50, description: 'Eggs, pecorino, guanciale, pepper',         available: true,  prepTime: 18, image: '🍝' },
  { id: 'm6',  name: 'Grilled Salmon',      category: 'Mains',    price: 18.00, description: 'With lemon butter sauce',                   available: true,  prepTime: 22, image: '🐟' },
  { id: 'm7',  name: 'Beef Burger',         category: 'Mains',    price: 14.00, description: 'Angus beef, cheddar, house sauce',          available: true,  prepTime: 20, image: '🍔' },
  { id: 'm8',  name: 'Tiramisu',            category: 'Desserts', price: 6.50,  description: 'Classic Italian coffee dessert',            available: true,  prepTime: 5,  image: '🍰' },
  { id: 'm9',  name: 'Chocolate Lava Cake', category: 'Desserts', price: 7.00,  description: 'Warm cake with molten center',              available: false, prepTime: 12, image: '🍫' },
  { id: 'm10', name: 'Coca-Cola',           category: 'Drinks',   price: 2.50,  description: 'Chilled, 330ml can',                        available: true,  prepTime: 1,  image: '🥤' },
  { id: 'm11', name: 'Fresh Orange Juice',  category: 'Drinks',   price: 4.00,  description: 'Squeezed to order',                         available: true,  prepTime: 3,  image: '🍊' },
  { id: 'm12', name: 'Espresso',            category: 'Drinks',   price: 2.80,  description: 'Single shot, Italian roast',                available: true,  prepTime: 2,  image: '☕' },
]

// ---- Tables ----
export const seedTables = [
  { id: 't1',  number: 1,  seats: 2, zone: 'Window', status: 'free',     currentOrderId: null },
  { id: 't2',  number: 2,  seats: 2, zone: 'Window', status: 'occupied', currentOrderId: 'o1' },
  { id: 't3',  number: 3,  seats: 4, zone: 'Main',   status: 'free',     currentOrderId: null },
  { id: 't4',  number: 4,  seats: 4, zone: 'Main',   status: 'occupied', currentOrderId: 'o2' },
  { id: 't5',  number: 5,  seats: 6, zone: 'Main',   status: 'reserved', currentOrderId: null },
  { id: 't6',  number: 6,  seats: 4, zone: 'Patio',  status: 'free',     currentOrderId: null },
  { id: 't7',  number: 7,  seats: 4, zone: 'Patio',  status: 'free',     currentOrderId: null },
  { id: 't8',  number: 8,  seats: 8, zone: 'Private',status: 'free',     currentOrderId: null },
]

// ---- Orders ----
// items[].status: 'pending' | 'preparing' | 'ready' | 'served'
export const seedOrders = [
  {
    id: 'o1',
    tableId: 't2',
    waiterId: 'u2',
    status: 'preparing',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    items: [
      { id: 'i1', menuItemId: 'm4', name: 'Margherita Pizza',    price: 11.00, qty: 2, notes: 'Extra basil', status: 'preparing' },
      { id: 'i2', menuItemId: 'm10', name: 'Coca-Cola',          price: 2.50,  qty: 2, notes: '',            status: 'served'    },
    ],
  },
  {
    id: 'o2',
    tableId: 't4',
    waiterId: 'u2',
    status: 'pending',
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    items: [
      { id: 'i3', menuItemId: 'm6', name: 'Grilled Salmon',      price: 18.00, qty: 1, notes: 'No lemon',    status: 'pending' },
      { id: 'i4', menuItemId: 'm3', name: 'Caesar Salad',        price: 7.50,  qty: 1, notes: '',            status: 'pending' },
    ],
  },
]

// ---- Reservations ----
export const seedReservations = [
  {
    id: 'r1',
    customerName: 'John Doe',
    phone: '+1 555 0100',
    guests: 4,
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    time: '19:30',
    tableId: 't5',
    status: 'confirmed',
  },
]