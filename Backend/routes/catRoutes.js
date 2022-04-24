const express = require("express");
const router = express.Router();
const pool = require("../config/helpers");

//Get a product by category
router.get('/:cat',(req,res)=> {
    pool.query("SELECT * FROM products WHERE cat_id = ?",[req.params.cat],
    (error, results, fields)=> {
        if (!error) 
        {
          res.status(200).json({products:results,count:results.length,});
        } else {
          res.json({message: "No products found"});
      }}
    );
  });
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