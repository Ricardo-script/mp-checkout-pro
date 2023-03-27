const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");

// Substitua pelo seu token de acesso disponével em: https://www.mercadopago.com.br/settings/account/credentials
mercadopago.configure({
    access_token: 'TEST-5158492697682358-032410-9e00790590dc0ae715eb8f2d8175a29b-177793268', //ACCESS_TOKEN
});


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("../client"));
app.use(cors());
app.get("/", function (req, res) {
    res.status(200).sendFile("index.html");
});

app.post("/create_preference", (req, res) => {

    let preference = {
        items: [
            {
                title: req.body.description,
                unit_price: Number(req.body.price),
                quantity: Number(req.body.quantity),
            }
        ],
        back_urls: {
            "success": "http://localhost:80/feedback", // criar aqruivo feedback
            "failure": "http://localhost:80/feedback",
            "pending": "http://localhost:80/feedback"
        },
        auto_return: "approved",
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
            res.json({
                id: response.body.id
            });
        }).catch(function (error) {
            console.log(error);
        });
});

app.get('/feedback', function (req, res) {
    res.json({
        Payment: req.query.payment_id,
        Status: req.query.status,
        MerchantOrder: req.query.merchant_order_id
    });
});

app.listen(80, () => {
    console.log("Server running in port 80");
});
