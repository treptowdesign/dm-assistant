import { NextResponse } from "next/server";
import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/lib/auth"; // Auth helper

export async function POST(req) {
  try {
    const user = await getUserFromServer();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description } = await req.json();
    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required." }, { status: 400 });
    }

    const newCampaign = await prisma.campaign.create({
      data: { name, description, authorId: user.id },
    });

    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getUserFromServer();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const campaigns = await prisma.campaign.findMany({
      where: { authorId: user.id },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
