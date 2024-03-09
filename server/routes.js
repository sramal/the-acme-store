const {
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    createFavorite,
    destroyFavorite,
} = require("./db");

module.exports = (app) => {
    app.get("/api/users", async (req, res, next) => {
        try {
            res.send(await fetchUsers());
        } catch (error) {
            next(error);
        }
    });

    app.get("/api/products", async (req, res, next) => {
        try {
            res.send(await fetchProducts());
        } catch (error) {
            next(error);
        }
    });

    app.get("/api/users/:id/favorites", async (req, res, next) => {
        try {
            res.send(await fetchFavorites(req.params.id));
        } catch (error) {
            next(error);
        }
    });

    app.post("/api/users/:id/favorites", async (req, res, next) => {
        try {
            res.status(201).send(
                await createFavorite(req.params.id, req.body.product_id)
            );
        } catch (error) {
            next(error);
        }
    });

    app.delete(
        "/api/users/:user_id/favorites/:product_id",
        async (req, res, next) => {
            try {
                await destroyFavorite(
                    req.params.user_id,
                    req.params.product_id
                );
                res.sendStatus(204);
            } catch (error) {
                next(error);
            }
        }
    );
};
