const express = require("express");
const protect = require("../middleware/authMiddleware");
const router = express.Router();
const pool = require("../config/helpers");

router.get("/", (req, res) => {
  let page =
    req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1; // set the current page number
  const limit =
    req.query.limit !== undefined && req.query.limit !== 0
      ? req.query.limit
      : 12; // set the limit of items per page

  let startValue;
  let endValue;

  if (page > 0) {
    startValue = page * limit - limit;
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 12;
  }

  let productListQuery =
    "SELECT c.title as category, p.title as name, \
                              p.price, p.quantity, p.image, p.id, p.short_desc, \
                              p.rating, p.numReviews \
                              from products p, categories c \
                              WHERE p.cat_id = c.id  \
                              order by p.id limit 12;";

  pool.query(productListQuery, (error, results, fields) => {
    if (!error) {
      res.status(200).json({
        count: results.length,
        products: results,
      });
    } else {
      res.json({
        message: "No products found",
      });
    }
  });
});

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

router.get('/trending',(req, res) => {
  let productListQuery =
    "SELECT * FROM products ORDER BY rating ASC where rating between 5 and 3";
  pool.query(productListQuery,(err, rows) => {
      if (!err)
       {res.status(200).json({products:rows, count:rows.length, })}
      else console.log(err);
    }
  );
});

//Get a product by decreasing order of price
router.get('/hightolow',(req, res) => {
  pool.query(
    'SELECT * FROM products ORDER BY price DESC',
    (err, rows) => {
      if (!err) {res.status(200).json({products:rows,count:rows.length,});}
      else console.log(err);
    }
  );
});

router.get('/q/:keyword',(req, res) => {
  pool.query(
    'SELECT * FROM products where title like "'+req.params.keyword+'%"',
    (err, rows) => {
      if (!err) {res.status(200).json({products:rows,count:rows.length,});}
      else console.log(err);
    }
  );
});

router.get("/:prod_id", (req, res) => {
  // let productid = req.params.prod_id;
  let productQuery = "SELECT * from products where products.id=?";
  let reviewsQuery = "SELECT * from reviews where reviews.product_id =?";
  let product = {};
  let reviews = [];

  pool.query(productQuery, [req.params.prod_id], (error, results, fields) => {
    if (!error) {
      product = results[0];
      if (product) {
        pool.query(
          reviewsQuery,
          [req.params.prod_id],
          (error, results, fields) => {
            if (!error) {
              reviews = results;
              res.status(200).json({
                product: product,
                reviews: reviews,
              });
            } else {
              res.json({
                message: `No product found with ProductId ${productId}`,
              });
            }
          }
        );
      }
    } else {
      console.log(error);
    }
  });
});


router.post("/:prod_id/reviews", protect, (req, res) => {
  const { rating, comment } = req.body;

  let productQuery = "SELECT * from products where products.id=?";
  let alreadyReviewedQuery = `SELECT * from reviews where reviews.user_id =? and reviews.product_id=?`;
  let insertReviewQuery = `INSERT INTO REVIEWS SET ?`;

  let reviewed;
  pool.query(
    alreadyReviewedQuery,
    [req.id, req.params.prod_id],
    (error, results1, fields) => {
      if (!error) {
        reviewed = results1[0];
        let newReview = {
          rating: Number(rating),
          product_id: req.params.prod_id,
          review: comment,
          user_id: req.id,
        };
        if (!reviewed) {
          pool.query(insertReviewQuery, newReview, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.status(201).json({
                message: "New Review Added",
              });
            }
          });
        } else {
          res.status(400).json({
            message: "Product already reviewed",
          });
        }
      }
    }
  );
});


// db.end();
module.exports = router;
