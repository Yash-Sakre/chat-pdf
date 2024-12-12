"use node";

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import dotenv from "dotenv";
import { v } from "convex/values";

dotenv.config({ path: ".env" });

export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.any(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      throw new Error("Google API Key is not configured");
    }

    await ConvexVectorStore.fromTexts(
      args.splitText,
      { fileId: args.fileId },
      new GoogleGenerativeAIEmbeddings({
        apiKey: apiKey,
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      throw new Error("Google API Key is not configured");
    }

    try {
      const vectorStore = new ConvexVectorStore(
        new GoogleGenerativeAIEmbeddings({
          apiKey: apiKey,
          model: "text-embedding-004",
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        }),
        { ctx }
      );

      const rawResults = await vectorStore.similaritySearch(args.query, 1);
      console.log("Raw Results:", rawResults);

      const filteredResults = rawResults.filter(
        (q) => q.metadata?.fileId === args.fileId
      );
      console.log("Filtered Results:", JSON.stringify(filteredResults));

      return JSON.stringify(filteredResults);
    } catch (error) {
      console.error("Error during similarity search:", error);
      throw new Error("Search failed");
    }
  },
});
