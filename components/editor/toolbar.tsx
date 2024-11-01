"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AddText } from "./add-text";
import { RemoveText } from "./remove-text";
import { RotateText } from "./rotate-text";
import FontFamilyPicker from "./font-picker";
import {
  Palette,
  Edit,
  Trash,
  Copy,
  MoveUp,
  MoveDown,
  Move,
  Layers,
  Type,
  Hexagon,
  Square,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  RotateCw,
} from "lucide-react";
import InputField from "./input-field";
import ColorPicker from "./color-picker";
import Position from "./position";
// import StrokeSettings from "./stroke-setting";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";

type Tool = {
  name: string;
  icon: React.ReactNode;
  settings: React.ReactNode;
};
interface ToolbarProps {
  onToolSelect: (toolName: string) => void;
  textSets: Array<any>;
  setTextSets: React.Dispatch<React.SetStateAction<Array<any>>>;
}
interface TextSet {
  id: number;
  text: string;
  color: string;
  fontFamily: string;
  // Add other properties if needed
}

export default function Toolbar({
  onToolSelect,
  textSets = [],
  setTextSets,
}: ToolbarProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
  const [newText, setNewText] = useState("");
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [currentFont, setCurrentFont] = useState<string>("Inter");
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const lastScrollTime = useRef<number>(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const handleAttributeChange = (id: number, attribute: string, value: any) => {
    setTextSets((prev) =>
      prev.map((set) => {
        if (set.id === id) {
          const updatedSet = { ...set, [attribute]: value };
          if (attribute === "fontFamily") {
            setCurrentFont(value);
          }
          return updatedSet;
        }
        return set;
      })
    );
  };

  const addNewTextSet = (text: string) => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    setTextSets((prev) => [
      ...prev,
      {
        id: newId,
        text: text,
        fontFamily: "Inter",
        top: 0,
        left: 0,
        color: "white",
        fontSize: 26,
        fontWeight: 400,
        opacity: 1,
        rotation: 0,
      },
    ]);
    setSelectedTextId(newId);
  };

  const removeTextSet = (id: number) => {
    setTextSets((prev) => prev.filter((set) => set.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
  };

  const handleMove = (
    id: number,
    direction: "left" | "right" | "up" | "down",
    pixels: number
  ) => {
    setTextSets((prev) =>
      prev.map((set) => {
        if (set.id !== id) return set;
        switch (direction) {
          case "left":
            return { ...set, left: set.left - pixels };
          case "right":
            return { ...set, left: set.left + pixels };
          case "up":
            return { ...set, top: set.top - pixels };
          case "down":
            return { ...set, top: set.top + pixels };
          default:
            return set;
        }
      })
    );
  };

  const handleScroll = () => {
    const now = Date.now();
    lastScrollTime.current = now;
    setIsScrolling(true);

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      const timeSinceLastScroll = Date.now() - lastScrollTime.current;
      if (timeSinceLastScroll >= 150) {
        setIsScrolling(false);
      }
    }, 150);
  };

  const handleToolClick = (toolName: string) => {
    if (isScrolling) {
      return;
    }

    if (textSets.length === 0 && toolName !== "Add Text") {
      toast({
        variant: "destructive",
        title: "Add at least one text first",
        description: "You need to add text before using other tools",
      });
      return;
    }
    setSelectedTool(toolName);
    onToolSelect(toolName);
  };

  const handleBackClick = () => {
    setSelectedTool(null);
    setValidationMessage("");
  };

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const handleAddNewText = () => {
    if (newText.trim() === "") {
      setValidationMessage("Please enter at least 1 character.");
    } else {
      addNewTextSet(newText);
      setNewText("");
      setSelectedTool(null);
      setValidationMessage(""); // Clear validation message
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tools: Tool[] = [
    {
      name: "Layers",
      icon: <Layers className="h-4 w-4" />,
      settings: (
        <div className="space-y-4">
          {textSets.map((textSet) => (
            <Button
              key={textSet.id}
              variant={selectedTextId === textSet.id ? "default" : "outline"}
              onClick={() => setSelectedTextId(textSet.id)}
            >
              {textSet.text || `Text Layer ${textSet.id}`}
            </Button>
          ))}
        </div>
      ),
    },
    {
      name: "Add Text",
      icon: <Type className="h-4 w-4" />,
      settings: (
        <div className="space-y-4">
          <InputField
            attribute="newText"
            label="Enter text "
            currentValue={newText}
            handleAttributeChange={(attribute, value) => setNewText(value)}
          />
          <AddText addNewTextSet={handleAddNewText} />
        </div>
      ),
    },
    {
      name: "Color",
      icon: <Palette className="h-4 w-4" />,
      settings: (
        <div className="space-y-4">
          {selectedTextId !== null && (
            <ColorPicker
              attribute="color"
              label="Text Color"
              currentColor={
                textSets.find((set) => set.id === selectedTextId)?.color || ""
              }
              handleAttributeChange={(attribute, value) =>
                handleAttributeChange(selectedTextId, attribute, value)
              }
            />
          )}
        </div>
      ),
    },
    // {
    //   name: "Stroke",
    //   icon: <Edit className="h-4 w-4" />, // Use an appropriate icon
    //   settings: (
    //     <StrokeSettings
    //       strokeWidth={strokeWidth}
    //       strokeColor={strokeColor}
    //       onStrokeWidthChange={handleStrokeWidthChange}
    //       onStrokeColorChange={handleStrokeColorChange}
    //     />
    //   ),
    // },
    {
      name: "Size",
      icon: <Edit className="h-4 w-4" />,
      settings: (
        <div className="space-y-4">
          {selectedTextId !== null && (
            <div className="space-y-2">
              <span>
                Font Size:
                {textSets.find((set) => set.id === selectedTextId)?.fontSize}
                vw
              </span>
              <Slider
                value={[
                  textSets.find((set) => set.id === selectedTextId)?.fontSize ||
                    0,
                ]}
                onValueChange={(value) =>
                  handleAttributeChange(selectedTextId, "fontSize", value[0])
                }
                min={1}
                max={100}
                step={1}
                className="w-[200px]"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Font Family",
      icon: <Type className="h-4 w-4" />,
      settings: (
        <div className="space-y-4">
          {selectedTextId !== null && (
            <FontFamilyPicker
              attribute="fontFamily"
              currentFont={
                textSets.find((set) => set.id === selectedTextId)?.fontFamily ||
                currentFont
              }
              handleAttributeChange={(attribute: string, value: string) =>
                handleAttributeChange(selectedTextId, attribute, value)
              }
            />
          )}
        </div>
      ),
    },

    {
      name: "Position",
      icon: <Move className="h-4 w-4" />,
      settings: (
        <div className="space-y-4">
          {selectedTextId !== null && (
            <Position
              onMove={(direction, pixels) =>
                handleMove(selectedTextId, direction, pixels)
              }
            />
          )}
        </div>
      ),
    },
    {
      name: "Font Weight",
      icon: <Edit className="h-4 w-4" />,
      settings: (
        <div className="space-y-4">
          {selectedTextId !== null && (
            <div className="space-y-2">
              <span>
                Font Weight:{" "}
                {textSets.find((set) => set.id === selectedTextId)?.fontWeight}
              </span>
              <Slider
                value={[
                  textSets.find((set) => set.id === selectedTextId)
                    ?.fontWeight || 400,
                ]}
                onValueChange={(value) =>
                  handleAttributeChange(selectedTextId, "fontWeight", value[0])
                }
                min={100}
                max={900}
                step={100}
                className="w-[200px]"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Remove Text",
      icon: <Trash className="h-4 w-4" />,
      settings: (
        <div className="space-y-4">
          {selectedTextId !== null && (
            <RemoveText
              removeTextSet={removeTextSet}
              textSetId={selectedTextId}
            />
          )}
        </div>
      ),
    },
    {
      name: "Rotate",
      icon: <RotateCw className="h-4 w-4" />,
      settings: (
        <div className="space-y-4">
          {selectedTextId !== null && (
            <RotateText
              rotation={
                textSets.find((set) => set.id === selectedTextId)?.rotation || 0
              }
              handleAttributeChange={handleAttributeChange}
              textSetId={selectedTextId}
            />
          )}
        </div>
      ),
    },
    // ... (other tools)
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 mb-4 mx-4 z-50  flex items-center justify-center">
      <div className="bg-background border rounded-lg shadow-sm overflow-hidden h-24 w-fit max-md:w-full">
        {selectedTool ? (
          <div className="px-4 py-2 h-full overflow-y-auto">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="p-1 mb-1"
              disabled={isScrolling}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {validationMessage && (
              <div className="text-red-500 text-sm mt-2">
                {validationMessage}
              </div>
            )}
            {tools.find((tool) => tool.name === selectedTool)?.settings}
          </div>
        ) : (
          <div
            ref={toolbarRef}
            className="flex space-x-2 py-4 overflow-x-auto h-full px-4 scroll-smooth"
            onScroll={handleScroll}
          >
            {tools.map((tool) => (
              <Button
                key={tool.name}
                variant="ghost"
                className="flex-shrink-0 flex flex-col items-center justify-center h-full w-20"
                onClick={() => handleToolClick(tool.name)}
                disabled={isScrolling}
              >
                {tool.icon}
                <span className="text-xs mt-1">{tool.name}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
