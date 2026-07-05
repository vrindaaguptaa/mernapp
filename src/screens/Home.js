import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchRounded from '@mui/icons-material/SearchRounded';
import TuneRounded from '@mui/icons-material/TuneRounded';
import DeliveryDiningRounded from '@mui/icons-material/DeliveryDiningRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import RestaurantMenuRounded from '@mui/icons-material/RestaurantMenuRounded';
import Footer from '../components/Footer';
import Card from '../components/Card';
import CardSkeleton from '../components/CardSkeleton';

import { buildApiUrl, parseApiResponse } from '../utils/api';

const getPrices = (item) =>
  item.options?.[0] ? Object.values(item.options[0]).map(Number).filter(Number.isFinite) : [0];

export default function Home() {
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortOption, setSortOption] = useState('default');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(buildApiUrl('/api/foodData'));
      const data = await parseApiResponse(response, 'Unable to load food data');
      if (!data?.success) throw new Error(data?.message || 'Unable to load food data');
      setFoodItem(data.foodItems || []);
      setFoodCat(data.foodCategory || []);
    } catch (err) {
      setError(err.message || 'Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredFoodItems = useMemo(() => {
    const result = foodItem.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || item.name?.toLowerCase().includes(query) || item.CategoryName?.toLowerCase().includes(query);
      const matchesCategory = !selectedCategory || item.CategoryName === selectedCategory;
      const minPrice = Math.min(...getPrices(item));
      const matchesPrice = priceFilter === 'all' ||
        (priceFilter === 'low' && minPrice <= 250) ||
        (priceFilter === 'medium' && minPrice > 250 && minPrice <= 500) ||
        (priceFilter === 'high' && minPrice > 500);
      return matchesSearch && matchesCategory && matchesPrice;
    });

    return [...result].sort((a, b) => {
      if (sortOption === 'price-low') return Math.min(...getPrices(a)) - Math.min(...getPrices(b));
      if (sortOption === 'price-high') return Math.max(...getPrices(b)) - Math.max(...getPrices(a));
      if (sortOption === 'alpha') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [foodItem, search, selectedCategory, priceFilter, sortOption]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setPriceFilter('all');
    setSortOption('default');
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="hero-kicker"><DeliveryDiningRounded /> Fresh food. Fast delivery.</span>
            <h1>Order Delicious Food <span>Delivered Fast</span></h1>
            <p>From local favourites to comfort-food classics, discover meals you’ll love and get them delivered right to your door.</p>
            <div className="hero-actions">
              <a href="#menu" className="btn btn-light btn-lg">Explore menu <ArrowForwardRounded /></a>
              <Link to="/orders" className="btn btn-hero-ghost btn-lg">Track an order</Link>
            </div>
          </div>

          <div className="hero-search" role="search">
            <SearchRounded />
            <input
              type="search"
              placeholder="Search biryani, pizza, desserts…"
              aria-label="Search food"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <a href="#menu" className="btn btn-brand">Find food</a>
          </div>
          <div className="hero-proof"><span>30 min delivery</span><span>Live order tracking</span><span>Freshly prepared</span></div>
        </div>
      </section>

      <main className="container menu-shell" id="menu">
        <div className="menu-intro">
          <div><span className="section-kicker">What are you craving?</span><h2>Explore our menu</h2></div>
          <p>Handpicked dishes, prepared fresh and ready when you are.</p>
        </div>

        {!loading && foodCat.length > 0 && (
          <div className="category-chips" aria-label="Food categories">
            <button className={!selectedCategory ? 'active' : ''} onClick={() => setSelectedCategory('')}>All dishes</button>
            {foodCat.map((category) => (
              <button
                key={category._id}
                className={selectedCategory === category.CategoryName ? 'active' : ''}
                onClick={() => setSelectedCategory(category.CategoryName)}
              >{category.CategoryName}</button>
            ))}
          </div>
        )}

        {error && <div className="error-state"><strong>We couldn’t load the menu.</strong><span>{error}</span><button className="btn btn-brand" onClick={loadData}>Try again</button></div>}

        {loading ? (
          <div className="menu-layout">
            <aside className="filter-skeleton skeleton-shine" />
            <div className="food-grid">{Array.from({ length: 6 }, (_, index) => <CardSkeleton key={index} />)}</div>
          </div>
        ) : !error && (
          <div className="menu-layout">
            <aside className="filter-panel">
              <div className="filter-title"><span><TuneRounded /> Filters</span><button onClick={resetFilters}>Reset</button></div>

              <label className="filter-label" htmlFor="categoryFilter">Category</label>
              <select id="categoryFilter" className="form-select" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                <option value="">All categories</option>
                {foodCat.map((category) => <option key={category._id} value={category.CategoryName}>{category.CategoryName}</option>)}
              </select>

              <fieldset className="filter-group">
                <legend>Price range</legend>
                {[
                  ['all', 'All prices'], ['low', 'Under ₹250'], ['medium', '₹250 – ₹500'], ['high', 'Above ₹500']
                ].map(([value, label]) => (
                  <label key={value} className="filter-radio">
                    <input type="radio" name="price" value={value} checked={priceFilter === value} onChange={(event) => setPriceFilter(event.target.value)} />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>

              <label className="filter-label" htmlFor="sortFilter">Sort by</label>
              <select id="sortFilter" className="form-select" value={sortOption} onChange={(event) => setSortOption(event.target.value)}>
                <option value="default">Recommended</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="alpha">Name: A to Z</option>
              </select>
            </aside>

            <section className="menu-results">
              <div className="results-toolbar"><span><strong>{filteredFoodItems.length}</strong> dishes available</span><span>Freshly made for you</span></div>
              {filteredFoodItems.length === 0 ? (
                <div className="empty-state modern-empty">
                  <span className="empty-state-icon"><RestaurantMenuRounded /></span>
                  <h3>No tasty matches yet</h3>
                  <p>Try another search or clear your filters to see the full menu.</p>
                  <button className="btn btn-brand" onClick={resetFilters}>View all dishes</button>
                </div>
              ) : (
                <div className="food-grid">
                  {filteredFoodItems.map((item, index) => (
                    <div className="food-card-entry" style={{ '--entry-delay': `${Math.min(index, 8) * 45}ms` }} key={item._id}>
                      <Card foodItem={item} options={item.options?.[0] || {}} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
