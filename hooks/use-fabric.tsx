import React, { useEffect, useRef, useState } from "react"
import { Canvas, FabricImage, PencilBrush } from "fabric"
import * as fabric from "fabric"
import { useWindow } from "@/hooks/use-window"
import { filterNames, getFilter } from "@/lib/constants"
import { removeBackground } from "@imgly/background-removal";

const CANVAS_DIMENSIONS = { default: 500, mobileMultiplier: 0.9 }
const DEFAULT_BACKGROUND_COLOR = "#005DFF"
const DEFAULT_FONT_COLOR = "#ffffff"
const DEFAULT_FONT_FAMILY = "Impact"
const DEFAULT_TEXT_OPTIONS = {
  text: "Your Text Here",
  fontSize: 40,
  fontFamily: DEFAULT_FONT_FAMILY,
  fill: DEFAULT_FONT_COLOR,
  // stroke: "black",
  // strokeWidth: 1.5,
  textAlign: "center",
}
const loadingMessages = [
  { threshold: 0, message: "Processing image..." },
  { threshold: 20, message: "Removing background..." },
  { threshold: 40, message: "Adjusting effects..." },
  { threshold: 60, message: "Almost there..." },
  { threshold: 80, message: "Finalizing your design..." },
];


export interface selectedTextPropertiesProps {
  fontFamily: string
  fontColor: string
  isTextSelected: boolean
}

export interface DrawingPropertiesProps {
  isDrawing: boolean
  brushSize: number
  brushColor: string
}

export function useFabric() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<Canvas | null>(null)
  const [currentBackgroundColor, setCurrentBackgroundColor] =
    React.useState<string>(DEFAULT_BACKGROUND_COLOR)
  const [selectedTextProperties, setSelectedTextProperties] =
    React.useState<selectedTextPropertiesProps>({
      fontFamily: DEFAULT_FONT_FAMILY,
      fontColor: DEFAULT_FONT_COLOR,
      isTextSelected: false,
    })
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0].message);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [removedBgLayer, setRemovedBgLayer] = React.useState<FabricImage | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [isObjectSelected, setIsObjectSelected] = useState(false);

  const [isImageSelected, setIsImageSelected] = useState<boolean>(false)
  const [currentFilterIndex, setCurrentFilterIndex] = useState<number>(0)
  const { isMobile, windowSize } = useWindow()


  const [drawingSettings, setDrawingSettings] =
    useState<DrawingPropertiesProps>({
      isDrawing: false,
      brushSize: 4,
      brushColor: "#ffffff",
    })

  useEffect(() => {
    if (!canvasRef.current) return

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      preserveObjectStacking: true,
      selection: true, // Enable selection
      interactive: true // Enable interaction


    })


    setCanvas(fabricCanvas)
    fabricCanvas.backgroundColor = currentBackgroundColor

    // Add a listener for when an object is added to the canvas
    fabricCanvas.on("object:added", (e) => {
      const object = e.target
      if (object) {
        object.set({
          cornerColor: "#FFF",
          cornerStyle: "rect",
          borderColor: "#3D78FF",
          cornerSize: 10,
          transparentCorners: false,
          borderOpacityWhenMoving: 0,
          cornerStrokeColor: "#3D78FF",
        })
        fabricCanvas.on('selection:created', () => {
          fabricCanvas.requestRenderAll()
        })

        fabricCanvas.on('object:modified', () => {
          fabricCanvas.requestRenderAll()
        })


        // TODO: MAKE IT MORE LIKE CANVA SELECTOR

        // Define custom controls
        object.controls = {
          ...object.controls,
          mtr: new fabric.Control({
            x: 0,
            y: -0.58,
            offsetY: -30,
            cursorStyle: "grab",
            actionName: "rotate",
            actionHandler: fabric.controlsUtils.rotationWithSnapping,
          }),
        }

        fabricCanvas.renderAll()
      }
    })

    // Add listeners for object selection and deselection
    const updateSelectedProperties = () => {
      const activeObject = fabricCanvas.getActiveObject()


      if (activeObject && activeObject.type === "textbox") {
        setSelectedTextProperties({
          fontFamily: activeObject.get("fontFamily") as string,
          fontColor: activeObject.get("fill") as string,
          isTextSelected: true,
        })
      } else {
        setSelectedTextProperties({
          fontFamily: DEFAULT_FONT_FAMILY,
          fontColor: DEFAULT_FONT_COLOR,
          isTextSelected: false,
        })
      }

      if (activeObject) {
        // console.log('Object selected');
        setIsObjectSelected(true);
        // console.log(isObjectSelected);
      }
      // Update image selection state
      if (activeObject && activeObject.type === "image") {
        setIsImageSelected(true)
      } else {
        setIsImageSelected(false)
      }
    }



    // Load the brush for drawing
    fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas)
    fabricCanvas.freeDrawingBrush.color = drawingSettings.brushColor
    fabricCanvas.freeDrawingBrush.width = drawingSettings.brushSize

    // Listen to multiple events that might change selection
    fabricCanvas.on("selection:created", updateSelectedProperties)
    fabricCanvas.on("selection:updated", updateSelectedProperties)
    fabricCanvas.on("selection:cleared", () => {
      updateSelectedProperties();
      setIsObjectSelected(false);
    });
    // Add a listener for object modifications
    fabricCanvas.on("object:modified", updateSelectedProperties)


    return () => {
      // Remove event listeners
      fabricCanvas.off("selection:created", updateSelectedProperties)
      fabricCanvas.off("selection:updated", updateSelectedProperties)
      fabricCanvas.off("selection:cleared", updateSelectedProperties)
      fabricCanvas.off("object:modified", updateSelectedProperties)
      fabricCanvas.dispose()
    }
  }, [])


  useEffect(() => {
    if (!canvas) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" && canvas.getActiveObject()) {
        deleteSelectedObject()
      }
    }

    // Add event listener to the window
    window.addEventListener("keydown", handleKeyDown)

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [canvas, deleteSelectedObject])

  useEffect(() => {
    if (!canvas) return
    canvas.isDrawingMode = drawingSettings.isDrawing
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingSettings.brushColor
      canvas.freeDrawingBrush.width = drawingSettings.brushSize
    }
    canvas.renderAll()
  }, [drawingSettings, canvas])




  function addText() {
    if (!canvas) return

    const text = new fabric.Textbox(DEFAULT_TEXT_OPTIONS.text, {
      ...DEFAULT_TEXT_OPTIONS,
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      width: canvas.getWidth() * 0.8,
      originX: "center",
      originY: "center",
      selectable: true,
      evented: true,
      lockMovementX: false,
      lockMovementY: false,
      hasControls: true,
      hasBorders: true,

    })

    // Add text first
    canvas.add(text)

    // If we have a removed background layer, ensure proper ordering

    canvas.setActiveObject(text)
    canvas.sendObjectToBack(text)

    canvas.renderAll()
  }


  function changeFontFamily(fontFamily: string) {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === "textbox") {
      const text = activeObject as fabric.Textbox
      text.set("fontFamily", fontFamily)

      // Immediately update the selected text properties
      setSelectedTextProperties((prev) => ({
        ...prev,
        fontFamily: fontFamily,
      }))

      canvas.renderAll()
    }
  }

  function changeTextColor(color: string) {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === "textbox") {
      const text = activeObject as fabric.Textbox
      text.set("fill", color)

      // Immediately update the selected text properties
      setSelectedTextProperties((prev) => ({
        ...prev,
        fontColor: color,
      }))

      canvas.renderAll()
    }
  }


  // Add inside useFabric() function
  async function handleImageUpload(file: File): Promise<void> {
    try {
      setIsLoading(true)
      setUploadProgress(0)

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const imageUrl = URL.createObjectURL(file)
      await setupImage(imageUrl)

      clearInterval(progressInterval)
      setUploadProgress(100)
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsLoading(false)
    }
  }

  //  layers
  const setupImage = async (imageUrl: string) => {

    console.log('Setup Image Start - canvasReady:', canvasReady);

    setCanvasReady(false);
    setIsLoading(true);


    try {

      if (!canvas && canvasRef.current) {
        const fabricCanvas = new Canvas(canvasRef.current);
        setCanvas(fabricCanvas);
      }


      // Load original image
      const img = await FabricImage.fromURL(imageUrl)
      console.log('Image loaded');

      const originalWidth = img.width!;
      const originalHeight = img.height!;


      const maxWidth = window.innerWidth * 0.9;  // 90% of viewport width
      const maxHeight = window.innerHeight * 0.8; // 80% of viewport height

      // Set canvas dimensions based on original image


      // Scale and set original as background
      const scale = Math.min(
        maxWidth / originalWidth,
        maxHeight / originalHeight,
        1 // Don't scale up images smaller than viewport
      );

      const finalWidth = originalWidth * scale;
      const finalHeight = originalHeight * scale;

      canvas?.setDimensions({
        width: finalWidth,
        height: finalHeight
      });

      img.scale(scale)
      if (canvas) {
        canvas.backgroundImage = img
        canvas.renderAll()
      }

      // Remove background and add as layer
      const imageBlob = await removeBackground(imageUrl)
      const removedBgUrl = URL.createObjectURL(imageBlob)
      const removedBgImage = await FabricImage.fromURL(removedBgUrl)

      // Use same scale as original
      removedBgImage.set({
        scaleX: scale,
        scaleY: scale,
        left: canvas?.width! / 2,
        top: canvas?.height! / 2,
        originX: 'center',
        originY: 'center',
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        perPixelTargetFind: true

      })


      canvas?.add(removedBgImage)
      setRemovedBgLayer(removedBgImage)

      canvas?.renderAll()
      setCanvasReady(true);
      console.log(canvasReady);

    } catch (error) {
      console.error("Error setting up image:", error)
      setCanvasReady(false);

    }
    finally {
      setIsLoading(false);
    }
  }

  // useEffect(() => {
  //   console.log('Canvas state:', {
  //     canvasExists: !!canvas,
  //     canvasReady,
  //     isLoading
  //   });
  // }, [canvas, canvasReady, isLoading]);


  // Update message based on progress
  useEffect(() => {
    const currentMessageObj = loadingMessages
      .reverse()
      .find((msg) => uploadProgress >= msg.threshold);

    if (currentMessageObj) {
      setCurrentMessage(currentMessageObj.message);
    }
  }, [uploadProgress]);



  // async function addImage(file: File): Promise<void> {
  //   if (!canvas) return;

  //   try {
  //     setIsLoading(true);

  //     const imageUrl = URL.createObjectURL(file);

  //     return new Promise((resolve, reject) => {
  //       fabric.Image.fromURL(
  //         imageUrl,
  //         function (img) {
  //           // Set initial position
  //           img.set({
  //             left: canvas.width! / 2,
  //             top: canvas.height! / 2,
  //             originX: 'center',
  //             originY: 'center',
  //           });

  //           // Scale image to reasonable size
  //           if (img.width! > canvas.width! / 3) {
  //             const scale = (canvas.width! / 3) / img.width!;
  //             img.scale(scale);
  //           }

  //           canvas.add(img);
  //           canvas.setActiveObject(img);
  //           canvas.sendToBack(img);
  //           canvas.renderAll();
  //           resolve();
  //         },
  //         {
  //           crossOrigin: 'anonymous'
  //         }
  //       );
  //     });

  //   } catch (error) {
  //     console.error("Error adding image:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }


  function flipImage(direction: "horizontal" | "vertical") {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()

    if (activeObject && activeObject.type === "image") {
      const image = activeObject as fabric.Image
      direction === "horizontal"
        ? image.set("flipX", !image.flipX)
        : image.set("flipY", !image.flipY)

      canvas.renderAll()
    }
  }

  function toggleFilter() {
    // Move to the next filter in the list
    const nextIndex = (currentFilterIndex + 1) % filterNames.length
    setCurrentFilterIndex(nextIndex)

    // Determine the next filter
    const nextFilter = filterNames[nextIndex]

    if (!canvas) return

    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === "image") {
      const image = activeObject as FabricImage
      const filter = getFilter(nextFilter)

      image.filters = filter ? [filter] : []
      image.applyFilters()
        ; (image as any).filterName = nextFilter
      canvas.renderAll()
    }
  }

  function toggleDrawingMode() {
    setDrawingSettings((prev) => ({
      ...prev,
      isDrawing: !prev.isDrawing,
    }))
  }

  function incrementBrushSize() {
    setDrawingSettings((prev) => {
      let newSize = prev.brushSize + 2
      if (newSize > 20) {
        newSize = 2
      }
      return { ...prev, brushSize: newSize }
    })
  }

  function setBrushColor(color: string) {
    setDrawingSettings((prev) => ({
      ...prev,
      brushColor: color,
    }))
  }

  function deleteSelectedObject() {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()

    if (activeObject) {
      canvas.remove(activeObject)
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }

  function downloadCanvas() {
    if (!canvas) return

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 3,
    })

    const link = document.createElement("a")
    link.href = dataURL
    link.download = "magictext.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function changeBackgroundColor(color: string) {
    if (canvas) {
      setCurrentBackgroundColor(color)
      canvas.backgroundColor = color
      canvas.renderAll()
    }
  }

  return {
    uploadProgress,
    currentMessage,
    isLoading,
    canvasRef,
    addText,
    changeFontFamily,
    changeTextColor,
    canvasReady,
    flipImage,
    // changeBackgroundColor,
    currentBackgroundColor,
    deleteSelectedObject,
    downloadCanvas,
    selectedTextProperties,
    toggleFilter,
    isImageSelected,
    toggleDrawingMode,
    incrementBrushSize,
    setBrushColor,
    drawingSettings,
    handleImageUpload,
    isObjectSelected
  }
}
