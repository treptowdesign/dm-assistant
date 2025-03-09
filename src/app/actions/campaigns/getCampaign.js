"use server";

import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/actions/auth/getUser";

export async function getCampaign(campaignId) {
  try {
    const user = await getUserFromServer();
    if (!user) return { error: "Unauthorized" };

    const campaign = await prisma.campaign.findUnique({
      where: { id: parseInt(campaignId, 10), authorId: user.id },
      include: { magicItems: true }, // fetch related Magic Items
    });

    if (!campaign) return { error: "Campaign not found" };

    return campaign;
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return { error: "Internal server error" };
  }
}
