//implemmneting a mutation , we will be using uploadStuff 
// Create a mutation that generates an upload URL
//Create a mutation that saves the file storage ID


// This mutation basically defines an endpoint that gives our UI a URL to upload files to. 
import { v } from "convex/values";
import { mutation } from "./_generated/server";
 
export const generateUploadUrl = mutation({
  args: {
    // ...
  },
  handler: async (ctx, args) => {
    return await ctx.storage.generateUploadUrl();
  },
});