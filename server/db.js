const pg = require("pg");
const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/acme_store_db"
);
const bcrypt = require("bcrypt");

const createTables = async () => {
    await client.query(`
        DROP TABLE IF EXISTS favorites;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS products;
        CREATE TABLE users(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            UNIQUE(username),
            UNIQUE(password)
        );
        CREATE TABLE products(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL
        );
        CREATE TABLE favorites(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) NOT NULL,
            product_id UUID REFERENCES products(id) NOT NULL,
            UNIQUE(user_id, product_id)
        );
    `);
};

const createUser = async (username, password) => {
    return (
        await client.query(
            `INSERT INTO users(username, password) VALUES($1, $2) RETURNING *;`,
            [username, await bcrypt.hash(password, 10)]
        )
    ).rows[0];
};

const fetchUsers = async () => {
    return (await client.query(`SELECT * FROM users;`)).rows;
};

const createProduct = async (name) => {
    return (
        await client.query(
            `INSERT INTO products(name) VALUES($1) RETURNING *;`,
            [name]
        )
    ).rows[0];
};

const fetchProducts = async () => {
    return (await client.query(`SELECT * FROM products;`)).rows;
};

const createFavorite = async (user_id, product_id) => {
    return (
        await client.query(
            `INSERT INTO favorites(user_id, product_id) VALUES($1, $2) RETURNING *;`,
            [user_id, product_id]
        )
    ).rows[0];
};

const fetchFavorites = async (user_id) => {
    return (
        await client.query(`SELECT * FROM favorites WHERE user_id = $1;`, [
            user_id,
        ])
    ).rows;
};

const destroyFavorite = async (user_id, product_id) => {
    await client.query(
        `DELETE FROM favorites WHERE user_id = $1 and product_id = $2;`,
        [user_id, product_id]
    );
};

module.exports = {
    client,
    createTables,
    createProduct,
    fetchProducts,
    createUser,
    fetchUsers,
    createFavorite,
    fetchFavorites,
    destroyFavorite,
};
