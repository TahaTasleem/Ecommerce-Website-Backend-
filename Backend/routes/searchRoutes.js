const express = require("express");
const router = express.Router();
const pool = require("../config/helpers");
router.get('/:keyword',(req, res) => {
    pool.query(
      'SELECT * FROM products where title like "'+req.params.keyword+'%"',
      (err, rows) => {
        if (!err) {res.status(200).json({products:rows,count:rows.length,});}
        else console.log(err);
      }
    );
  });
 
module.exports=router;  