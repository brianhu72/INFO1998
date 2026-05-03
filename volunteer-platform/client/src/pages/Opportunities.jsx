import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import OpportunityCard from '../components/OpportunityCard.jsx';

const CATEGORIES = ['Food & Hunger', 'Housing', 'Education', 'Healthcare', 'Community', 'Environment', 'Animals', 'Social Services'];

function Opportunities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);

    fetch(`http://localhost:3001/api/opportunities?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setOpportunities(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load opportunities. Is the server running?');
        setLoading(false);
      });
  }, [search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const q = formData.get('search');
    setSearchParams(q ? { search: q } : {});
  };

  const handleCategory = (cat) => {
    if (cat === category) {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Volunteer Opportunities</h1>
          <p>Find ways to serve the Ithaca community that match your interests and schedule.</p>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              name="search"
              type="text"
              placeholder="Search by keyword or organization..."
              defaultValue={search}
            />
            <button type="submit" className="btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="container listings-layout">
        {/* Sidebar filters */}
        <aside className="filters">
          <h3>Category</h3>
          <button
            className={`filter-btn ${!category ? 'active' : ''}`}
            onClick={() => setSearchParams({})}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* Results */}
        <div className="listings-results">
          {loading && <p className="status-msg">Loading...</p>}
          {error && <p className="status-msg error">{error}</p>}
          {!loading && !error && opportunities.length === 0 && (
            <p className="status-msg">No opportunities found. Try a different search.</p>
          )}
          {!loading && !error && opportunities.length > 0 && (
            <>
              <p className="results-count">{opportunities.length} {opportunities.length !== 1 ? 'opportunities' : 'opportunity'} found</p>
              <div className="card-grid">
                {opportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Opportunities;
