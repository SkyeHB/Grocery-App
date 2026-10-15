# Group_23

![deployment](https://github.com/CAPSTONE-2022-2023/Group_23/actions/workflows/deploy.yml/badge.svg)

## Project Description

A website for a specific grocery store where customers can search and buy from a large selection of products and administration can complete store tasks such as inventory management, viewing transaction history, and managing delivery orders.

## Tech Stack

-   [Angular](https://angular.io/)
-   [Express JS](https://expressjs.com/)
-   [PostgreSQL](https://www.postgresql.org/)
-   [JSON Web Tokens](https://jwt.io/)
-   [Stripe](https://stripe.com/en-ca)
-  [GitHub Actions](https://github.com/features/actions)

## Project Features

**General**

The Home page displays featured sales and deals. The About page contains information such as store hours and location. The products page lists all the store's products with sorting and searching capabilities to find items faster. Although anyone can view items, customers must be registered and logged in to add items to their cart.

**Accounts**

Visitors of the site have the ability to create a customer account and all user types can log in to their respective account. Administrators will have the ability to create more administrator accounts if needed by using the site. All user accounts have specific authority levels which dictate what they will be able to view.

**Admin Dashboard**

The Admin Dashboard is the home page for administrators. It allows them to choose and conduct different administrative tasks such as inventory management, viewing transaction history, and managing customer delivery orders. They can also view all users and their details and search for specific accounts by their account ID.

**Inventory Management**

Admins can view the products on their own page with more details including the products' remaining stock and products' popularity. They can create sales for products, add new products to sell in the store, remove products being sold, hide and show products (toggle public visibility), and edit product details such as name and description. They can also buy more stock of the products to be sold. Transactions such as customer purchases and stock purchases are recorded and visible to admins.

**Shopping**

When viewing products, customers can sort between the type of the product (fruit, dairy, cereal, etc.) as well as search by product name or ID. Customers can add specific items and a quantity to their shopping cart. On a separate screen, the customers can view the items in their shopping cart, remove items, clear the whole cart, and checkout. When purchasing, customers have the option to choose either pick-up (they come to pick it up) or delivery (a store worker delivers to you) which requires a date and time. Either way, a worker will see the orders on an admin page and gather the items for you.
