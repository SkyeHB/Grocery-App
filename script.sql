DROP TABLE IF EXISTS Users;
 
 CREATE TABLE Users (
 userId SERIAL,
 userFName VARCHAR(50),
 userLName VARCHAR(50),
 userEmail VARCHAR(50),
 userPassword VARCHAR(75),
 userRole VARCHAR(32),
 CONSTRAINT userId PRIMARY KEY (userId)
);

DROP TABLE IF EXISTS Store;
 
 CREATE TABLE Store (
 storeId SERIAL,
 storeName VARCHAR(50),
 CONSTRAINT storeId PRIMARY KEY (storeId)
);

DROP TABLE IF EXISTS Inventory;
 
 CREATE TABLE Inventory (
 invId SERIAL,
 invName VARCHAR(50),
 invQuantity VARCHAR(32),
 CONSTRAINT invId PRIMARY KEY (invId),
 CONSTRAINT invId UNIQUE (invId)
);

DROP TABLE IF EXISTS Orders;

CREATE TABLE Orders (
 orderID SERIAL,
 orderDate DATE
);

DROP TABLE IF EXISTS OrderItems;

CREATE TABLE OrderItems (
orderItemsID INT,
quantity INT,
itemName VARCHAR(50),
itemPrice INT
);
