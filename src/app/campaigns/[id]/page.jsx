"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCampaign } from "@/app/actions/campaigns/getCampaign";
import { updateCampaign } from "@/app/actions/campaigns/updateCampaign";
import { deleteCampaign } from "@/app/actions/campaigns/deleteCampaign";
import styles from "@/app/page.module.css";

export default function CampaignPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [campaign, setCampaign] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadCampaign() {
      const data = await getCampaign(id);
      if (data.error) {
        console.error("Error fetching campaign:", data.error);
        return;
      }
      setCampaign(data);
      setName(data.name);
      setDescription(data.description);
    }

    loadCampaign();
  }, [id]);

  async function handleUpdateCampaign() {
    const result = await updateCampaign(id, name, description);
    if (!result.error) {
      setCampaign((prev) => ({ ...prev, name, description }));
    } else {
      console.error("Error updating campaign");
    }
  }

  async function handleDeleteCampaign() {
    const confirmDelete = window.confirm("Are you sure you want to delete this campaign?");
    if (!confirmDelete) return;

    const result = await deleteCampaign(id);
    if (!result.error) {
      router.push("/campaigns");
    } else {
      console.error("Error deleting campaign");
    }
  }

  if (!campaign) return <div>Loading...</div>;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Edit Campaign</h1>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <button onClick={handleUpdateCampaign}>Save</button>
        <button onClick={handleDeleteCampaign}>Delete Campaign</button>
        <div>
          <Link href="/campaigns/">Back to Campaigns</Link>
        </div>
      </main>
    </div>
  );
}
