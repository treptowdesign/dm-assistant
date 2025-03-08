import { z } from "zod";

export const magicItemSchema = z.object({
  name: z.string(),
  type: z.enum([
    "Weapon",
    "Armor",
    "Potion",
    "Ring",
    "Rod",
    "Scroll",
    "Staff",
    "Wand",
    "Wondrous Item",
    "Other",
  ]),
  rarity: z.enum([
    "Common",
    "Uncommon",
    "Rare",
    "Very Rare",
    "Legendary",
    "Artifact",
    "Varies",
  ]),
  requiresAttunement: z.boolean().optional(),
  description: z.string(), // main item effect and lore
  valueGP: z.number().optional(), // gold value if applicable
});
