"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCampaigns } from "@/app/actions/campaigns/getCampaigns";

export default function CampaignsList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCampaigns() {
      const data = await getCampaigns();
      if (data.error) {
        setError("Error loading campaigns.");
      } else {
        setCampaigns(data);
      }
      setLoading(false);
    }
    loadCampaigns();
  }, []);

  if (loading) return <p>Loading campaigns...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>
        <Link href="/campaigns">Campaigns</Link>
      </h1>
      {campaigns.length === 0 ? (
        <p>No Campaigns Found</p>
      ) : (
        <ul>
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <Link href={`/campaigns/${campaign.id}`}>
                <b>{campaign.name}</b>: {campaign.description}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
