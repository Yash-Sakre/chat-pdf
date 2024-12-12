import { mutation, query } from "./_generated/server";
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
        upgrade: false,
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

export const userUpgradePlan = mutation({
  args:{
    userEmail:v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.query('users').filter((q)=>q.eq(q.field('email'),args.userEmail)).collect()

    if(result){
      await ctx.db.patch(result[0]._id,{upgrade:true})
      return {
        success: true,
        message: "User upgraded to premium plan successfully"
      }
    }

    return {
      success: false,
      message: "User not found"
    }

  }
})

export const getUserInfo = query({
  args: { userEmail: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const result = await ctx.db.query("users").filter((q) =>
      q.eq(q.field("email"), args.userEmail)
    ).collect();

    if (result?.length > 0) {
      return result[0];
    }

    return null;
  },
})
