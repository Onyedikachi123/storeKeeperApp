import * as SQLite from 'expo-sqlite';

export type Product = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  imageUri?: string | null;
};

// ✅ Create database instance asynchronously
const dbPromise = SQLite.openDatabaseAsync('products.db');

export const init = async (): Promise<void> => {
  const db = await dbPromise;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      imageUri TEXT
    );
  `);
};

export const insertProduct = async (
  name: string,
  quantity: number,
  price: number,
  imageUri?: string | null
): Promise<void> => {
  const db = await dbPromise;
  await db.runAsync(
    `INSERT INTO products (name, quantity, price, imageUri) VALUES (?, ?, ?, ?);`,
    [name, quantity, price, imageUri ?? null]
  );
};

export const fetchProducts = async (): Promise<Product[]> => {
  const db = await dbPromise;
  const results = await db.getAllAsync<Product>(`SELECT * FROM products;`);
  return results;
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const db = await dbPromise;
  const result = await db.getFirstAsync<Product>(
    `SELECT * FROM products WHERE id = ?;`,
    [id]
  );
  if (!result) throw new Error('Product not found');
  return result;
};

export const updateProduct = async (
  id: number,
  name: string,
  quantity: number,
  price: number,
  imageUri?: string | null
): Promise<void> => {
  const db = await dbPromise;
  await db.runAsync(
    `UPDATE products SET name = ?, quantity = ?, price = ?, imageUri = ? WHERE id = ?;`,
    [name, quantity, price, imageUri ?? null, id]
  );
};

export const deleteProduct = async (id: number): Promise<void> => {
  const db = await dbPromise;
  await db.runAsync(`DELETE FROM products WHERE id = ?;`, [id]);
};
