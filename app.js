const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

//routes
app.use("/coins", require("./routes/coin"));

app.listen(PORT, console.log(`listening on the port ${PORT}`));
