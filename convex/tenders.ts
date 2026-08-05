import { mutation , query } from "./_generated/server";
import { v } from "convex/values";


 export const getAllTenders = query({
  handler: async (ctx) => await ctx.db.query("tenders").collect(),
});