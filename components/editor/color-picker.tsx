"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

// Helper functions for color conversion


interface GradientStop {
  offset: number;
  color: string;
}

interface GradientColor {
  type: 'gradient';
  stops: GradientStop[];
  direction: 'horizontal' | 'vertical';
}

type Color = string | GradientColor;

interface ColorPickerProps {
  color: Color;
  onChange: (color: Color) => void;
}

const hexToHsl = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const normalizeColor = (color: string): string => {
  if (color.startsWith("#")) {
    return color.toUpperCase();
  } else if (color.startsWith("hsl")) {
    const [h, s, l] = color.match(/\d+(\.\d+)?/g)?.map(Number) || [0, 0, 0];
    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
  }
  return color;
};

const trimColorString = (color: string, maxLength: number = 20): string => {
  if (color.length <= maxLength) return color;
  return `${color.slice(0, maxLength - 3)}...`;
};

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [hsl, setHsl] = useState<[number, number, number]>([0, 0, 0]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const [colorInput, setColorInput] = useState(typeof color === 'string' ? color : '');
  const [gradientStops, setGradientStops] = useState<GradientStop[]>(() => {
    if (typeof color === 'object' && color.type === 'gradient') {
      return color.stops.slice(0, 2);
    } else if (typeof color === 'string') {
      return [
        { offset: 0, color: color },
        { offset: 1, color: color }
      ];
    } else {
      return [
        { offset: 0, color: '#FF0000' },
        { offset: 1, color: '#0000FF' }
      ];
    }
  });
  const [activeTab, setActiveTab] = useState<'solid' | 'gradient'>(
    typeof color === 'string' || color === undefined ? 'solid' : 'gradient'
  );
  const [gradientDirection, setGradientDirection] = useState<'horizontal' | 'vertical'>(
    typeof color === 'object' && color.type === 'gradient' ? color.direction : 'horizontal'
  );


  useEffect(() => {
    if (typeof color === 'string') {
      setColorInput(color);
      setGradientStops([
        { offset: 0, color: color },
        { offset: 1, color: color }
      ]);
    } else if (color && typeof color === 'object' && color.type === 'gradient') {
      setGradientStops(color.stops.slice(0, 2));
      setGradientDirection(color.direction);

    }
  }, [color]);


  const handleHueChange = (hue: number) => {
    const newHsl: [number, number, number] = [hue, hsl[1], hsl[2]];
    setHsl(newHsl);
    handleColorChange(`hsl(${newHsl[0]}, ${newHsl[1]}%, ${newHsl[2]}%)`);
  };

  const handleSaturationLightnessChange = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const s = Math.round((x / rect.width) * 100);
    const l = Math.round(100 - (y / rect.height) * 100);
    const newHsl: [number, number, number] = [hsl[0], s, l];
    setHsl(newHsl);
    handleColorChange(`hsl(${newHsl[0]}, ${newHsl[1]}%, ${newHsl[2]}%)`);
  };

  const handleColorInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newColor = event.target.value;
    setColorInput(newColor);
    if (
      /^#[0-9A-Fa-f]{6}$/.test(newColor) ||
      /^hsl$$\d+,\s*\d+%,\s*\d+%$$$/.test(newColor)
    ) {
      handleColorChange(newColor);
    }
  };
  const handleColorChange = (newColor: string) => {
    setColorInput(newColor);
    onChange(newColor);
  };

  const handleGradientChange = (newStops: GradientStop[], direction: 'horizontal' | 'vertical') => {
    setGradientStops(newStops);
    setGradientDirection(direction);
    onChange({ type: 'gradient', stops: newStops, direction });
  };

  const handleGradientStopChange = (index: number, key: 'offset' | 'color', value: number | string) => {
    const newStops = gradientStops.map((stop, i) => {
      if (i === index) {
        if (key === 'offset') {
          const numValue = parseFloat(value as string);
          if (isNaN(numValue) || numValue < 0 || numValue > 1) {
            toast({
              variant: "destructive",
              title: "Offset must be between 0 and 1",
            });
            return stop;
          }
          return { ...stop, [key]: numValue };
        }
        return { ...stop, color: String(value), offset: stop.offset };
      }
      return stop;
    });
    handleGradientChange(newStops, gradientDirection);
  };

  const handleDirectionChange = (direction: 'horizontal' | 'vertical') => {
    setGradientDirection(direction);
    handleGradientChange(gradientStops, direction);
  };

  const colorPresets = [
    "#FF3B30",
    "#FF9500",
    "#FFCC00",
    "#4CD964",
    "#5AC8FA",
    "#007AFF",
    "#5856D6",
    "#FF2D55",
    "#8E8E93",
    "#EFEFF4",
    "#E5E5EA",
    "#D1D1D6",
  ];

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'solid' | 'gradient')}>
      <TabsList>
        <TabsTrigger value="solid">Solid</TabsTrigger>
        <TabsTrigger value="gradient">Gradient</TabsTrigger>
      </TabsList>
      <TabsContent value="solid">
        <div>
          <div className="bg-white rounded-md shadow-md p-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <motion.div
                className="w-full h-40 rounded-lg cursor-crosshair relative overflow-hidden"
                style={{
                  background: `
                linear-gradient(to top, rgba(0, 0, 0, 1), transparent),
                linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 0, 0, 0)),
                hsl(${hsl[0]}, 100%, 50%)
              `,
                }}
                onClick={handleSaturationLightnessChange}
              >
                <motion.div
                  className="w-4 h-4 rounded-full border-2 border-white absolute shadow-md"
                  style={{
                    left: `${hsl[1]}%`,
                    top: `${100 - hsl[2]}%`,
                    backgroundColor: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`,
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              </motion.div>
              <motion.input
                type="range"
                min="0"
                max="360"
                value={hsl[0]}
                onChange={(e) => handleHueChange(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), 
                hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%)
              )`,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
              <div className="flex items-center space-x-2">
                <Label htmlFor="color-input" className="sr-only">
                  Color
                </Label>
                <Input
                  id="color-input"
                  type="text"
                  value={colorInput}
                  onChange={handleColorInputChange}
                  className="flex-grow bg-white border border-gray-300 rounded-md text-sm h-8 px-2"
                  placeholder="#RRGGBB or hsl(h, s%, l%)"
                />
                <motion.div
                  className="w-8 h-8 rounded-md shadow-sm"
                  style={{ backgroundColor: colorInput }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              </div>
              <div className="grid grid-cols-6 gap-2">
                <AnimatePresence>
                  {colorPresets.map((preset) => (
                    <motion.button
                      key={preset}
                      className="w-8 h-8 rounded-full relative"
                      style={{ backgroundColor: preset }}
                      onClick={() => handleColorChange(preset)}
                      whileHover={{ scale: 1.2, zIndex: 1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {colorInput === preset && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

      </TabsContent>

      <TabsContent value="gradient">
        <div className="space-y-4">
          {gradientStops.map((stop, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={stop.offset}
                onChange={(e) => handleGradientStopChange(index, 'offset', e.target.value)}
              />
              <Input
                type="color"
                value={stop.color}
                onChange={(e) => handleGradientStopChange(index, 'color', e.target.value)}
              />
            </div>
          ))}
          <RadioGroup
            value={gradientDirection}
            onValueChange={(value: any) => handleDirectionChange(value as 'horizontal' | 'vertical')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="horizontal" id="horizontal" />
              <Label htmlFor="horizontal">Horizontal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vertical" id="vertical" />
              <Label htmlFor="vertical">Vertical</Label>
            </div>
          </RadioGroup>
        </div>
      </TabsContent>


    </Tabs>
  );
}
