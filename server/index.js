const express = require("express");
const app = express();
app.use(require("morgan")("dev"));
app.use(express.json());
const PORT = process.env.PORT || 3000;

const {
    client,
    createTables,
    createUser,
    fetchUsers,
    createProduct,
    fetchProducts,
    createFavorite,
    fetchFavorites,
    destroyFavorite,
} = require("./db");

require("./routes")(app);

const init = async () => {
    try {
        await client.connect();
        await createTables();

        const [larry, curly, moe] = await Promise.all([
            createUser("larry", "larry-password"),
            createUser("curly", "curly-password"),
            createUser("moe", "moe-password"),
        ]);

        const [tv, car, candy] = await Promise.all([
            createProduct("tv"),
            createProduct("car"),
            createProduct("candy"),
        ]);

        const [f1, f2, f3] = await Promise.all([
            createFavorite(larry.id, tv.id),
            createFavorite(curly.id, car.id),
            createFavorite(moe.id, candy.id),
        ]);

        console.log("DB seeded");

        console.log(
            `curl -X POST http://localhost:3000/api/users/${larry.id}/favorites -H 'Content-Type:application/json' -d '{"product_id":"${car.id}"}'`
        );

        console.log(
            `curl -X DELETE http://localhost:3000/api/users/${larry.id}/favorites/${car.id}`
        );

        app.listen(PORT, () => {
            console.log(`Server started and listening on ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
};

init();
