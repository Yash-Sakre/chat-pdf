import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

// Remove dotenv for production
// In production, use environment-specific configuration

export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.any(),
  },
  handler: async (ctx, args) => {
    // Use a more robust environment variable check
    const apiKey = process.env.GOOGLE_API_KEY || '';
    if (!apiKey) {
      console.error("Missing Google API Key");
      throw new Error("Google API Key is not configured");
    }

    try {
      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: apiKey,
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      });

      await ConvexVectorStore.fromTexts(
        args.splitText,
        { fileId: args.fileId },
        embeddings,
        { ctx }
      );
    } catch (error) {
      console.error("Detailed Error during ingestion:", error);
      throw new Error(`Ingestion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY || '';
    if (!apiKey) {
      console.error("Missing Google API Key");
      throw new Error("Google API Key is not configured");
    }

    try {
      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: apiKey,
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      });

      const vectorStore = new ConvexVectorStore(embeddings, { ctx });
      
      const rawResults = await vectorStore.similaritySearch(args.query, 1);
      console.log("Raw Results:", rawResults);
      
      const filteredResults = rawResults.filter(
        (q) => q.metadata?.fileId === args.fileId
      );
      
      console.log("Filtered Results:", JSON.stringify(filteredResults));
      return JSON.stringify(filteredResults);
    } catch (error) {
      console.error("Detailed Error during similarity search:", error);
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});