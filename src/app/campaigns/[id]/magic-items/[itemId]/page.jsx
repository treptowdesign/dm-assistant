"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getMagicItem } from "@/app/actions/magicItems/getMagicItem";
import { updateMagicItem } from "@/app/actions/magicItems/updateMagicItem";
import { deleteMagicItem } from "@/app/actions/magicItems/deleteMagicItem";
import { magicItemSchema } from "@/schema/MagicItem";
import TextControl from "@/app/components/toggle-inputs/TextControl.jsx";
import SelectControl from "@/app/components/toggle-inputs/SelectControl.jsx";
import CheckboxControl from "@/app/components/toggle-inputs/CheckboxControl.jsx";
import NumberControl from "@/app/components/toggle-inputs/NumberControl.jsx";
import TextareaControl from "@/app/components/toggle-inputs/TextareaControl.jsx";

import styles from "@/app/page.module.sass";

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
      console.log("Magic Item data:", data);
    }
    loadItem();
  }, [itemId]);

  function handleChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function toggleIsEditing(){
    setIsEditing(true);
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
    setIsEditing(false); // exit edit mode
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

        <div>

          <TextControl label="Name" name="name" 
            value={formData.name} onChange={handleChange} 
            isEditing={isEditing}
          />
          <SelectControl label="Type" name="type" 
            options={magicItemSchema.shape.type.options} 
            value={formData.type} onChange={handleChange} 
            isEditing={isEditing}
          />
          <SelectControl 
            label="Rarity" name="rarity" 
            options={magicItemSchema.shape.rarity.options} 
            value={formData.rarity} onChange={handleChange} 
            isEditing={isEditing}
          />
          <CheckboxControl
            label="Requires Attunement" name="requiresAttunement" 
            checked={formData.requiresAttunement} onChange={handleChange}
            isEditing={isEditing} 
          />
          <TextareaControl 
            label="Description" name="description" 
            value={formData.description} onChange={handleChange} 
            isEditing={isEditing} 
          />
          <NumberControl 
            label="Gold Value (GP)" name="valueGP" 
            value={formData.valueGP} onChange={handleChange} 
            isEditing={isEditing} 
          />

          <button onClick={isEditing ? handleUpdate : toggleIsEditing}>{isEditing? 'Save' : 'Edit'}</button>
        </div>

        <button onClick={handleDelete}>Delete Item</button>

        <div>
          <Link href={`/campaigns/${campaignId}`}>Back to Campaign</Link>
        </div>
      </main>
    </div>
  );
}
