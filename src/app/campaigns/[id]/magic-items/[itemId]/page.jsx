"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getMagicItem } from "@/app/actions/magicItems/getMagicItem";
import { updateMagicItem } from "@/app/actions/magicItems/updateMagicItem";
import { deleteMagicItem } from "@/app/actions/magicItems/deleteMagicItem";
import { magicItemSchema } from "@/schema/MagicItem";
import styles from "@/app/page.module.css";

export default function MagicItemPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id;
  const itemId = params.itemId;

  const [formData, setFormData] = useState(magicItemSchema.parse({
    name: "",
    type: "Weapon",
    rarity: "Common",
    requiresAttunement: false,
    description: "",
    valueGP: 0,
  }));

  useEffect(() => {
    async function loadItem() {
      const data = await getMagicItem(itemId);
      if (data.error) {
        console.error("Error fetching magic item:", data.error);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        ...data, // Spread fetched data into the state
        valueGP: data.valueGP || 0, // Ensure undefined doesn't break the number input
      }));
    }
    loadItem();
  }, [itemId]);

  async function handleUpdate() {
    // Validate before sending
    const validation = magicItemSchema.safeParse(formData);
    if (!validation.success) {
      console.error("Validation failed:", validation.error.errors);
      return;
    }

    const formDataObject = new FormData();
    Object.entries(validation.data).forEach(([key, value]) => {
      formDataObject.append(key, value.toString());
    });

    const result = await updateMagicItem(itemId, formDataObject);
    if (result?.error) {
      console.error("Error updating magic item:", result.error);
    } else {
      setFormData(validation.data);
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm("Are you sure you want to delete this magic item?");
    if (!confirmDelete) return;

    const result = await deleteMagicItem(itemId);
    if (result?.error) {
      console.error("Error deleting magic item:", result.error);
    } else {
      router.push(`/campaigns/${campaignId}`);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    let newValue;
    switch (type) {
      case "checkbox":
        newValue = checked;
        break;
      case "number":
        newValue = value === "" ? undefined : Number(value);
        break;
      default:
        newValue = value;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  }

  if (!formData) return <div>Loading...</div>;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Edit Magic Item</h1>
        <div>
          <label>Name:</label>
          <input name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div>
          <label>Type:</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            {magicItemSchema.shape.type.options.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Rarity:</label>
          <select name="rarity" value={formData.rarity} onChange={handleChange}>
            {magicItemSchema.shape.rarity.options.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Requires Attunement:</label>
          <input type="checkbox" name="requiresAttunement" checked={formData.requiresAttunement} onChange={handleChange} />
        </div>

        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div>
          <label>Gold Value (GP):</label>
          <input type="number" name="valueGP" value={formData.valueGP} onChange={handleChange} />
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
