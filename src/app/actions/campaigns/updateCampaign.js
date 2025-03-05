"use server";

import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/actions/auth/getUser";

export async function updateCampaign(campaignId, name, description) {
  try {
    const user = await getUserFromServer();
    if (!user) return { error: "Unauthorized" };

    const campaign = await prisma.campaign.update({
      where: { id: parseInt(campaignId, 10), authorId: user.id },
      data: { name, description },
    });

    return { campaign };
  } catch (error) {
    console.error("Error updating campaign:", error);
    return { error: "Internal server error" };
  }
}
