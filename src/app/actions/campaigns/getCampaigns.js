"use server";

import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/actions/auth/getUser";

export async function getCampaigns() {
  try {
    const user = await getUserFromServer();
    if (!user) return { error: "Unauthorized" };

    const campaigns = await prisma.campaign.findMany({
      where: { authorId: user.id },
      include: { magicItems: true },
      orderBy: { id: "desc" },
    });

    // console.log("Campaigns:", campaigns);

    return campaigns;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return { error: "Internal server error" };
  }
}
