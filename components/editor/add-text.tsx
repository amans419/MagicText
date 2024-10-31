import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface AddTextProps {
  addNewTextSet: () => void;
}

export const AddText: React.FC<AddTextProps> = ({ addNewTextSet }) => {
  return (
    <Button onClick={addNewTextSet} className="w-full">
      <PlusIcon className="mr-2 h-4 w-4" /> Add Text
    </Button>
  );
};