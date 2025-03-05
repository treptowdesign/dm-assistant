"use server";

import { getCampaigns } from "@/app/actions/campaigns/getCampaigns";
import { createCampaign } from "@/app/actions/campaigns/createCampaign";
import Form from "next/form";
import styles from "@/app/page.module.css";
import CampaignList from "./CampaignList"; // import Client Component
import CampaignsFooter from "./CampaignsFooter"; // import Client Component footer (for <Link>)

export default async function CampaignsPage() {
  const campaigns = await getCampaigns(); // fetch campaigns before rendering

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Campaigns</h1>

        <Form action={createCampaign}> 
          <input type="text" name="name" placeholder="Campaign Name" required />
          <textarea name="description" placeholder="Description" required />
          <button type="submit">Create Campaign!?!?!?</button> 
        </Form>

        <CampaignList campaigns={campaigns} /> {/* pass data to Client Component */}

        <CampaignsFooter />

      </main>
    </div>
  );
}
