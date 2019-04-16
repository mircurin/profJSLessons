const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const moment = require("moment");

const app = express();

app.use(express.static("./public"));
app.use(bodyParser.json());

app.get("/products", (req, res) => {
    fs.readFile("./db/products.json", "utf-8", (err, data) => {
        if(err) {
            return console.log(err);
        }

        res.send(data);
    });
});

app.use("/cart", (req, res, next) => {
    if(["POST", "PATCH", "DELETE"].includes(req.method)) {
        const mapping = {
            POST: "Added",
            PATCH: "Editing",
            DELETE: "Remove",
        };
        fs.readFile("./db/stats.json", "utf-8", (err, data) => {
            const stats = JSON.parse(data);
            switch (req.method){
                case "POST":
                    stats.push({
                        action: mapping[req.method],
                        name: req.body.name,
                        timestamp: moment().format(),
                    });
                    fs.writeFile("./db/stats.json", JSON.stringify(stats));
                    break;
                case "PATCH":
                case "DELETE":
                  const [, id] = req.url.split("/");
                    fs.readFile("./db/products.json", "utf-8", (err, data) => {
                        const products = JSON.parse(data);
                        const product = products.find((item) => item.id === +id);
                        stats.push({
                            action: mapping[req.method],
                            name: product.name,
                            timestamp: moment().format(),
                        });
                        fs.writeFile("./db/stats.json", JSON.stringify(stats));
                    });
            }
        });
    }
    next();
});

app.get("/cart", (req, res) => {
    fs.readFile("./db/cart.json", "utf-8", (err, data) => {
        if(err) {
            return console.log(err);
        }

        res.send(data);
    });
});

app.post("/cart", (req, res) => {
    fs.readFile("./db/cart.json", "utf-8", (err, data) => {
        if(err) {
            return console.log(err);
        }

        const cart = JSON.parse(data);
        cart.push(req.body);

        fs.writeFile("./db/cart.json", JSON.stringify(cart), (err) => {
            if(err) {
                return console.log(err);
            }

            res.send(req.body);
        });
    });
});

app.patch("/cart/:id", (req, res) => {
    fs.readFile("./db/cart.json", "utf-8", (err, data) => {
        if(err) {
            return console.log(err);
        }

        let cart = JSON.parse(data);

        cart = cart.map((item) => {
            if(item.id === +req.params.id) {
                return { ...item, ...req.body };
            }

            return item;
        });

        fs.writeFile("./db/cart.json", JSON.stringify(cart), (err) => {
            if(err) {
                return console.log(err);
            }

            res.send(cart.find((item) => item.id === +req.params.id));
        });
    });
});

app.delete("/cart/:id", (req, res) => {
    fs.readFile("./db/cart.json", "utf-8", (err, data) => {
        if(err) {
            return console.log(err);
        }

        let cart = JSON.parse(data);
        const deleted = cart.find((item) => item.id !== +req.params.id);
        cart = cart.filter((item) => item.id !== +req.params.id);

        fs.writeFile("./db/cart.json", JSON.stringify(cart), (err) => {
            if(err) {
                return console.log(err);
            }

            res.send(deleted);
        });
    });
});

app.listen(3000, () => {
    console.log("Server has been started!");
});