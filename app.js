const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 5000;

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const userRoutes = require("./routes/userRoute");
const hotelRoutes = require("./routes/hotelRoute");
const roomRoutes = require("./routes/roomRoute");
const transactionRoutes = require("./routes/transactionRoute");
const dashboard = require("./routes/dashboard");

app.use(cors());
app.use(bodyParser.json());
app.use("/api", userRoutes);
app.use("/api", hotelRoutes);
app.use("/api", roomRoutes);
app.use("/api", transactionRoutes);
app.use("/api", dashboard);

mongoose
    .connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.udsdb9i.mongodb.net/${dbName}?retryWrites=true&w=majority`
    )
    .then(console.log("Connected to MongoDB"))
    .catch((error) => console.error("Connection error:", error));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
