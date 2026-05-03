import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OpportunityCard from '../components/OpportunityCard.jsx';

const CATEGORIES = ['Food & Hunger', 'Housing', 'Education', 'Healthcare', 'Community', 'Environment', 'Animals', 'Social Services'];

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/opportunities')
      .then((res) => res.json())
      .then((data) => {
        setFeatured(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load opportunities. Is the server running?');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Volunteer in Ithaca.<br />Make it count.</h1>
          <p>
            Find local volunteering and shadowing opportunities in the Ithaca community —
            built for Cornell students who want to get involved and build real skills.
          </p>
          <Link to="/opportunities" className="btn-primary btn-lg">
            Browse Opportunities
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/opportunities?category=${encodeURIComponent(cat)}`}
                className="category-chip"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Upcoming Opportunities</h2>
            <Link to="/opportunities" className="view-all">View all →</Link>
          </div>
          {loading && <p className="status-msg">Loading opportunities...</p>}
          {error && <p className="status-msg error">{error}</p>}
          {!loading && !error && (
            <div className="card-grid">
              {featured.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container cta-inner">
          <h2>Ready to give back?</h2>
          <p>Create a free account to save opportunities and track your involvement.</p>
          <Link to="/login" className="btn-primary btn-lg">Get Started</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
