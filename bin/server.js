const app = require("../app");
const db = require("../model/db");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log("Error:", err.message);
  process.exit(1);
});
