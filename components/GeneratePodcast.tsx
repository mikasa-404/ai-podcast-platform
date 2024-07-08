import React, { useState } from "react";
import { GeneratePodcastProps } from "@/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { set } from "react-hook-form";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "./ui/use-toast";
import { title } from "process";

const useGeneratePodcast = ({
  audio,
  setAudio,
  setAudioDuration,
  setAudioStorageId,
  voiceType,
  voicePrompt,
  setVoicePrompt,
}: GeneratePodcastProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getPodcastAudio = useAction(api.openai.generateAudioAction);

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio("");
    if (!voicePrompt) {
      toast({
        title: "Please provide a prompt to generate podcast",
      });
      setIsGenerating(false);
      return;
    }
    try {
      //get podcast audio from api //pass voicePrompt and voiceType
      const response = await getPodcastAudio({
        input: voicePrompt,
        voice: voiceType,
      });
      const blob = new Blob([response], { type: "audio/mpeg" });
      const filename = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], filename, { type: "audio/mpeg" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);
      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error generating podcast!!",
        variant: "destructive",
      });
      console.log("Error generating podcast", error);
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatePodcast,
  };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);
  return (
    <div>
      <div className=" flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI prompt to generate podcast
        </Label>
        <Textarea
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
          className="input-class font-light focus-visible:ring-offset-green-1"
          placeholder="Provide text to generate podcast"
          rows={5}
        />
      </div>
      <div className="mt-10 w-full">
        <Button
          type="submit"
          className="text-16 w-full bg-green-1 py-4 font-bold text-white-1"
          onClick={generatePodcast}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader className="animate-spin ml-2" size={20} />
            </>
          ) : (
            "Generate Podcast"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
