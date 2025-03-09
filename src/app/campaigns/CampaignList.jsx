"use client";

import Link from "next/link";

export default function CampaignList({ campaigns }) {
  return (
    <>
        <h2>CampaignsList (Campaign Dir)</h2>
        <ul>
        {campaigns.length === 0 ? (
            <p>No Campaigns Found</p>
        ) : (
            campaigns.map((campaign) => (
            <li key={campaign.id}>
                <Link href={`/campaigns/${campaign.id}`}>
                    <b>{campaign.name} (id: {campaign.id})</b>: 
                    <div>{campaign.description}</div>
                    <div>Magic Items: {campaign.magicItems.length}</div>
                </Link>
            </li>
            ))
        )}
        </ul>
    </>
    
  );
}
