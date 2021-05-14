const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    requestedUserUid: String,
    requestedUserName: String,
    resquestedCoins: Number,
  },
  { timestamps: { createdAt: "created_at" } }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
