//this context will wrap your applicaition and provide the audio player
'use client';

import { AudioContextType, AudioProps } from "@/types";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AudioContext= createContext<AudioContextType | undefined>(undefined);
const AudioProvider = ({children}:{children: React.ReactNode}) => {
    const [audio, setAudio] = useState<AudioProps | undefined>(undefined);
    const pathname= usePathname();

    useEffect(()=>{
        //dont play audio on create podcast page
        if(pathname==='/create-podcast') setAudio(undefined);
    },[pathname]);

    return (
        <AudioContext.Provider value={{audio,setAudio}}>
            {children}
        </AudioContext.Provider>
    );
}

export const useAudio =()=>{
    const context= useContext(AudioContext);
    if(!context)
        throw new Error('useAudio must be used within AudioProvider');
    return context;
};

export default AudioProvider;
