import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: { userName: v.string(), email: v.string(), imageUrl: v.string() },
  handler: async (ctx, args) => {
    // user exists already
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (user?.length == 0) {
      await ctx.db.insert("users", {
        email: args.email,
        userName: args.userName,
        imageUrl: args.imageUrl,
      });

      return {
        success: true,
        message: "User created successfully",
      };
    }

    return {
      success: false,
      message: "User already exists",
    };
  },
});
