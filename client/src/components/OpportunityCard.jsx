import { Link } from 'react-router-dom';

function OpportunityCard({ opportunity }) {
  const { id, title, organization, category, location, date, spots } = opportunity;
  const formattedDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Ongoing';

  return (
    <Link to={`/opportunities/${id}`} className="card-link">
      <div className="opportunity-card">
        <div className="card-category-tag">
          {category}
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="card-org">{organization}</p>
        <div className="card-meta">
          <span>📍 {location}</span>
          <span>📅 {formattedDate}</span>
          <span>👤 {spots} spots</span>
        </div>
      </div>
    </Link>
  );
}

export default OpportunityCard;
