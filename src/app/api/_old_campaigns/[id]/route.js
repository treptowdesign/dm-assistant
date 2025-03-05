import { NextResponse } from "next/server";
import prisma from "@/models/prismaClient";
import { getUserFromServer } from "@/app/lib/auth";

async function getCampaignId(params) { // get campaign id from params async & parse it to integer
  const { id } = await params;
  const campaignID = parseInt(id, 10);
  if (isNaN(campaignID)) throw new Error("Invalid campaign ID");
  return campaignID;
}

export async function GET(req, { params }) {
  try {
    const user = await getUserFromServer();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const campaignId = await getCampaignId(params); // get campaign id, parse it to integer

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId, authorId: user.id },
    });

    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await getUserFromServer();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const campaignId = await getCampaignId(params); // get campaign id, parse it to integer
    const { name, description } = await req.json();

    const campaign = await prisma.campaign.update({
      where: { id: campaignId, authorId: user.id },
      data: { name, description },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromServer();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const campaignId = await getCampaignId(params); // get campaign id, parse it to integer

    await prisma.campaign.delete({
      where: { id: campaignId, authorId: user.id },
    });

    return NextResponse.json({ message: "Campaign deleted" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
