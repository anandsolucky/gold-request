const mongoose = require("mongoose");

const bucketSchema = mongoose.Schema({
  bucketNumber: Number,
  availableCoins: Number,
});

const Bucket = mongoose.model("Bucket", bucketSchema);
module.exports = Bucket;
