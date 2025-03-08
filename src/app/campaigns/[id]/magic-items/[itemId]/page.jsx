"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getMagicItem } from "@/app/actions/magicItems/getMagicItem";
import { updateMagicItem } from "@/app/actions/magicItems/updateMagicItem";
import { deleteMagicItem } from "@/app/actions/magicItems/deleteMagicItem";
import styles from "@/app/page.module.css";

export default function MagicItemPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id;
  const itemId = params.itemId;

  const [item, setItem] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("Weapon");
  const [rarity, setRarity] = useState("Common");
  const [requiresAttunement, setRequiresAttunement] = useState(false);
  const [description, setDescription] = useState("");
  const [valueGP, setValueGP] = useState("");

  useEffect(() => {
    async function loadItem() {
      const data = await getMagicItem(itemId);
      if (data.error) {
        console.error("Error fetching magic item:", data.error);
        return;
      }
      setItem(data);
      setName(data.name);
      setType(data.type);
      setRarity(data.rarity);
      setRequiresAttunement(data.requiresAttunement);
      setDescription(data.description);
      setValueGP(data.valueGP || ""); // Handle potential undefined values
    }

    loadItem();
  }, [itemId]);

  async function handleUpdate() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("rarity", rarity);
    formData.append("requiresAttunement", requiresAttunement.toString());
    formData.append("description", description);
    formData.append("valueGP", valueGP);

    const result = await updateMagicItem(itemId, formData);
    if (result && result.error) {
      console.error("Error updating magic item:", result.error);
    } else {
      setItem((prev) => ({
        ...prev,
        name,
        type,
        rarity,
        requiresAttunement,
        description,
        valueGP,
      }));
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm("Are you sure you want to delete this magic item?");
    if (!confirmDelete) return;

    const result = await deleteMagicItem(itemId);
    if (result && result.error) {
      console.error("Error deleting magic item:", result.error);
    } else {
      router.push(`/campaigns/${campaignId}`);
    }
  }

  if (!item) return <div>Loading...</div>;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Edit Magic Item</h1>
        <div>
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
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
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <label>Gold Value (GP):</label>
          <input type="number" value={valueGP} onChange={(e) => setValueGP(e.target.value)} />
        </div>

        <button onClick={handleUpdate}>Update Item</button>
        <button onClick={handleDelete}>Delete Item</button>

        <div>
          <Link href={`/campaigns/${campaignId}`}>Back to Campaign</Link>
        </div>
      </main>
    </div>
  );
}
