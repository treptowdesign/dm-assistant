import { useEffect, useState } from "react";

export default function CampaignsList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Add loading state
  const [error, setError] = useState(null); // ✅ Track API errors

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch("/api/campaigns");
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        const data = await res.json();
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setError("Error loading campaigns. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  if (loading) return <p>Loading campaigns...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Campaigns</h1>
      {campaigns.length === 0 ? (
        <p>No Campaigns Found</p>
      ) : (
        <ul>
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <a href={`/campaigns/${campaign.id}`}>
                <b>{campaign.name}</b>: {campaign.description}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
