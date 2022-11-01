const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "userData.db");

const app = express();
app.use(express.json());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (err) {
    console.log(`DB ERROR: ${err.message}`);
    process.exit(-1);
  }
};

initializeDBAndServer();

//User Register API
app.post("/register", async (request, response) => {
  const userDetails = request.body;
  const { username, name, password, gender, location } = userDetails;
  const checkUserQuery = `
    SELECT 
      * 
    FROM 
      user
    WHERE 
      user.username = '${username}';
  `;
  const dbResponse = await db.get(checkUserQuery);

  if (dbResponse === undefined) {
    const addUserQuery = `
        INSERT INTO 
          user(username, name, password, gender, location)
        VALUES (
          '${username}',
          '${name}',
          '${password}',
          '${gender}',
          '${location}'
        );
      `;
    const dbResponse = await db.run(addUserQuery);
    const userId = dbResponse.lastID;
    response.send("User created successfully");
  } else if (password.length < 5) {
    response.status(400);
    response.send("Password is too short");
  } else {
    response.status(400);
    response.send("User already exists");
  }
});
