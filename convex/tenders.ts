import { mutation , query } from "./_generated/server";
import { v } from "convex/values";


 export const getAllTenders = query({
  handler: async (ctx) => await ctx.db.query("tenders").collect(),
});

export const getTenderById = query({
  args: { id: v.number() },
  handler: async (ctx, args) => {
    
    const all = await ctx.db.query("tenders").collect();
  
    return all.find((t) => t.id === args.id);
  },
});
