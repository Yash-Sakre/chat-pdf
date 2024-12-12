import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});


export const UploadFileData = mutation({
  args:{
    fileId: v.string(),
    StorageId: v.string(),
    fileName: v.string(),
    createdBy: v.string(),
    fileUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("PdfFiles", {
      fileId: args.fileId,
      StorageId: args.StorageId,
      fileName: args.fileName,
      createdBy: args.createdBy,  
      fileUrl: args.fileUrl,
    });

    return {
      success: true,
      message: "File uploaded successfully",
    };
  }

})

export const getFileUrl = mutation( {
  args:{
    StorageId: v.string(),
  },
  handler: async (ctx, args) => {
  
    const fileUrl = await ctx.storage.getUrl(args.StorageId)
    return fileUrl

  }
})


export const getFileData = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const file = await ctx.db.query('PdfFiles').filter(q => q.eq(q.field('fileId'),args.fileId)).collect();

    return file;
  }
})

export const getallFiles = query({
  args:{  
    userEmail: v.string(),

  },
  handler: async (ctx,args) => {
    const files = await ctx.db.query('PdfFiles').filter(q=> q.eq(q.field('createdBy'),args.userEmail)).collect();

    return files;
  }
})