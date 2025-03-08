import { z } from "zod";

export const magicItemSchema = z.object({
  name: z.string(),
  type: z.enum([
    "Weapon",
    "Armor",
    "Wondrous Item",
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
  attunementDetails: z.string().optional(), // explanation if attunement is needed
  description: z.string(), // main item effect and lore
  effects: z.array(z.string()).optional(), // list of mechanical effects
  charges: z.number().optional(), // number of uses before depletion
  recharge: z.enum(["None", "Dawn", "Short Rest", "Long Rest", "Special"]).optional(), // Recharge mechanism
  modifiers: z
    .array(
      z.object({
        stat: z.enum(["STR", "DEX", "CON", "INT", "WIS", "CHA"]),
        bonus: z.number(),
      })
    )
    .optional(), // ability score bonuses
  bonuses: z
    .array(
      z.object({
        type: z.enum(["Attack", "Damage", "AC", "Saving Throw", "Skill Check"]),
        value: z.number(),
      })
    )
    .optional(), // bonuses to attack rolls, AC, saves, etc.
  chargesDetails: z.string().optional(), // if the item has limited uses
  spells: z
    .array(
      z.object({
        name: z.string(),
        level: z.number(),
        castAs: z.enum(["Self", "Touch", "Ranged", "Area"]).optional(),
        saveDC: z.number().optional(),
        recharge: z.enum(["None", "Dawn", "Short Rest", "Long Rest", "Special"]).optional(),
      })
    )
    .optional(), // spells an item can cast
  curse: z.string().optional(), // if the item is cursed
  craftingRequirements: z.string().optional(), // optional details for crafting
  valueGP: z.number().optional(), // gold value if applicable
});
