"use server";

import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/actions/auth/getUser";

export async function getMagicItems(campaignId) {
  try {
    const user = await getUserFromServer();
    if (!user) return { error: "Unauthorized" };

    const campaign = await prisma.campaign.findUnique({
      where: { id: parseInt(campaignId, 10), authorId: user.id },
      include: { magicItems: true },
    });

    if (!campaign) return { error: "Campaign not found." };

    return campaign.magicItems;
  } catch (error) {
    console.error("Error fetching magic items:", error);
    return { error: "Internal server error" };
  }
}
