//statuses sent from the server (must match the server.ts version)
//
export enum status {
    INVALID_FORM = "INVALID_FORM",
    OKAY = "OKAY",
    NOT_AUTHORIZED = "NOT_AUTHORIZED",
    NOT_FOUND = "NOT FOUND",
    DB_CONNECTION_FAIL = "DB_CONNECTION_FAIL"
}

export let categories: { id: number, value: string }[] = [
    { id: 1, value: "Fruit" },
    { id: 2, value: "Vegetable " },
    { id: 3, value: "Bread " },
    { id: 4, value: "Meat" },
    { id: 5, value: "Frozen Food" },
    { id: 6, value: "Cereal " },
    { id: 7, value: "Dairy " }
];

//holds the user credentials for the login and signup pages
//
export class User {

    "userid": number = 0;
    "userfname": string = "";
    "userlname": string = "";
    "useremail": string = "";
    "userpassword": string = "";
    "userrole": string = "";

    //convert to json
    //
    toJson() {
        return {
            "userid": this.userid,
            "userfname": this.userfname,
            "userlname": this.userlname,
            "useremail": this.useremail,
            "userpassword": this.userpassword,
            "userrole": this.userrole
        };
    }
}

export class CartItem {

    "productid": number = 0;
    "name": string = "";
    "quantity": number = 0;
    "price": number = 0.0;
    "discount": number = 0.0;
    

    constructor(
        productid: number,
        name: string,
        quantity: number,
        price: number,
        discount: number) {

        this.productid = productid;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.discount = discount;
        
    }

    //whether the product is on sale
    isOnSale(): boolean {
        return (+this.discount) < 1;
    }
    //returns price calculated with discount
    getCalculatedPrice(): number {
        return (this.price * this.discount);
    }
}


export class Product {
    "isValid": boolean = false;
    "id": number = 0;
    "name": string = "";
    "category": string = "";
    "category_id": number = 0;
    "description": string = "";
    "quantity": string = "0";
    "image": File;
    "price": string = "0";
    "discount": string = "1";
    "filename": string = "";
    "status": boolean = true;

    categories: { id: number, value: String }[] = [
        { id: 1, value: "Fruit" },
        { id: 2, value: "Vegetable " },
        { id: 3, value: "Bread " },
        { id: 4, value: "Meat" },
        { id: 5, value: "Frozen Food" },
        { id: 6, value: "Cereal " },
        { id: 7, value: "Dairy " }
    ];

    loadData(product: any) {

        // Only set if provided a json with all required fields 
        // (image is not required as of now)
        //
        if (product.id &&
            product.name &&
            product.description &&
            product.price &&
            product.category_id &&
            product.image &&
            product.discount &&
            product.status) {

            this.id = product.id;
            this.name = product.name;
            this.description = product.description;
            this.filename = product.image;
            this.price = product.price;
            this.category = product.category;
            this.category_id = product.category_id;
            this.discount = product.discount;
            this.isValid = true;
            this.status = true;
        }
    }
    //convert to json
    //
    toJson() {
        return {
            "name": this.name,
            "category": this.categories.find((element: any) => element['id'] == this.category_id) || "DEFAULT",
            "description": this.description,
            "quantity": this.quantity,
            "image": this.image,
            "price": this.price
        };
    }
    //whether the product is on sale
    isOnSale(): boolean {
        return (+this.discount) < 1;
    }
    //returns price calculated with discount
    getCalculatedPrice(): number {
        return (+this.price) * (+this.discount);
    }
    //returns the formatted price text
    getPriceText() {
        if (this.isOnSale()) {
            return `$${this.getCalculatedPrice().toFixed(2)}`;
        } else {
            return `$${(+this.price).toFixed(2)}`;
        }
    }
    //returns the formatted discount text
    getDiscountText(): string {
        let discount: number = 100 * (1 - (+this.discount));
        return `${discount.toFixed(0)}% OFF`;
    }
}

//holds the field values for order details
//
export class CheckoutDetails {

    method: string;
    time: string;
    address: string;
    total: number;

    constructor() {
        this.method = "";
        this.time = "";
        this.address = "";
        this.total = 0.0;
    }

    set(method: string,
        time: string,
        address: string,
        total: number) {

        this.method = method;
        this.time = time;
        this.address = address;
        this.total = total;
    }

    setFromJSON(details: {
        method: string,
        time: string,
        address: string,
        total: number
    }) {
        this.method = details.method;
        this.time = details.time;
        this.address = details.address;
        this.total = details.total;
    }
    clear() {
        this.method = "";
        this.time = "";
        this.address = "";
        this.total = 0.0;
    }
    isValid(): boolean {
        return (this.method == "delivery" &&
            this.time.length > 0 &&
            this.address.length > 0) || (this.method == "pickup" &&
                this.time.length > 0);
    }
}