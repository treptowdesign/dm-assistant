"use server";
 
import { getCampaigns } from "@/app/actions/campaigns/getCampaigns";
import { createCampaign } from "@/app/actions/campaigns/createCampaign";
import Form from "next/form";
import styles from "@/app/campaigns/styles.module.sass"; 
import CampaignList from "./CampaignList"; // import Client Component
import CampaignsFooter from "./CampaignsFooter"; // import Client Component footer (for <Link>)

export default async function CampaignsPage() {

  const campaigns = await getCampaigns(); // fetch campaigns before rendering

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.headline}>Campaigns</h1>

        <Form action={createCampaign} className={styles.cform}> 
          <h2>Create New Campaign:</h2>
          <input type="text" name="name" placeholder="Campaign Name" required />
          <textarea name="description" placeholder="Description" required />
          <button type="submit">Create Campaign</button> 
        </Form>

        <CampaignList campaigns={campaigns} />

        <CampaignsFooter />

      </main>
    </div>
  );
}
