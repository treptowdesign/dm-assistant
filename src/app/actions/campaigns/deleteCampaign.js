"use server";

import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/actions/auth/getUser";

export async function deleteCampaign(campaignId) {
  try {
    const user = await getUserFromServer();
    if (!user) return { error: "Unauthorized" };

    const campaign = await prisma.campaign.findUnique({
      where: { id: parseInt(campaignId, 10) },
      include: { magicItems: true }, // associated magic items
    });

    if (!campaign || campaign.authorId !== user.id) {
      return { error: "Campaign not found or unauthorized." };
    }

    // delete magic items 
    await prisma.magicItem.deleteMany({
      where: { campaignId: campaign.id },
    });

    // delete the campaign
    await prisma.campaign.delete({
      where: { id: campaign.id },
    });

    return { message: "Campaign and associated magic items deleted" };
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return { error: "Internal server error" };
  }
}
