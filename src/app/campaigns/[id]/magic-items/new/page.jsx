"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createMagicItem } from "@/app/actions/magicItems/createMagicItem";
import styles from "@/app/page.module.css";

export default function NewMagicItemPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id;

  const [name, setName] = useState("");
  const [type, setType] = useState("Weapon");
  const [rarity, setRarity] = useState("Common");
  const [requiresAttunement, setRequiresAttunement] = useState(false);
  const [description, setDescription] = useState("");
  const [valueGP, setValueGP] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("campaignId", campaignId);
    formData.append("name", name);
    formData.append("type", type);
    formData.append("rarity", rarity);
    formData.append("requiresAttunement", requiresAttunement.toString());
    formData.append("description", description);
    formData.append("valueGP", valueGP);

    const result = await createMagicItem(formData);
    if (result && result.error) {
        console.error("Error creating magic item:", result.error);
    } else {
        router.push(`/campaigns/${campaignId}`);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Create Magic Item</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Type:</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    {["Weapon", "Armor", "Wondrous Item", "Potion", "Ring", "Rod", "Scroll", "Staff", "Wand", "Other"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div> 
            <div>
                <label>Rarity:</label>
                <select value={rarity} onChange={(e) => setRarity(e.target.value)}>
                    {["Common", "Uncommon", "Rare", "Very Rare", "Legendary", "Artifact", "Varies"].map((r) => (
                    <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Requires Attunement:</label>
                <input type="checkbox" checked={requiresAttunement} onChange={(e) => setRequiresAttunement(e.target.checked)} />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
                <label>Gold Value (GP):</label>
                <input type="number" value={valueGP} onChange={(e) => setValueGP(e.target.value)} />
            </div>
            <button type="submit">Create Item</button>
        </form>

        <Link href={`/campaigns/${campaignId}`}>Back to Campaign</Link>
      </main>
    </div>
  );
}
