router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    let sortOpt = { createdAt: -1 };
    if (sort === 'price_asc') sortOpt = { price: 1 };
    if (sort === 'price_desc') sortOpt = { price: -1 };
    if (sort === 'rating') sortOpt = { rating: -1 };
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOpt)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('seller', 'name');
    res.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
