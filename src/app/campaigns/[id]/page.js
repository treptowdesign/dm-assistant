"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; 

export default function CampaignPage() {
  const params = useParams(); 
  const router = useRouter(); // ✅ Needed for redirection
  const id = params.id; 

  const [campaign, setCampaign] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchCampaign() {
      const res = await fetch(`/api/campaigns/${id}`);
      const data = await res.json();
      if (!res.ok) {
        console.error("Error fetching campaign:", data.error);
        return;
      }
      setCampaign(data);
      setName(data.name);
      setDescription(data.description);
    }

    fetchCampaign();
  }, [id]);

  async function updateCampaign() {
    const res = await fetch(`/api/campaigns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      setCampaign((prev) => ({ ...prev, name, description }));
    } else {
      console.error("Error updating campaign");
    }
  }

  async function deleteCampaign() {
    const confirmDelete = window.confirm("Are you sure you want to delete this campaign?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });

    if (res.ok) {
      router.push("/campaigns"); // redirect to campaign list after deletion
    } else {
      console.error("Error deleting campaign");
    }
  }

  if (!campaign) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Campaign</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={updateCampaign}>Save</button>
      <button onClick={deleteCampaign} style={{ color: "red", marginLeft: "10px" }}>
        Delete Campaign
      </button>
    </div>
  );
}
