"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import Form from 'next/form';

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
      <h1>Campaigns!</h1>
      <Form onSubmit={handleCreateCampaign}>
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
      </Form>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
              <Link href={`/campaigns/${campaign.id}`}>
                  <b>{campaign.name}</b>: {campaign.description}
              </Link>
          </li>
        ))}
      </ul>
      <div>
        <Link href='/'>Back to Home</Link>
      </div>
    </div>
  );
}
