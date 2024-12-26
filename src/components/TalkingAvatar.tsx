import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TalkingAvatarProps {
  imageUrl: string;
  text: string;
  isPlaying: boolean;
  onPlaybackComplete: () => void;
}

export const TalkingAvatar = ({ imageUrl, text, isPlaying, onPlaybackComplete }: TalkingAvatarProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamUrl, setStreamUrl] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const createTalkingAvatar = async () => {
      if (!text || !isPlaying) return;

      try {
        const { data, error } = await supabase.functions.invoke('create-talking-avatar', {
          body: {
            imageUrl,
            text,
          }
        });

        if (error) throw error;

        if (data?.url) {
          setStreamUrl(data.url);
          if (videoRef.current) {
            videoRef.current.play();
          }
        }
      } catch (error) {
        console.error('Error creating talking avatar:', error);
        toast({
          title: "Error",
          description: "Failed to create talking avatar. Please try again.",
          variant: "destructive",
        });
      }
    };

    createTalkingAvatar();
  }, [text, isPlaying, imageUrl, toast]);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
      {streamUrl ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          onEnded={onPlaybackComplete}
          playsInline
        >
          <source src={streamUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={imageUrl}
          alt="Historical figure"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
};