"use server";

// createCampaign - this action uses takes formData from the server <Form> to create a new campaign

import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/actions/auth/getUser";
import { revalidatePath } from "next/cache";

export async function createCampaign(formData) { // accept formData for <Form> component
  try {
    const user = await getUserFromServer();
    if (!user) return { error: "Unauthorized" };

    const name = formData.get("name"); // extract values from formData
    const description = formData.get("description");

    if (!name || !description) {
      return { error: "Name and description are required." };
    }

    await prisma.campaign.create({
      data: { name, description, authorId: user.id },
    });

    revalidatePath("/campaigns"); // refresh the cache so the new campaign appears
  } catch (error) {
    console.error("Error creating campaign:", error);
    return { error: "Internal server error" };
  }
}
