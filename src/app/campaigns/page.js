"use client";

import { useEffect, useState } from "react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    const res = await fetch("/api/campaigns");
    const data = await res.json();
    setCampaigns(data);
  }

  async function handleCreateCampaign(event) {
    event.preventDefault();
    setLoading(true);

    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      fetchCampaigns(); // Refresh campaigns list
      setName("");
      setDescription("");
    }
    setLoading(false);
  }

  return (
    <div>
      <h1>Campaigns</h1>
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
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            <a href={`/campaigns/${campaign.id}`}>
            <b>{campaign.name}</b>: {campaign.description}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
