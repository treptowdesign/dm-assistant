"use server";

// this action accepts data from the CLIENT <form> and creates a new campaign 

import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/actions/auth/getUser";
import { revalidatePath } from "next/cache";

export async function createNewCampaign({name, description}) {
    try {
        const user = await getUserFromServer();
        if (!user) return { error: "Unauthorized" };
    
        if (!name || !description) {
            return { error: "Name and description are required." };
        }
    
        await prisma.campaign.create({
            data: { name, description, authorId: user.id },
        });
        
        revalidatePath("/campaigns");
        return { message: `Campaign created: ${name}` };
    } catch (error) {
        console.error("Error creating campaign:", error);
        return { error: "Internal server error" };
    }
}