const express = require("express");
const router = express.Router();
const pool = require("../db");
//route to fetch bucket coins

const authString = "abcdefgh";
router.get("/", authenticate, async (req, res) => {
  const availableCoins = await getAvailableCoins();
  if (availableCoins != null) {
    return res.status(200).json({ "available coins": availableCoins });
  } else {
    return res.status(404).send("error while fetching coins");
  }
});

// route to reset bucket coins
router.post("/reset", authenticate, async (req, res) => {
  const resetValue = 1000;
  const resetQuery = await pool.query(
    `UPDATE bucket set coins = ${resetValue}`
  );
  if (resetQuery) {
    return res.status(200).send(`bucket reset to ${resetValue} coins`);
  } else {
    return res.status(404).send("error while reseting the bucket");
  }
});

//route to request coins
router.post("/", authenticate, async (req, res) => {
  const requestedCoins = req.body.coins;
  const requestedUser = req.body.user;
  if (requestedCoins <= 0) {
    return res
      .status(305)
      .send("Bad Request! please request coins in positive range");
  }
  const availableCoins = await getAvailableCoins();
  if (availableCoins == null) {
    console.log("error in fetching coins : " + availableCoins);
    res.status(400).send("error in fetching coins");
  } else {
    const remainingCoins = availableCoins - requestedCoins;
    if (requestedCoins > availableCoins) {
      return res
        .status(300)
        .send(
          `bad request, not enough coins available in the bucket! your request: ${requestedCoins} , bucket balance ${availableCoins}`
        );
    } else {
      // need to apply lock here!
      const updateBucketResponse = await UpdateBucket(
        requestedCoins,
        availableCoins,
        requestedUser
      );

      if (updateBucketResponse == "success")
        res.status(200).json({
          message: `success! ${requestedCoins} has been alloted to ${requestedUser}`,
          "available coins": remainingCoins,
        });
    }
  }
});

//route to get transaction history
router.get("/history", authenticate, async (req, res) => {
  let query = "SELECT * from TRANSACTIONS order by created_at DESC";
  const param = req.query.limit;
  if (param) query += " limit " + param;
  const getHistoryQuery = await pool.query(query);
  if (getHistoryQuery) {
    return res.status(200).json(getHistoryQuery.rows);
  } else {
    return res.status(400).send("error while fetching transaction history");
  }
});

//route to delete transaction history
router.delete("/history", authenticate, async (req, res) => {
  const deleteQuery = pool.query("DELETE from transactions");
  if (deleteQuery) return res.status(200).send("Transasction history cleared");
  return res.status(300).send("error, couldn't delete transaction history");
});
// get available coin from the bucket
async function getAvailableCoins() {
  const getCoinsQuery = await pool.query("SELECT coins FROM bucket");
  if (getCoinsQuery) {
    return getCoinsQuery.rows[0].coins;
  } else {
    return null;
  }
}

// update the bucket and decrease the size
async function UpdateBucket(requestedCoins, availableCoins, requestedUser) {
  const remainingCoin = availableCoins - requestedCoins;
  const updateCoinQuery = await pool.query(
    `UPDATE bucket SET coins = ${remainingCoin}`
  );
  if (updateCoinQuery) {
    const updateTransactionResposne = await updateTransaction(
      requestedUser,
      availableCoins,
      requestedCoins
    );
    if (updateTransactionResposne == "success") return "success";
    else {
      // rollback to maintain atomicity
      console.log("transaction entry is failed -- rollback");
      return "success";
    }
  }
  return "fail";
}

async function updateTransaction(
  requestedUser,
  availableCoins,
  requestedCoins
) {
  // console.log("--requser: --" + requestedUser + ", , coins: " + requestedCoins);
  const updateTransactionQuery = await pool.query(
    "INSERT INTO transactions(requested_user, requested_coins,balance_before_request,balance_after_request) values ($1,$2,$3,$4)",
    [
      requestedUser,
      requestedCoins,
      availableCoins,
      availableCoins - requestedCoins,
    ]
  );

  if (updateTransactionQuery) return "success";
  return "error";
}

function authenticate(req, res, next) {
  const requestAuthString = req.query.secret;
  if (requestAuthString !== authString)
    return res.send("forbidden, you are not authorized");
  next();
}
module.exports = router;
