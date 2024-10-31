"use client";

import React, { useRef, useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Authenticate from "@/components/authenticate";
import { Button } from "@/components/ui/button";
import { removeBackground } from "@imgly/background-removal";
import { ReloadIcon } from "@radix-ui/react-icons";
import ImageRender from "@/components/editor/image-render";
import Toolbar from "@/components/editor/toolbar";
import { Progress } from "@/components/ui/progress";

const EditorPage: React.FC = () => {
  const { user } = useUser();
  const { session } = useSessionContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(
    null
  );
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [textSets, setTextSets] = useState<Array<any>>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [canvasBaseWidth, setCanvasBaseWidth] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsLoading(true);
        // Clear existing images and text immediately
        setUploadProgress(0);
        setSelectedImage(null);
        setRemovedBgImageUrl(null);
        setTextSets([]);

        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        // Process new image
        const imageUrl = URL.createObjectURL(file);
        await setupImage(imageUrl);
        // Only set selected image after processing is complete
        setSelectedImage(imageUrl);

        clearInterval(progressInterval);
        setUploadProgress(100);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const setupImage = async (imageUrl: string) => {
    try {
      const imageBlob = await removeBackground(imageUrl);
      const url = URL.createObjectURL(imageBlob);
      setRemovedBgImageUrl(url);
      setIsImageSetupDone(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToolSelect = (toolName: string) => {
    setSelectedTool(toolName);
  };

  const applyTextStroke = (ctx: any, text: any, x: any, y: any) => {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  };

  // useEffect(() => {
  //   if (selectedImage) {
  //     if (!canvasRef.current || !isImageSetupDone) return;

  //     const canvas = canvasRef.current;
  //     const ctx = canvas.getContext("2d");
  //     if (!ctx) return;

  //     const bgImg = new Image();
  //     bgImg.crossOrigin = "anonymous";
  //     bgImg.onload = () => {
  //       canvas.width = bgImg.width;
  //       canvas.height = bgImg.height;
  //       setCanvasBaseWidth(bgImg.width);
  //     };
  //     console.log(canvasBaseWidth);
  //   }
  // }, [selectedImage]);

  // const calculateFontSize = (baseFontSize: number, baseWidth: number) => {
  //   const scaleFactor = 0.01; // 1% of width
  //   return Math.round(baseFontSize * baseWidth * scaleFactor);
  // };
  const vwToCanvasPixels = (vw: number, canvasWidth: number) => {
    const scaleFactor = 1.7; // Adjust this value to match preview size
    return (vw / 100) * canvasWidth * scaleFactor;
  };

  const saveCompositeImage = async () => {
    if (!canvasRef.current || !isImageSetupDone) return;

    await document.fonts.ready;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      textSets.forEach((textSet) => {
        ctx.save();
        // console.log(textSet);
        // console.log(textSet.fontWeight);
        // console.log(textSet.currentFont);
        // console.log(textSet.fontFamily);
        // console.log(textSet.fontSize);
        // console.log(`${textSet.fontSize}px`);

        const fontSize = vwToCanvasPixels(textSet.fontSize, ctx.canvas.width);
        ctx.font = `${textSet.fontWeight} ${fontSize}px ${textSet.fontFamily}`;

        if (!document.fonts.check(ctx.font)) {
          console.warn(`Font ${textSet.fontFamily} not loaded`);
        }

        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const x = (canvas.width * (textSet.left + 50)) / 100;
        const y = (canvas.height * (50 - textSet.top)) / 100;

        // applyTextStroke(ctx, textSet.text, 0, 0);

        ctx.translate(x, y);
        ctx.rotate((textSet.rotation * Math.PI) / 180);
        ctx.fillText(textSet.text, 0, 0);
        // ctx.strokeText(textSet.text, 0, 0); // Apply stroke
        ctx.restore();
      });

      if (removedBgImageUrl) {
        const removedBgImg = new Image();
        removedBgImg.crossOrigin = "anonymous";
        removedBgImg.onload = () => {
          ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
          triggerDownload();
        };
        removedBgImg.src = removedBgImageUrl;
      } else {
        triggerDownload();
      }
    };
    bgImg.src = selectedImage || "";

    function triggerDownload() {
      if (!canvasRef.current) return;
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "text-behind-image.png";
      link.href = dataUrl;
      link.click();
    }
  };

  if (!user || !session || !session.user) {
    return <Authenticate />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row items-end justify-end md:justify-between md:items-center p-5 px-6 xl:px-10   ">
        <h2 className="hidden xl:block font-semibold tracking-tight text-2xl">
          Text behind image editor
        </h2>
        <div className="flex gap-4">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".jpg, .jpeg, .png"
          />
          {selectedImage && (
            <Button
              onClick={handleUploadImage}
              disabled={isLoading}
              className="relative px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⌛</span>
                  Uploading...
                </>
              ) : selectedImage ? (
                "Upload New Image"
              ) : (
                "Upload Image"
              )}
            </Button>
          )}

          {selectedImage && (
            <Button onClick={saveCompositeImage} disabled={!isImageSetupDone}>
              Save image
            </Button>
          )}

          <Avatar>
            <AvatarImage src={user?.user_metadata.avatar_url} />
          </Avatar>
        </div>
      </div>
      <Separator />
      {isLoading ? (
        <div className="flex items-center justify-center flex-grow">
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <span className="flex items-center gap-2">
              <ReloadIcon className="animate-spin" /> Loading, please wait
            </span>
            {uploadProgress > 0 && (
              <div className="w-64">
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        </div>
      ) : selectedImage ? (
        // Image render component
        <div className="relative flex-grow">
          <div className="absolute inset-0">
            <ImageRender
              originalImage={selectedImage}
              removedBgImage={removedBgImageUrl}
              textSets={textSets}
              // canvasBaseWidth={canvasBaseWidth}
            />
          </div>
          <Toolbar
            textSets={textSets}
            setTextSets={setTextSets}
            onToolSelect={handleToolSelect}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center flex-grow flex-col gap-4">
          <Button
            onClick={handleUploadImage}
            disabled={isLoading}
            className="relative px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⌛</span>
                Uploading...
              </>
            ) : selectedImage ? (
              "Upload New Image"
            ) : (
              "Upload Image"
            )}
          </Button>{" "}
          <h2 className="text-xl px-4 align-middle font-semibold text-center">
            Welcome,
            <br /> get started by uploading an image!
          </h2>{" "}
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* {selectedTool && (
            <div className="absolute top-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-2">
                {selectedTool} Tool
              </h2>
              Render specific tool component based on selectedTool
              This is where you'd implement the logic for each tool
              <p>Tool settings and controls would go here.</p>
            </div>
          )}  */}
    </div>
  );
};

export default EditorPage;
