"use client";

import React, { useRef, useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Progress } from "@/components/ui/progress";
import { BadgePlus, Files, FileText, Images, Link } from 'lucide-react';
import { useFabric } from "@/hooks/use-fabric";
import { Toolbar } from "@/components/toolbar"
import ImageRender from "@/components/image-render"

import "@/app/fonts.css"
import AnimatedProgress from "@/components/animated-progrss";
import { EmptyState } from "@/components/empty-state";

const EditorPage: React.FC = () => {
  const { user } = useUser();
  const { session } = useSessionContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isObjectSelected,
    handleImageUpload,
    canvasRef,
    isLoading,
    uploadProgress,
    currentMessage,
    canvasReady,
    addText,
    changeFontFamily,
    changeTextColor,
    flipImage,
    deleteSelectedObject,
    downloadCanvas,
    selectedTextProperties,
    toggleFilter,
    isImageSelected,
    toggleDrawingMode,
    incrementBrushSize,
    setBrushColor,
    drawingSettings,
    addStroke,
    updateStrokeColor,
    updateStrokeWidth,
    strokeSettings,
    showStrokeUI,
    setShowDuplicateStroke,
    removeStroke,
    showDuplicateStroke
  } = useFabric();

  const handleUploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-row items-center justify-between p-5 px-6 xl:px-10 h-16 bg-background border-b max-sm:px-4">
        <h2 className="font-semibold tracking-tight text-2xl max-sm:text-xl">
          Magic Text ✨
        </h2>
        <div className="flex gap-4 items-center">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={onFileChange}
            accept=".jpg, .jpeg, .png"
          />
          <Avatar>
            <AvatarImage src={user?.user_metadata.avatar_url} />
          </Avatar>
        </div>
      </div>
      <Separator />

      <div className="flex-grow flex items-center justify-center">
        <div className={`text-center m-6  ${!isLoading && !canvasReady ? 'block' : 'hidden'}`}>

          <EmptyState
            title="Welcome"
            description="Get started by uploading an image!"
            onFileChange={onFileChange}
            icons={[FileText, Images, Files]}
            action={{
              label: "Upload Image",
              onClick: () => { handleUploadImage }
            }}
          />
        </div>
        {/* Upload button */}


        {/* Progress */}
        <div className={`${isLoading ? 'flex' : 'hidden'} flex-col items-center justify-center`}>

          <AnimatedProgress uploadProgress={uploadProgress} currentMessage={currentMessage} />
        </div>

        {/* Canvas */}
        <div className={`w-full h-full ${canvasReady ? 'block' : 'hidden'}`}>
          <ImageRender
            canvasRef={canvasRef}
            canvasReady={canvasReady}
            isObjectSelected={isObjectSelected}
          />
          <div className="absolute bottom-[calc(5rem)] left-0 right-0 w-full flex items-center justify-center">
            <Toolbar
              showDuplicateStroke={showDuplicateStroke}
              removeStroke={removeStroke}
              setShowDuplicateStroke={setShowDuplicateStroke}
              showStrokeUI={showStrokeUI}
              strokeSettings={strokeSettings}
              updateStrokeColor={updateStrokeColor}
              updateStrokeWidth={updateStrokeWidth}
              addStroke={addStroke}
              handleImageUpload={handleImageUpload}
              addText={addText}
              changeFontFamily={changeFontFamily}
              changeTextColor={changeTextColor}
              flipImage={flipImage}
              deleteSelectedObject={deleteSelectedObject}
              downloadCanvas={downloadCanvas}
              selectedTextProperties={selectedTextProperties}
              toggleFilter={toggleFilter}
              isImageSelected={isImageSelected}
              toggleDrawingMode={toggleDrawingMode}
              drawingSettings={drawingSettings}
              incrementBrushSize={incrementBrushSize}
              setBrushColor={setBrushColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;

