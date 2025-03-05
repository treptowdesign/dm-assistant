"use server";

import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/actions/auth/getUser";

export async function createCampaign(name, description) {
  try {
    const user = await getUserFromServer();
    if (!user) return { error: "Unauthorized" };

    if (!name || !description) {
      return { error: "Name and description are required." };
    }

    const newCampaign = await prisma.campaign.create({
      data: { name, description, authorId: user.id },
    });

    return { campaign: newCampaign };
  } catch (error) {
    console.error("Error creating campaign:", error);
    return { error: "Internal server error" };
  }
}
