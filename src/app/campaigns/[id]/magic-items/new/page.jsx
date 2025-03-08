"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createMagicItem } from "@/app/actions/magicItems/createMagicItem";
import { magicItemSchema } from "@/schema/MagicItem";
import styles from "@/app/page.module.css";

export default function NewMagicItemPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id;

  const [formData, setFormData] = useState(magicItemSchema.parse({
    name: "",
    type: "Weapon",
    rarity: "Common",
    requiresAttunement: false,
    description: "",
    valueGP: 0,
  }));
  const [errors, setErrors] = useState(null);


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
  
  
  async function handleSubmit(event) {
    event.preventDefault();

    // Validate input using Zod before sending
    const validation = magicItemSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(validation.error.errors);
      return;
    }

    const validatedData = validation.data;
    const formDataObject = new FormData();
    formDataObject.append("campaignId", campaignId);
    Object.entries(validatedData).forEach(([key, value]) => {
      formDataObject.append(key, value.toString());
    });

    const result = await createMagicItem(formDataObject);
    if (result?.error) {
      console.error("Error creating magic item:", result.error);
      setErrors([{ message: result.error }]); // Display error to user
    } else {
      router.push(`/campaigns/${campaignId}`);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Create Magic Item</h1>
        <form onSubmit={handleSubmit}>
          {errors && (
            <div className={styles.error}>
              {errors.map((err, index) => (
                <p key={index}>{err.message}</p>
              ))}
            </div>
          )}

          <div>
            <label>Name:</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
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
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div>
            <label>Gold Value (GP):</label>
            <input type="number" name="valueGP" value={formData.valueGP} onChange={handleChange} />
          </div>

          <button type="submit">Create Item</button>
        </form>

        <Link href={`/campaigns/${campaignId}`}>Back to Campaign</Link>
      </main>
    </div>
  );
}
