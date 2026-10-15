import { existsSync } from 'node:fs';
const express = require("express");
import { v4 as uuidv4 } from 'uuid';
import { Express, Request, Response, NextFunction } from "express";
import jwt = require("jsonwebtoken");
import bodyParser = require('body-parser');

import multer = require('multer');
import moment = require("moment");
import { STATUS_CODES } from 'node:http';
import { Console } from 'node:console';

require("dotenv").config()
const { Pool } = require("pg");

// Should be loaded from file
//
const SECRET_TOKEN: string = "324FHH298FFY924T3H2938YH239HYT1038YH3298GH297GT239";

// Statuses returned to the front-end
//
enum status {
    INVALID_FORM = "INVALID_FORM",
    OKAY = "OKAY",
    NOT_AUTHORIZED = "NOT_AUTHORIZED",
    NOT_FOUND = "NOT FOUND",
    DB_CONNECTION_FAIL = "DB_CONNECTION_FAIL"
}

var app: Express = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(bodyParser.json());

const poolReq = {
    user: "postgres",
    host: "149.28.47.219",
    database: "grocerypal_fixed",
    password: "vDPFM4LVbz7MCxYD",//vDPFM4LVbz7MCxYD
    port: 5432,
}

// Multer config
//
var imgConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "/uploads");
    },
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`)
    }
})

// Img filter
//
const isImage = (req: Request, file: any, callback: any) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true)
    } else {
        callback(null, Error("only image is allowd"))
    }
}

var upload = multer({
    storage: imgConfig,
    fileFilter: isImage,
})

function generateAccessToken(user: any) {
    let token = jwt.sign(user, SECRET_TOKEN, { expiresIn: "200000s" });
    return token
}



// Middleware function to authorize token
//
function authToken(req: Request, res: Response, next: NextFunction) {

    let token = req.body.token;

    // Early return if no token
    //
    if (!token) {
        console.log("No token was provided in authToken()");
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_TOKEN, (err: any) => {
        if (err) {
            console.log("error verifying in authToken()");
            console.log(err.message);
            return res.sendStatus(403);
        }
        next();
    })

}



function isAdmin(req: Request, res: Response, next: NextFunction) {
    let token = req.body.token;

    // Early return if no token
    //
    if (!token) {
        console.log("Early return from isAdmin because no token was provided");
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_TOKEN, (err: any, decoded: any) => {
        if (err) {
            console.log(err.message);
            return res.sendStatus(403);
        }
        if (decoded.userrole === "admin") {
            next();
        }
        else {
            return res.sendStatus(403);
        }
    })
}

// --- Routes ---
//
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});



app.post('/login', async (req: Request, res: Response) => {

    const user = req.body.user;

    // Ensure all fields have been entered
    //
    if (!user.useremail ||
        !user.userpassword) {

        console.log("Error: /login")
        return res.json({ "token": "", "status": status.INVALID_FORM });
    }

    const pool = new Pool(poolReq);
    const query: string = 'SELECT * FROM public."users" WHERE useremail = $1'

    pool.query(query, [user.useremail])
        .then(async (results: any) => {

            // If the account exists and the password matches
            //
            if (results.rowCount === 1 &&
                await bcrypt.compare(
                    user.userpassword,
                    results.rows[0].userpassword)) {

                // User is verified
                //
                let token = generateAccessToken(results.rows[0]);

                return res.json({
                    "token": token,
                    "user": results.rows[0],
                    "status": status.OKAY
                });
            }
            else {

                console.log("Error: /login user not verified")
                return res.json({ "status": status.NOT_AUTHORIZED });
            }
        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});



app.get('/', (req: Request, res: Response) => {
    return res.send('Grocerypal Server');
});



app.post('/register', async (req: Request, res: Response) => {

    const user = req.body.user;

    // Ensure all fields have been entered
    //
    if (!user.userfname ||
        !user.userlname ||
        !user.useremail ||
        !user.userpassword) {

        console.log("Error: /register invalid form")
        return res.json({ "token": "", "status": status.INVALID_FORM });
    }

    const pool = new Pool(poolReq);
    const query: string = 'SELECT * FROM public."users" WHERE useremail = $1';
    const create_user: string = 'INSERT INTO public."users"' +
        'VALUES (DEFAULT, $1, $2, $3, $4, $5, DEFAULT)';
    const select_user_by_email: string = 'SELECT * FROM public."users"' +
        'WHERE useremail = $1';

    pool.query(query, [user.useremail])
        .then(async (results: any) => {

            // If the email is not used in an account already
            //
            if (results.rowCount === 0) {

                // Add new user to database
                //
                var hashedPassword = await bcrypt.hash(user.userpassword, 10);
                await pool.query(create_user, [
                    user.userfname,
                    user.userlname,
                    user.useremail,
                    hashedPassword,
                    "user"
                ]);

                let results = await pool.query(
                    select_user_by_email,
                    [user.useremail]
                );

                if (results.rowCount === 1) {

                    // Log the user in
                    //
                    let token = generateAccessToken(results.rows[0]);
                    return res.json({
                        "token": token,
                        "user": user,
                        "status": status.OKAY
                    });

                } else {
                    return res.json({
                        "user": user,
                        "status": status.NOT_FOUND
                    });
                }
            }
            else {

                // User is not verified
                //
                return res.json({ "status": status.NOT_AUTHORIZED });
            }
        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});

app.post('/get-users', isAdmin, async (req: Request, res: Response) => {

    const pool = new Pool(poolReq);
    pool.query('SELECT * FROM public."users"')
        .then(async (results: any) => {
            return res.json({
                users: results.rows
            });
        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});

app.post('/get-user/:id', authToken, async (req: Request, res: Response) => {

    const id = req.params.id;
    const pool = new Pool(poolReq);

    pool.query(`SELECT * FROM public."users" WHERE userid=${id};`)
        .then(async (results: any) => {
            return res.json(results.rows[0]);
        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});

app.post('/delete-user/:id', isAdmin, async (req: Request, res: Response) => {

    const id = req.params.id;
    const pool = new Pool(poolReq);

    pool.query(`DELETE FROM users WHERE userid=${id};`)
        .then(async (results: any) => {
            return res.json(results);
        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});

app.post('/clear-user-checkout-uuid/:id', authToken, async (req: Request, res: Response) => {
    const id = req.params.id;
    const pool = new Pool(poolReq);
    await pool.query(`UPDATE public."users" SET checkout_uuid=NULL WHERE userid = $1`, [id]);
    pool.end();
    res.json({ status: status.OKAY });
});

app.get('/inventory', async (req: Request, res: Response) => {

    const pool = new Pool(poolReq);

    pool.query('SELECT * FROM public."products" WHERE status=true ORDER BY name ASC')
        .then(async (results: any) => {
            return res.json({ products: results.rows });
        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});

app.get('/inventory-admin', async (req: Request, res: Response) => {

    const pool = new Pool(poolReq);

    pool.query('SELECT * FROM public."products" ORDER BY name ASC')
        .then(async (results: any) => {
            return res.json({ products: results.rows });
        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});

// Get product by ID
//
app.get('/inventory/:id', async (req: Request, res: Response) => {

    const id = req.params.id;
    const pool = new Pool(poolReq);

    pool.query(`SELECT * FROM public."products" WHERE id=${id};`)
        .then(async (results: any) => {
            return res.json({ product: results.rows[0] });
        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});


app.post('/edit-product', isAdmin, async (req: Request, res: Response) => {

    const product = req.body.product
    const pool = new Pool(poolReq);

    //console.log(product)

    // Ensure all fields have been entered
    //
    if (!product.name ||
        !product.category_id ||
        !product.description ||
        !product.price ||
        !product.quantity ||
        !product.id ||
        !product.discount) {
        console.log("Invalid fields in /edit-product/:id");
        return res.json({ "token": "", "status": status.INVALID_FORM });
    }

    const params: any[] = [
        product.id,
        product.name,
        product.category_id,
        product.description,
        product.price,
        product.quantity,
        product.discount
    ]

    let query: string = `UPDATE public.products SET id=$1, name=$2, category_id=$3, description=$4, price=$5, quantity=$6, discount=$7 WHERE id=$1`

    var x = await pool.query(query, params);
    //console.log(x)
    console.log("Edited product");
    return res.json({ product: product });
});

app.post(
    '/delete-inventory/:id', isAdmin,
    async (req: Request, res: Response) => {

        const id = req.params.id;
        const pool = new Pool(poolReq);

        pool.query(`DELETE FROM products WHERE id=${id};`)
            .then(async (products: any) => {
                return res.json(products);
            })
            .catch((error: any) => console.error(error))
            .finally(() => pool.end());
    });

app.post(
    '/updateStatus-inventory/:id', isAdmin,
    async (req: Request, res: Response) => {
        // console.log("here inside update status")
        const id = req.params.id;
        const pool = new Pool(poolReq);

        pool.query(`UPDATE products SET status = NOT status WHERE id=$1`, [id])
            .then(async (response: any) => {
                return res.json(response);//response.rowCount will equal 1 if a product was updated
            })
            .catch((error: any) => console.error(error))
            .finally(() => pool.end());
    });

app.post(
    '/get-cart/:userId', authToken,
    async (req: Request, res: Response) => {

        const userId = req.params.userId;
        const pool = new Pool(poolReq);
        const select_cart_by_id: string = `\
        SELECT * FROM public."cart" \
        WHERE userid=${userId}`;

        pool.query(select_cart_by_id)
            .then(async (results: any) => {
                let validProducts = [];
                // For each product in the user's shopping cart...
                for (let cartItem of results.rows) {
                    const products_by_id: string = `SELECT * \
                                                FROM public."products" \
                                                WHERE id=${cartItem.productid}`;
                    let prodResults = await pool.query(products_by_id);
                    // If the product still exists...
                    if (prodResults.rowCount > 0) {
                        // Add the name, price, and discount to the product
                        cartItem.name = prodResults.rows[0].name;
                        cartItem.price = prodResults.rows[0].price;
                        cartItem.discount = prodResults.rows[0].discount;
                        // Add the product to the list of valid products
                        validProducts.push(cartItem);
                    }
                    // If the product does not exist anymore... 
                    // (if the ID doesn't match anything in the database)
                    else {
                        // Delete it from the user's cart
                        await pool.query(`\
                        DELETE FROM public."cart" \
                        WHERE (\
                            userid=${userId} AND \
                            productid=${cartItem.productid}\
                        )`);
                        console.log(`Deleted invalid product with id ${cartItem.id}`);
                    }
                }
                return res.json({ cart: validProducts, "status": status.OKAY });
            })
            .catch((error: any) => console.error(error))
            .finally(() => pool.end());
    });

// Add a product to user's cart
// ok
app.post('/cart/:userId', authToken, async (req: Request, res: Response) => {

    const userId = req.params.userId;
    const productId = req.body.productId;
    const pool = new Pool(poolReq);

    //check if the provided user id and product id exist
    pool.query(`SELECT userid FROM public."users" WHERE userid=${userId} UNION ALL SELECT id FROM public."products" WHERE id=${productId}`)
        .then(async (results: any) => {
            //if the user exists
            if (results.rowCount == 2) {
                //check if the product is already in the user's cart
                let results = await pool.query(`SELECT * FROM public."cart" WHERE (userid=${userId} AND productid=${productId});`);
                //if the product already exists in the user's cart
                if (results.rowCount > 0) {
                    //add 1 to the quantity in the table
                    let newQuantity = results.rows[0].quantity + 1;
                    await pool.query(`UPDATE public."cart" SET quantity=${newQuantity} WHERE (userid=${userId} AND productid=${productId})`);
                }
                //if the user does not have the item in their cart
                else {
                    //create a new table row, starting quantity at 1
                    await pool.query(`INSERT INTO public."cart" VALUES (DEFAULT, $1, $2, 1)`, [userId, productId]);
                }
                return res.json({ "status": status.OKAY });
            }
            //if the user and/or the product does not exist
            else {
                return res.json({ "status": status.NOT_AUTHORIZED });
            }
        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});

app.put('/cart/:userId', authToken, async (req: Request, res: Response) => {

    const userId = req.params.userId;
    const productId = req.body.productId;
    const change = req.body.change;
    const pool = new Pool(poolReq);

    pool.query(`\
        UPDATE public."cart" \
        SET quantity=quantity+${change} \
        WHERE (userid=${userId} AND productid=${productId})`)
        .then(async (results: any) => {

            return res.json({
                "status": status.OKAY
            });

        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});

// Delete all cart items for a user
//
app.post(
    '/empty-cart/:userId', authToken,
    async (req: Request, res: Response) => {

        const userId = req.params.userId;
        const pool = new Pool(poolReq);

        pool.query(`\
        DELETE FROM public."cart" \
        WHERE userid=${userId}`)
            .then(async (results: any) => {
                return res.json({
                    "status": status.OKAY
                });
            })
            .catch((error: any) => console.error(error))
            .finally(() => pool.end());
    });

// Delete a specific cart item for a user
//
app.post(
    '/delete-cart-item/:userId', authToken,
    async (req: Request, res: Response) => {

        const userId = req.params.userId;
        const productId = req.body.productId;
        const pool = new Pool(poolReq);

        pool.query(`\
        DELETE FROM public."cart" \
        WHERE (userid=${userId} AND productid=${productId})`)
            .then(async (results: any) => {
                return res.json({ "status": status.OKAY });
            })
            .catch((error: any) => console.error(error))
            .finally(() => pool.end());
    });





app.post(
    '/add-product', upload.single("image"),
    async (req: Request, res: Response) => {

        const image = req.file?.filename;
        const product = req.body;

        // Ensure all fields have been entered
        //
        if (!product.name ||
            !product.category_id ||
            !product.price ||
            !product.quantity ||
            !product.description) {
            console.log("Invalid fields in /add-product");
            return res.json({ "token": "", "status": status.INVALID_FORM });
        }

        const pool = new Pool(poolReq);

        const query: string = `\
        INSERT INTO public."products" \
        VALUES (DEFAULT, $1, $2, $3, $4, $5, $6)`

        const params: any[] = [
            product.name,
            product.category_id,
            product.description,
            image,
            product.price,
            product.quantity,]

        // Insert values into products table
        //
        pool.query(query, params)
            .then(async (results: any) => {
                return res.status(201).json({ status: 201 });
            })
            .catch((error: any) => console.error(error))
            .finally(() => pool.end());
    });



app.get('/uploads/:filename', async (req: Request, res: Response) => {
    const filename = req.params.filename;
    const defaultFileName = "default.png";
    // Verify if file is on the system & security
    if (/^[.A-Za-z0-9_-]+$/.test(filename)) {
        // Send the file if it exists...
        res.sendFile("/uploads/" + filename, function (err) {
            if (err) {
                // ...otherwise send the default image
                res.sendFile("/uploads/" + defaultFileName);
            }
        });
    }
    else {
        // If the provided image has an invalid name, send the default image
        res.sendFile("/uploads/" + defaultFileName)
    }
});



app.post('/get-orders', authToken, async (req: Request, res: Response) => {
    const pool = new Pool(poolReq);
    pool.query('SELECT * FROM public."orders" WHERE status <> $1', ["unpaid"])//exclude unpaid
        .then(async (results: any) => {
            return res.json({ orders: results.rows });
        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});

//return a specific order by orderid
app.post('/order-detail/:id', authToken, async (req: Request, res: Response) => {
    const id = req.params.id;
    // If invalid form data return invalid
    if (!Number.isInteger(Number(id))) {
        console.log("Error")
        return res.json({ orders: status.INVALID_FORM })
    }
    // Return order data for order id
    const pool = new Pool(poolReq);
    pool.query('SELECT * FROM public."orders" where orderid = $1', [id])
        .then(async (results: any) => {
            return res.json({ order: results.rows[0] });
        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});

app.post('/delete-unpaid-order/:id', authToken, async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const pool = new Pool(poolReq);
    // ONLY delete if the order status is "unpaid"
    pool.query(`SELECT * FROM public."order" WHERE (orderid=$1 AND status=$2)`, [orderId, "unpaid"])
        .then(async (results: any) => {
            if (results.rowCount > 0) {
                //delete order products first
                await pool.query(`DELETE FROM public."orderproduct" WHERE orderid=$1`, [orderId])
                //then delete the actual order
                await pool.query(`DELETE FROM public."orders" WHERE orderid=$1`, [orderId])
                console.log("deleted order");
            }
            return res.json({ status: status.OKAY });
        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});

app.post('/get-order-items/:id', authToken, async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const pool = new Pool(poolReq);
    pool.query('SELECT * FROM public."orderproduct" WHERE orderid = $1', [orderId])
        .then(async (results: any) => {
            //get each product name and add it to the return array
            for (let item of results.rows) {
                let response = await pool.query(`SELECT name FROM public."products" WHERE id=$1`, [item.productid]);
                item.product_name = response.rows[0].name;
            }
            return res.json({ items: results.rows });
        })
        .catch((error: any) => console.error(error))
        .finally(() => pool.end());
});

app.post('/order-update/', authToken, (req: Request, res: Response) => {
    const id = req.body.id;
    const newstatus = req.body.newstatus;
    let validStatus = (newstatus == "not started" || newstatus == "in progress" || newstatus == "serviced");

    //If invalid form data return invalid
    if (!validStatus || !Number.isInteger(Number(id))) {
        console.log("Invalid status and/or id in post:/order-update/")
        return res.json({ orders: status.INVALID_FORM })
    } else {
        const pool = new Pool(poolReq);
        const update_order_status: string = 'UPDATE public."orders" SET status=$1 WHERE orderid = $2';
        pool.query(update_order_status, [newstatus, id])
            .catch((error: any) => console.error(error))
            .finally(() => pool.end());

        return res.json({
            orders: status.OKAY
        })
    }
});

//adds an order to the database
async function createOrder(userId: string, items: any, totalCost: number, deliveryType: string, deliveryTime: string, deliveryLocation: string): Promise<number> {
    const pool = new Pool(poolReq);
    let orderId = 0;
    //check if the provided user id exists
    let results = await pool.query(`SELECT userid FROM public."users" WHERE userid=${userId}`);
    //if the user exists
    if (results.rowCount == 1) {
        //get current date (yyyy/mm/dd)
        var today = new Date();
        var date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        //create a new order (in orders table)
        await pool.query(
            `INSERT INTO public."orders" VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7)`,
            [userId, date, totalCost, deliveryType, deliveryTime, deliveryLocation, "unpaid"] //at this point, the order status is upaid
        );
        //get created ID (retrieves the max orderid which may not be 100% correct under weird conditions)
        let response = await pool.query(`SELECT MAX(orderid) FROM public.orders`);
        orderId = response.rows[0].max;
        //add each order item (in orderproduct table)
        for (let item of items) {
            await pool.query(
                `INSERT INTO public."orderproduct" VALUES (DEFAULT, $1, $2, $3, $4)`,
                [orderId, item.id, item.quantity, item.price]
            );
        }
    }
    pool.end();
    return orderId;
}


// stripe stuff
const STRIPE_PRIVATE_KEY = "sk_test_51Mbw6yAkhJBnbhLrCPXcuKL7WHq2P0qA8d7i4xzgnOIrHAvvJwR44CiazMZnHiP58Nqci94xFrCTTa0Wm6tOXmF800TVmrE9KM";
const CLIENT_URL = "http://localhost:4200/";

//const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const stripe = require("stripe")(STRIPE_PRIVATE_KEY);

let storeItems = new Map<number, { priceInCents: number, name: string }>([
    // [12, { priceInCents: 10000, name: "stripe test product 1" }],
    // [4, { priceInCents: 20000, name: "stripe test product 2" }],
])

app.post("/create-checkout-session", authToken, async (req, res) => {
    let items = req.body.items;
    const userId = req.body.userId;
    const deliveryDetails = req.body.deliveryDetails;
    let totalPriceInCents = 0;

    //retrieve extra data for each product
    const pool = new Pool(poolReq);
    for (let item of items) {
        await pool.query(`SELECT name, price, discount FROM public."products" WHERE id=${item.id}`)
            .then(async (results: any) => {
                //calculate the price
                let priceInCents = Math.round((results.rows[0].price * 100) * (results.rows[0].discount));
                //increase total price to be used later
                totalPriceInCents += priceInCents * item.quantity;
                //add the price field to the product to be used later
                item.price = priceInCents / 100;
                //add the item to the Map of items for Stripe
                storeItems.set(item.id, { "priceInCents": priceInCents, "name": results.rows[0].name })
            })
            .catch((error: any) => console.error(error))
    }
    pool.end();

    //add the order to the database (its "status" field will equal "unpaid")
    let orderId = await createOrder(userId, items, totalPriceInCents / 100, deliveryDetails.deliveryType, deliveryDetails.deliveryTime, deliveryDetails.deliveryLocation);

    //generate uuid for the stripe session
    let uuid = uuidv4();
    //set the user's checkout_uuid to the generated uuid
    const pool2 = new Pool(poolReq);
    await pool2.query('UPDATE public."users" SET checkout_uuid=$1 WHERE userid=$2', [uuid, userId]);
    pool2.end();

    //create a stripe session and send back its url
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: items.map((item: { id: number; quantity: any; }) => {
                const storeItem = storeItems.get(item.id)
                return {
                    price_data: {
                        currency: "CAD",
                        product_data: {
                            name: storeItem?.name,
                        },
                        unit_amount: storeItem?.priceInCents,
                    },
                    quantity: item.quantity,
                }
            }),
            success_url: `${CLIENT_URL}/checkout/success/${orderId}/${uuid}`,
            cancel_url: `${CLIENT_URL}/checkout/cancel/${orderId}`,
            //success_url: `${process.env.CLIENT_URL}/checkout/success`,
            //cancel_url: `${process.env.CLIENT_URL}/checkout`,
        })
        res.json({ url: session.url })
    } catch (err) {
        res.status(500).json({ error: (err as Error).message })
    }
})


// Get number of orders for user
//
app.get('/orders-number-of-orders-by-user', async (req: Request, res: Response) => {

    // Get user id
    //
    //let userid:Number = req.body.userid;
    let userid: Number = 4;

    // Count number of orders for user
    //
    const pool = new Pool(poolReq);
    let ans = await pool.query('SELECT count(*) FROM orders WHERE (userid = $1 AND status <> $2);', [userid, "unpaid"]);

    return res.json({ count: ans.rows[0].count })
});

// Orders for a specific user
//
app.post('/my-orders', authToken, async (req: Request, res: Response) => {

    // Get user id
    //
    let userid: any = req.body.id; // example change later

    // Count number of orders for user
    //
    const pool = new Pool(poolReq);
    let ans = await pool.query('SELECT orderid FROM orders WHERE (userid = $1 AND status <> $2);', [userid, "unpaid"]);

    return res.json({ orderids: ans.rows })

});

// View order details
//
app.post('/order-view-detail', authToken, async (req: Request, res: Response) => {

    // Query order for user
    let orderid: any = req.body.id;

    const pool = new Pool(poolReq);
    let ans = await pool.query('SELECT * FROM orderproduct WHERE orderid = $1;', [orderid]);

    // Map product ids to names
    //
    var formattedOrders: any = []
    for (var order of ans.rows) {

        let name = await pool.query('SELECT name FROM products WHERE id = $1 LIMIT 1;', [order.productid]);

        formattedOrders.push({
            name: name.rows[0].name,
            quantity: order.quantity,
            product_cost: order.product_cost
        })
    }
    pool.end()
    return res.json({ orders: formattedOrders })
});