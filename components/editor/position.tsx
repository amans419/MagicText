import React, { useState } from "react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

interface PositionProps {
  onMove: (direction: "left" | "right" | "up" | "down", pixels: number) => void;
}

const Position = ({ onMove }: PositionProps) => {
  const [moveBy, setMoveBy] = useState(7);

  const handleSliderChange = (value: number[]) => {
    setMoveBy(value[0]);
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Move by: {moveBy}px</span>
          <Slider
            value={[moveBy]}
            onValueChange={handleSliderChange}
            max={50}
            step={1}
            className="w-[200px]"
          />
        </div>
        <div className="flex justify-center space-x-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onMove("left", moveBy)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onMove("right", moveBy)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onMove("down", moveBy)}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onMove("up", moveBy)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Position;
