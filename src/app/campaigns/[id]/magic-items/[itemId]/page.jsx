"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getMagicItem } from "@/app/actions/magicItems/getMagicItem";
import { updateMagicItem } from "@/app/actions/magicItems/updateMagicItem";
import { deleteMagicItem } from "@/app/actions/magicItems/deleteMagicItem";
import { magicItemSchema } from "@/schema/MagicItem";
import TextInput from "@/app/components/inputs/TextInput";
import TextareaInput from "@/app/components/inputs/TextareaInput";
import SelectInput from "@/app/components/inputs/SelectInput";
import CheckboxInput from "@/app/components/inputs/CheckboxInput";
import NumberInput from "@/app/components/inputs/NumberInput";
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
  const [errors, setErrors] = useState(null);

  const [isEditing, setIsEditing] = useState(false); // toggle edit mode

  useEffect(() => {
    async function loadItem() {
      const data = await getMagicItem(itemId);
      if (data.error) {
        console.error("Error fetching magic item:", data.error);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        ...data,
        valueGP: data.valueGP || 0, // optional val
      }));
    }
    loadItem();
  }, [itemId]);

  function handleChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleUpdate(e) {
    // e.preventDefault();
    // validate 
    const validation = magicItemSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(validation.error.errors);
      return;
    }

    const formDataObject = new FormData();
    Object.entries(validation.data).forEach(([key, value]) => {
      formDataObject.append(key, value?.toString() ?? "");
    });

    const result = await updateMagicItem(itemId, formDataObject);
    if (result?.error) {
      console.error("Error updating magic item:", result.error);
      setErrors([{ message: result.error }]);
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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Edit Magic Item</h1>

        {errors && (
          <div className={styles.error}>
            {errors.map((err, index) => (
              <p key={index}>{err.message}</p>
            ))}
          </div>
        )}

        <button onClick={() => setIsEditing((prev) => !prev)}>{isEditing? 'Save' : 'Edit'}</button>

        <div style={isEditing ? {border: "solid 1px red"} :  { border: "solid 1px transparent" }}>
          <TextInput label="Name" name="name" 
            value={formData.name} onChange={handleChange} 
          />
          <SelectInput label="Type" name="type" 
            options={magicItemSchema.shape.type.options} 
            value={formData.type} onChange={handleChange} 
          />
          <SelectInput 
            label="Rarity" name="rarity" 
            options={magicItemSchema.shape.rarity.options} 
            value={formData.rarity} onChange={handleChange} 
          />
          <CheckboxInput 
            label="Requires Attunement" name="requiresAttunement" 
            checked={formData.requiresAttunement} onChange={handleChange} 
          />
          <TextareaInput 
            label="Description" name="description" 
            value={formData.description} onChange={handleChange} 
          />
          <NumberInput 
            label="Gold Value (GP)" name="valueGP" 
            value={formData.valueGP} onChange={handleChange} 
          />
          <button onClick={handleUpdate}>Update Item</button>
        </div>

        <button onClick={handleDelete}>Delete Item</button>

        <div>
          <Link href={`/campaigns/${campaignId}`}>Back to Campaign</Link>
        </div>
      </main>
    </div>
  );
}
