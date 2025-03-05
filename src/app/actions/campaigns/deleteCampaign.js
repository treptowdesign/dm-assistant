"use server";

import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/actions/auth/getUser";

export async function deleteCampaign(campaignId) {
  try {
    const user = await getUserFromServer();
    if (!user) return { error: "Unauthorized" };

    await prisma.campaign.delete({
      where: { id: parseInt(campaignId, 10), authorId: user.id },
    });

    return { message: "Campaign deleted" };
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return { error: "Internal server error" };
  }
}
