const express = require("express");
const router = express.Router();
const pool = require("../config/helpers");

router.get('/lowtohigh',(req, res) => {
    let productListQuery =
      "SELECT * FROM products ORDER BY price ASC";
    pool.query(productListQuery,(err, rows) => {
        if (!err)
         {res.status(200).json({products:rows, count:rows.length, })}
        else console.log(err);
      }
    );
  });
  
  //Get a product by decresing order of price
  router.get('/hightolow',(req, res) => {
    pool.query(
      'SELECT * FROM products ORDER BY price DESC',
      (err, rows) => {
        if (!err) {res.status(200).json({products:rows,count:rows.length,});}
        else console.log(err);
      }
    );
  });
  
  module.exports=router;  
