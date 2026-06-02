const express = require('express');
const router = express.Router();

const categories = [
  'Electronics', 'Clothing', 'Food & Groceries',
  'Home & Garden', 'Beauty', 'Sports', 'Books', 'Other'
];

router.get('/', (req, res) => res.json(categories));

module.exports = router;
