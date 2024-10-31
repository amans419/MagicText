import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

interface RemoveTextProps {
  removeTextSet: (id: number) => void;
  textSetId: number;
}

export const RemoveText: React.FC<RemoveTextProps> = ({ removeTextSet, textSetId }) => {
  return (
    <Button onClick={() => removeTextSet(textSetId)} variant="destructive" className="w-full">
      <Trash2Icon className="mr-2 h-4 w-4" /> Remove Text
    </Button>
  );
};