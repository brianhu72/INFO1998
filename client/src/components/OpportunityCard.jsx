function getLinkLabel(url) {
  if (!url) return null;
  if (url.startsWith('mailto:')) return 'Email';
  if (/\.pdf(\?|$)/i.test(url)) return 'View PDF';
  if (/\.docx(\?|$)/i.test(url)) return 'Download Flyer';
  if (url.includes('drive.google.com')) return 'View Flyer';
  if (url.includes('docs.google.com/forms') || url.includes('google.com/forms')) return 'Sign Up';
  if (url.includes('etapestry.com') || url.includes('charityproud.org')) return 'Sign Up';
  if (url.includes('volunteerconnection.redcross.org')) return 'Apply';
  if (/\/(volunteer|become-a-volunteer|signup|sign-up|register)\b/i.test(url)) return 'Sign Up';
  return 'Learn More';
}

function parseTitle(title) {
  const idx = title.indexOf(': ');
  if (idx > 0) return { org: title.slice(0, idx), role: title.slice(idx + 2) };
  return { org: null, role: title };
}

function firstSentences(text, maxChars = 160) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;
  const match = clean.match(/^(.+?[.!?])\s/);
  if (match && match[1].length <= maxChars) return match[1];
  return clean.slice(0, maxChars).replace(/\s+\S*$/, '') + '…';
}

function OpportunityCard({ opportunity }) {
  const { title, description, url } = opportunity;
  const { org, role } = parseTitle(title || '');
  const label = getLinkLabel(url);
  const snippet = firstSentences(description);

  return (
    <div className="opportunity-card">
      {org && <p className="card-org-tag">{org}</p>}
      <h3 className="card-title">{role}</h3>
      {snippet && <p className="card-description">{snippet}</p>}
      {url && label && (
        <a
          href={url}
          target={url.startsWith('mailto:') ? undefined : '_blank'}
          rel="noopener noreferrer"
          className="card-cta"
        >
          {label} →
        </a>
      )}
    </div>
  );
}

export default OpportunityCard;
