'use client';

import { useState } from "react";
import { createNewCampaign } from "@/app/actions/campaigns/createNewCampaign";

export default function NewCampaignForm() {
    const [formState, setFormState] = useState({ name: "", description: "" });
    const [error, setError] = useState(null);

    async function handleCreateCampaign() {
        setError(null);
        const result = await createNewCampaign(formState);
        if (result?.error) {
            setError(result.error);
        } else {
            if(result?.message) console.log(result.message);
            setFormState({ name: "", description: "" });
        }
    }

    return (
      <div>
        <h2>Create New Campaign:</h2>
        <input 
            type="text" 
            name="name" 
            placeholder="Campaign Name" 
            required 
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
        />
        <textarea 
            name="description" 
            placeholder="Description" 
            required 
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
        />
        <button onClick={handleCreateCampaign}>Create Campaign</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
}