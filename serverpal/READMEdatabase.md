## How To Execute SQL Querys

Upon server start up the connectDb function will be executed 
   ``` js
    const connectDb = async () => {
        try {
            await pool.connect();
        } catch (error) {
            console.log(error);
        }
    };
   ```
1. Write and test your SQL statement before attempting to execute on server
   ```sql
   SELECT * FROM Users;
   ```
2. Create a variable to store return from SQL query
3. Use pool.query to execute SQL query
   ``` js
    const res = await pool.query("SELECT * FROM Users;");
   ```
## Accessing through the server
1. SSH into server with your SSH key
  <img width="336" alt="step-1" src="https://user-images.githubusercontent.com/31703129/204122068-ad63796f-edda-42ca-b4a1-1c30e6a7581f.png">

2. Change user to Postgres User
   ``` console
   sudo -i -u postgres
   ```
3. To begin executing SQL queries or to view existing databases and tables, switch to SQL mode 
    ``` console
    psql "grocerypal"
    ```
*Note: code block above demonstrates the grocerypal database, if using another database insert that name instead*

#### Commands and Useful Documentation
- [Documentation](https://www.postgresql.org/docs/current/ddl-priv.html "Documentation")
- To view data in a table use a select statement
  ``` sql
  SELECT * FROM Users 
  WHERE Country = 'Mexico'; 

  SELECT * FROM Inventory;
  ```
- To quit the program use **\q**
- To view tables use **\dp**
- To view all databases use **\l**
- To exit view mode after using \dp press the **q** key
- **End every query with a ; querys not ended with a ; will not get run**

#### Notes
- Database calls are asyncronous 
  - **Must** be completed before attemting to display, meaning they must be in a *promise* or use *await*
- All database calls should be inside a try catch block 
  ```js
  try {
    const res = await pool.query("SELECT * FROM Users;")
  } catch (error) {
    console.log(error);
  }
  ```
- All database interaction **must** be done through **index.ts**
- Database is **not** available remotely, it may only be accessed through SSH into the server machine *OR* by modifying the application code which runs on the same machine as the database

#### Did you mess all the tables up and need to start again? 
 
Execute the following querys in psql mode on the server or using an pool.query function in index.ts
- *Note: this just creates the tables to repopulate them use the querys found in serverpal/database-test-data.sql*

```sql
DROP TABLE IF EXISTS User;
 
 CREATE TABLE "User" (
 userId SERIAL,
 userName VARCHAR(50),
 userPassword VARCHAR(32),
 userRole VARCHAR(32),
 CONSTRAINT userId PRIMARY KEY (userId),
);

DROP TABLE IF EXISTS Store;
 
 CREATE TABLE Store (
 storeId SERIAL,
 storeName VARCHAR(50),
 CONSTRAINT storeId PRIMARY KEY (storeId),
);

DROP TABLE IF EXISTS Inventory;
 
 CREATE TABLE Inventory (
 invId SERIAL,
 invName VARCHAR(50),
 invQuantity VARCHAR(32),
 CONSTRAINT invId PRIMARY KEY (invId),
);
```

#### Did you mess up the whole database and need to relaunch it? 
*shell script coming soon*
