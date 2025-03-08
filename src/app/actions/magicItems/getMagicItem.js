"use server";

import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/actions/auth/getUser";

export async function getMagicItem(magicItemId) {
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

    return magicItem;
  } catch (error) {
    console.error("Error fetching magic item:", error);
    return { error: "Internal server error" };
  }
}
