"use server";

import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/actions/auth/getUser";
import { revalidatePath } from "next/cache";

export async function createMagicItem(formData) {
  try {
    const user = await getUserFromServer();
    if (!user) return { error: "Unauthorized" };

    const campaignId = parseInt(formData.get("campaignId"), 10);
    const name = formData.get("name");
    const type = formData.get("type");
    const rarity = formData.get("rarity");
    const requiresAttunement = formData.get("requiresAttunement") === "true";
    const description = formData.get("description");
    const valueGP = formData.get("valueGP") ? parseInt(formData.get("valueGP"), 10) : null;

    if (!campaignId || !name || !type || !rarity || !description) {
      return { error: "All fields except ValueGP are required." };
    }

    await prisma.magicItem.create({
      data: { name, type, rarity, requiresAttunement, description, valueGP, campaignId },
    });

    revalidatePath(`/campaigns/${campaignId}`);
  } catch (error) {
    console.error("Error creating magic item:", error);
    return { error: "Internal server error" };
  }
}
