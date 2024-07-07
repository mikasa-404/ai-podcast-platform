import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";

//clerk uses svix to validate webhook calls
import { Webhook } from "svix";


//this webhook will get called when we authenticate user from clerk's login
const handleClerkWebhook = httpAction(async (ctx, request) => {

    //type of event that is sent from clerk create, update, delete
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Error occured", {
      status: 400,
    });
  }
//set of actions when a user is created or updated or deleted
  switch (event.type) {
    //when a user is created we call our users.createUser mutation which we created in our convex file
    //this mutation will insert a new user in our database
    case "user.created": 
        await ctx.runMutation(internal.users.createUser, {
          clerkId: event.data.id,
          email: event.data.email_addresses[0].email_address,
          name: event.data.first_name!,
          imageUrl: event.data.image_url,
        });
        break;
    
    case "user.updated": 
        await ctx.runMutation(internal.users.updateUser, {
            clerkId: event.data.id,
            email: event.data.email_addresses[0].email_address,
            imageUrl: event.data.image_url,
        });
        break;
    
    case "user.deleted": 
        await ctx.runMutation(internal.users.deleteUser, {
            clerkId: event.data.id as string,
        });
        break;
  }
  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();
http.route({
  path: "/clerk",
  method: "POST",
  handler: handleClerkWebhook,
});
const validateRequest = async (
    req: Request
  ): Promise<WebhookEvent | undefined> => {
    // key note : add the webhook secret variable to the environment variables field in convex dashboard setting
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
    if (!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET is not defined");
    }
    const payloadString = await req.text();
    const headerPayload = req.headers;
    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id")!,
      "svix-timestamp": headerPayload.get("svix-timestamp")!,
      "svix-signature": headerPayload.get("svix-signature")!,
    };
    const wh = new Webhook(webhookSecret);
    const event = wh.verify(payloadString, svixHeaders);
    return event as unknown as WebhookEvent;
  };
  
  export default http;