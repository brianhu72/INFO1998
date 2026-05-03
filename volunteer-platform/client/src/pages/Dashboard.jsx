import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OpportunityCard from '../components/OpportunityCard.jsx';

function Dashboard() {
  const { user, token, loading } = useAuth();
  const [saved, setSaved] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/login'); return; }

    fetch(`http://localhost:3001/api/users/${user.uid}/saved`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { setSaved(data); setFetching(false); })
      .catch(() => { setError('Could not load saved opportunities.'); setFetching(false); });
  }, [user, token, loading, navigate]);

  if (loading || !user) return null;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>My Dashboard</h1>
          <p>Welcome back, {user.name || user.email}.</p>
        </div>
      </div>

      <div className="container section">
        <h2>Saved Opportunities</h2>

        {fetching && <p className="status-msg">Loading your saved opportunities...</p>}
        {error && <p className="status-msg error">{error}</p>}

        {!fetching && !error && saved.length === 0 && (
          <div className="empty-state">
            <p>You haven't saved any opportunities yet.</p>
            <Link to="/opportunities" className="btn-primary">Browse opportunities</Link>
          </div>
        )}

        {!fetching && !error && saved.length > 0 && (
          <div className="card-grid">
            {saved.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
