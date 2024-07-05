import internal from "stream";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";


//inser user-> you have to mutate// to getch do query
//PASS AN object to mutation with two arguments args and handler
//In handler you have acces to ctx-> context and args passed 
export const createUser=internalMutation({
    args:{
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
        imageUrl: v.string(),
    }, handler: async(ctx, args)=>{
        await ctx.db.insert('users', {
            clerkId: args.clerkId,
            email: args.email,
            name: args.name,
            imageUrl: args.imageUrl,
        })
    }
})