import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import OpportunityCard from '../components/OpportunityCard.jsx';

function Opportunities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const search = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3001/api/opportunities')
      .then((res) => res.json())
      .then((data) => {
        setAllOpportunities(data.opportunities || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load opportunities. Is the server running?');
        setLoading(false);
      });
  }, []);

  const opportunities = search
    ? allOpportunities.filter(
        (opp) =>
          opp.title?.toLowerCase().includes(search.toLowerCase()) ||
          opp.description?.toLowerCase().includes(search.toLowerCase())
      )
    : allOpportunities;

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const q = formData.get('search');
    setSearchParams(q ? { search: q } : {});
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

      <div className="container listings-page">
        {loading && <p className="status-msg">Loading...</p>}
        {error && <p className="status-msg error">{error}</p>}
        {!loading && !error && opportunities.length === 0 && (
          <p className="status-msg">No opportunities found. Try a different search.</p>
        )}
        {!loading && !error && opportunities.length > 0 && (
          <>
            <p className="results-count">
              {opportunities.length} {opportunities.length !== 1 ? 'opportunities' : 'opportunity'} found
            </p>
            <div className="card-grid">
              {opportunities.map((opp, i) => (
                <OpportunityCard key={opp.url || i} opportunity={opp} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Opportunities;
