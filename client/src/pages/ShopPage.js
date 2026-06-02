import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import API from '../utils/api';
import './ShopPage.css';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Food & Groceries', 'Home & Garden', 'Beauty', 'Sports', 'Books', 'Other'];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (category) params.set('category', category);
    if (searchParams.get('search')) params.set('search', searchParams.get('search'));
    API.get(`/api/products?${params}`)
      .then(r => { setProducts(r.data.products); setTotal(r.data.total); setPages(r.data.pages); })
      .finally(() => setLoading(false));
  }, [category, page, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (search) p.set('search', search);
    else p.delete('search');
    p.delete('page');
    setSearchParams(p);
  };

  const setCategory = (cat) => {
    const p = new URLSearchParams(searchParams);
    if (cat === 'All') p.delete('category');
    else p.set('category', cat);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="shop-header">
          <h1>Shop</h1>
          <form onSubmit={handleSearch} className="search-form">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
            />
            <button type="submit"><FiSearch /></button>
          </form>
        </div>

        <div className="shop-layout">
          <aside className="sidebar">
            <h3><FiFilter /> Categories</h3>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${(category === cat || (!category && cat === 'All')) ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >{cat}</button>
            ))}
          </aside>

          <main className="products-main">
            <p className="result-count">{total} products found</p>
            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state"><p>No products found.</p></div>
            ) : (
              <div className="products-grid-shop">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            {pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`page-btn ${page === p ? 'active' : ''}`}
                    onClick={() => { const n = new URLSearchParams(searchParams); n.set('page', p); setSearchParams(n); }}
                  >{p}</button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
