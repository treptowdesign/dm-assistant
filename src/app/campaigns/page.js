"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCampaigns } from "@/app/actions/campaigns/getCampaigns";
import { createCampaign } from "@/app/actions/campaigns/createCampaign";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadCampaigns() {
    setLoading(true);
    const data = await getCampaigns();
    if (data.error) {
      setError("Error loading campaigns.");
    } else {
      setCampaigns(data);
      setError(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCampaigns(); 
  }, []);

  async function handleCreateCampaign(event) {
    event.preventDefault();
    setLoading(true);

    const result = await createCampaign(name, description);
    if (!result.error) {
      setName("");
      setDescription("");
      await loadCampaigns(); 
    } else {
      setError("Error creating campaign.");
    }
    setLoading(false);
  }

  return (
    <div>
      <h1>Campaigns!</h1>
      <form onSubmit={handleCreateCampaign}>
        <input
          type="text"
          placeholder="Campaign Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Campaign"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading campaigns...</p>
      ) : (
        <ul>
          {campaigns.length === 0 ? (
            <p>No Campaigns Found</p>
          ) : (
            campaigns.map((campaign) => (
              <li key={campaign.id}>
                <Link href={`/campaigns/${campaign.id}`}>
                  <b>{campaign.name}</b>: {campaign.description}
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
      <div>
        <Link href="/">Back to Home</Link>
      </div>
    </div>
  );
}
