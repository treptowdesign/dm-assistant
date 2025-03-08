"use server";

import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/actions/auth/getUser";
import { revalidatePath } from "next/cache";

export async function updateMagicItem(magicItemId, formData) {
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

    const name = formData.get("name");
    const type = formData.get("type");
    const rarity = formData.get("rarity");
    const requiresAttunement = formData.get("requiresAttunement") === "true";
    const description = formData.get("description");
    const valueGP = formData.get("valueGP") ? parseInt(formData.get("valueGP"), 10) : null;

    await prisma.magicItem.update({
      where: { id: magicItem.id },
      data: { name, type, rarity, requiresAttunement, description, valueGP },
    });

    revalidatePath(`/campaigns/${magicItem.campaignId}`);
  } catch (error) {
    console.error("Error updating magic item:", error);
    return { error: "Internal server error" };
  }
}
