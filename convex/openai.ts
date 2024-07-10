//this is actions for openai api
//actions call call third party apis
//we use action constructors to create actions-> pass object with its args and a handler function
//actions also have access to ctx, which allows to read data from convex data store
//unlike query, actions can but dont need to return a value


// To read data from the database use the runQuery field, and call a query that performs the read
// To write data to the database use the runMutation field, and call a mutation that performs the write
import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, {voice, input}) => {
    //we want to call openai api to generate audio
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice as SpeechCreateParams["voice"],
        input,
      });
      const buffer = await mp3.arrayBuffer();
      return buffer;
   },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string(),},
  handler: async (_, {prompt}) => {
    //we want to call openai api to generate audio
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
    });
      const url =response.data[0].url;
      if(!url) {
        throw new Error("Error generating thumbnail");
      };
      const imageResponse= await fetch(url);
      const buffer = await imageResponse.arrayBuffer();
      return buffer;
   },
});



