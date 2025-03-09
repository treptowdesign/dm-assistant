"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createMagicItem } from "@/app/actions/magicItems/createMagicItem";
import { magicItemSchema } from "@/schema/MagicItem";
import TextInput from "@/app/components/inputs/TextInput";
import TextareaInput from "@/app/components/inputs/TextareaInput";
import SelectInput from "@/app/components/inputs/SelectInput";
import CheckboxInput from "@/app/components/inputs/CheckboxInput";
import NumberInput from "@/app/components/inputs/NumberInput";
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
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // validate before saving
    const validation = magicItemSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(validation.error.errors);
      return;
    }

    // convert to FormData obj 
    const formDataObject = new FormData();
    formDataObject.append("campaignId", campaignId);
    Object.entries(validation.data).forEach(([key, value]) => {
      formDataObject.append(key, value?.toString() ?? "");
    });

    const result = await createMagicItem(formDataObject);
    if (result?.error) {
      console.error("Error creating magic item:", result.error);
      setErrors([{ message: result.error }]);
    } else {
      router.push(`/campaigns/${campaignId}`);
    }
  }

  async function handleGenerateMagicItem() {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setErrors(null);

    try {
      const response = await fetch("/api/openai/generateMagicItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.error) {
        setErrors([{ message: data.error }]);
      } else {
        setFormData(data.response); // pop with generated item
      }
    } catch (error) {
      console.error("Error generating magic item:", error);
      setErrors([{ message: "Failed to generate magic item." }]);
    } finally {
      setLoading(false);
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

          <TextInput label="Name" name="name" value={formData.name} onChange={handleChange} />
          <SelectInput label="Type" name="type" value={formData.type} options={magicItemSchema.shape.type.options} onChange={handleChange} />
          <SelectInput label="Rarity" name="rarity" value={formData.rarity} options={magicItemSchema.shape.rarity.options} onChange={handleChange} />
          <CheckboxInput label="Requires Attunement" name="requiresAttunement" checked={formData.requiresAttunement} onChange={handleChange} />
          <TextareaInput label="Description" name="description" value={formData.description} onChange={handleChange} />
          <NumberInput label="Gold Value (GP)" name="valueGP" value={formData.valueGP} onChange={handleChange} />
          
          <button type="submit">Create Item</button>
        </form>

        <h2>Generate Magic Item</h2>
        <textarea
          placeholder="Describe the kind of magic item you'd like to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className={styles.textarea}
        />

        <button onClick={handleGenerateMagicItem} disabled={loading}>
          {loading ? "Generating..." : "Generate Magic Item"}
        </button>

        <Link href={`/campaigns/${campaignId}`}>Back to Campaign</Link>
      </main>
    </div>
  );
}
