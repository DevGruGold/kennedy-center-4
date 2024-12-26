import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface SimulationControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const SimulationControls = ({
  isPlaying,
  onPlay,
  onPause,
  onReset,
}: SimulationControlsProps) => {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      {!isPlaying ? (
        <Button
          onClick={onPlay}
          className="bg-primary hover:bg-primary/90"
          size="sm"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Demo
        </Button>
      ) : (
        <Button
          onClick={onPause}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
          size="sm"
        >
          <Pause className="w-4 h-4 mr-2" />
          Pause
        </Button>
      )}
      <Button
        onClick={onReset}
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10"
        size="sm"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>
    </div>
  );
};