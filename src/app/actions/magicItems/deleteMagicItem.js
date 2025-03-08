"use server";

import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/actions/auth/getUser";
import { revalidatePath } from "next/cache";

export async function deleteMagicItem(magicItemId) {
  try {
    const user = await getUserFromServer();
    if (!user) return { error: "Unauthorized" };

    const magicItem = await prisma.magicItem.findUnique({
      where: { id: parseInt(magicItemId, 10) },
      include: { campaign: true },
    });

    if (!magicItem || magicItem.campaign.authorId !== user.id) {
      return { error: "Magic item not found or unauthorized." };
    }

    await prisma.magicItem.delete({ where: { id: magicItem.id } });

    revalidatePath(`/campaigns/${magicItem.campaignId}`);
  } catch (error) {
    console.error("Error deleting magic item:", error);
    return { error: "Internal server error" };
  }
}
