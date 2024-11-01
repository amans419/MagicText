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
import { Upload, Save, BadgePlus } from "lucide-react";

const loadingMessages = [
  { threshold: 0, message: "Processing image..." },
  { threshold: 20, message: "Removing background..." },
  { threshold: 40, message: "Adjusting effects..." },
  { threshold: 60, message: "Almost there..." },
  { threshold: 80, message: "Finalizing your design..." },
];

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
  const [currentMessage, setCurrentMessage] = useState(
    loadingMessages[0].message
  );

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

        const imageUrl = URL.createObjectURL(file);
        await setupImage(imageUrl);
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
        const fontSize = vwToCanvasPixels(textSet.fontSize, ctx.canvas.width);
        ctx.font = `${textSet.fontWeight} ${fontSize}px ${textSet.fontFamily}`;
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const x = (canvas.width * (textSet.left + 50)) / 100;
        const y = (canvas.height * (50 - textSet.top)) / 100;

        ctx.translate(x, y);
        ctx.rotate((textSet.rotation * Math.PI) / 180);
        ctx.fillText(textSet.text, 0, 0);
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

  const vwToCanvasPixels = (vw: number, canvasWidth: number) => {
    const scaleFactor = 1.2;
    return (vw / 100) * canvasWidth * scaleFactor;
  };

  useEffect(() => {
    const currentMessageObj = loadingMessages
      .reverse()
      .find((msg) => uploadProgress >= msg.threshold);

    if (currentMessageObj) {
      setCurrentMessage(currentMessageObj.message);
    }
  }, [uploadProgress]);

  if (!user || !session || !session.user) {
    return <Authenticate />;
  }

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
            onChange={handleFileChange}
            accept=".jpg, .jpeg, .png"
          />

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
              <ReloadIcon className="animate-spin" /> {currentMessage}
            </span>
            {uploadProgress > 0 && (
              <div className="w-64">
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        </div>
      ) : selectedImage ? (
        <div className="relative flex-grow">
          <div className="absolute inset-0">
            <ImageRender
              originalImage={selectedImage}
              removedBgImage={removedBgImageUrl}
              textSets={textSets}
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
            className="relative px-4 py-2
          rounded-lg max-sm:px-6 max-sm:py-6 text-lg"
          >
            <BadgePlus className="mr-2 h-5 w-5" />
            Create Design
          </Button>
          <h2 className="text-xl px-4 align-middle font-semibold text-center">
            Welcome,
            <br /> get started by uploading an image!
          </h2>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {selectedImage && (
        <div className="absolute top-[calc(5rem)] left-0 right-0   w-full flex items-center justify-center">
          <div className=" gap-3 flex p-4 rounded-lg bg-background/60 backdrop-blur-sm w-fit ">
            <Button
              onClick={handleUploadImage}
              disabled={isLoading}
              className="relative px-4 py-2   rounded-lg   flex items-center"
              variant={"secondary"}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⌛</span>
                  Uploading...
                </>
              ) : selectedImage ? (
                <>
                  <BadgePlus className="mr-2 h-4 w-4" />
                  New Design
                </>
              ) : (
                <>
                  <BadgePlus className="mr-2 h-4 w-4" />
                  Create Design
                </>
              )}
            </Button>

            <Button
              onClick={saveCompositeImage}
              disabled={!isImageSetupDone || isLoading}
              className="flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;
