import React from 'react';
import { Slider } from "@/components/ui/slider";

interface RotateTextProps {
  rotation: number;
  handleAttributeChange: (id: number, attribute: string, value: any) => void;
  textSetId: number;
}

export const RotateText: React.FC<RotateTextProps> = ({ rotation, handleAttributeChange, textSetId }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Rotation: {rotation}°</span>
      </div>
      <Slider
        value={[rotation]}
        onValueChange={(value) => handleAttributeChange(textSetId, "rotation", value[0])}
        min={0}
        max={360}
        step={1}
      />
    </div>
  );
};