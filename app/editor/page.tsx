"use client";

import React, { useRef, useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Progress } from "@/components/ui/progress";
import { BadgePlus } from 'lucide-react';
import { useFabric } from "@/hooks/use-fabric";
import { Toolbar } from "@/components/toolbar"
import ImageRender from "@/components/image-render"

import "@/app/fonts.css"

const EditorPage: React.FC = () => {
  const { user } = useUser();
  const { session } = useSessionContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    handleImageUpload,
    canvasRef,
    isLoading,
    uploadProgress,
    currentMessage,
    canvasReady,
    setBackgroundImage,
    addText,
    changeFontFamily,
    changeTextColor,
    flipImage,
    deleteSelectedObject,
    downloadCanvas,
    changeBackgroundColor,
    currentBackgroundColor,
    selectedTextProperties,
    toggleFilter,
    isImageSelected,
    toggleDrawingMode,
    incrementBrushSize,
    setBrushColor,
    drawingSettings,
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
        {/* Upload button */}
        <div className={`text-center ${!isLoading && !canvasReady ? 'block' : 'hidden'}`}>
          <Button
            onClick={handleUploadImage}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg max-sm:px-6 max-sm:py-6 text-lg mb-4"
          >
            <BadgePlus className="mr-2 h-5 w-5" />
            Create Design
          </Button>
          <h2 className="text-xl px-4 align-middle font-semibold">
            Welcome,
            <br /> get started by uploading an image!
          </h2>
        </div>

        {/* Progress */}
        <div className={`${isLoading ? 'flex' : 'hidden'} flex-col items-center justify-center`}>
          <span className="flex items-center gap-2 mb-4">
            <ReloadIcon className="animate-spin" /> {currentMessage}
          </span>
          {uploadProgress > 0 && (
            <div className="w-64">
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className={`w-full h-full ${canvasReady ? 'block' : 'hidden'}`}>
          <ImageRender
            canvasRef={canvasRef}
            canvasReady={canvasReady}
          />
          <div className="absolute top-[calc(5rem)] left-0 right-0 w-full flex items-center justify-center">
            <Toolbar
              handleImageUpload={handleImageUpload}
              setBackgroundImage={setBackgroundImage}
              addText={addText}
              changeFontFamily={changeFontFamily}
              changeTextColor={changeTextColor}
              flipImage={flipImage}
              deleteSelectedObject={deleteSelectedObject}
              downloadCanvas={downloadCanvas}
              changeBackgroundColor={changeBackgroundColor}
              currentBackgroundColor={currentBackgroundColor}
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

