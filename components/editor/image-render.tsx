"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { loadCustomFonts } from "@/utils/loadFonts";

interface Props {
  originalImage: string;
  removedBgImage: string | null;
  textSets: Array<{
    id: string;
    text: string;
    top: number;
    left: number;
    rotation: number;
    color: string;
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
    opacity: number;
  }>;
  // canvasBaseWidth: number;
}

export default function ImageRender({
  originalImage,
  removedBgImage,
  textSets,
  // canvasBaseWidth,
}: Props) {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const constraintsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const controls = useAnimation();
  // const [fontsLoaded, setFontsLoaded] = useState(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const newScale = scale - e.deltaY * 0.01;
      setScale(Math.min(Math.max(0.5, newScale), 3));
    }
  };

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchmove", preventDefault, { passive: false });
    return () => document.removeEventListener("touchmove", preventDefault);
  }, []);

  // useEffect(() => {
  //   const loadFonts = async () => {
  //     await loadCustomFonts();
  //     setFontsLoaded(true);
  //   };
  //   loadFonts();
  // }, []);

  const handlePinch = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );

      if (!isDragging) {
        setIsDragging(true);
      } else {
        const newScale = scale + (distance - scale) * 0.01;
        setScale(Math.min(Math.max(0.5, newScale), 3));
      }
    }
  };

  const handlePan = (e: any, info: any) => {
    if (scale > 1) {
      const newX = position.x + info.delta.x;
      const newY = position.y + info.delta.y;

      // Calculate boundaries
      const imageWidth = imageRef.current?.offsetWidth || 0;
      const imageHeight = imageRef.current?.offsetHeight || 0;
      const containerWidth = constraintsRef.current?.offsetWidth || 0;
      const containerHeight = constraintsRef.current?.offsetHeight || 0;

      const maxX = Math.max(0, (imageWidth * scale - containerWidth) / 2);
      const maxY = Math.max(0, (imageHeight * scale - containerHeight) / 2);

      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  useEffect(() => {
    controls.start({ scale, x: position.x, y: position.y });
  }, [scale, position, controls]);

  // Add these constants
  // const calculatePreviewFontSize = (fontSize: number) => {
  //   const BASE_MULTIPLIER = 3;
  //   return `${fontSize * BASE_MULTIPLIER * 0.1}vw`; // 0.1 to convert percentage to vw
  // };

  // if (!fontsLoaded) {
  //   return <div>Loading fonts...</div>;
  // }

  return (
    <div
      className="w-full h-screen overflow-hidden flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
      onWheel={handleWheel}
    >
      <div
        ref={constraintsRef}
        className="w-full h-full relative overflow-hidden"
      >
        <motion.div
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          animate={controls}
          onPan={handlePan}
          onTouchMove={handlePinch}
          onTouchEnd={() => setIsDragging(false)}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              ref={imageRef}
              src={originalImage}
              alt="Original"
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              className="max-w-full max-h-full"
              style={{ pointerEvents: "none" }}
            />
            {textSets.map((textSet) => (
              <div
                key={textSet.id}
                className={`text-with-stroke ${textSet.fontFamily.toLocaleLowerCase()}`}
                style={{
                  position: "absolute",
                  top: `${50 - textSet.top}%`,
                  left: `${textSet.left + 50}%`,
                  transform: `translate(-50%, -50%) rotate(${textSet.rotation}deg)`,
                  color: textSet.color,
                  textAlign: "center",
                  fontSize: `${textSet.fontSize}vw`, // Change px to vw
                  fontWeight: textSet.fontWeight,
                  fontFamily: textSet.fontFamily,
                  opacity: textSet.opacity,
                }}
              >
                {textSet.text}
              </div>
            ))}
            {removedBgImage && (
              <Image
                src={removedBgImage}
                alt="Removed background"
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                className="max-w-full max-h-full"
                style={{ pointerEvents: "none" }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
