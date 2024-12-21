import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useFabric } from "@/hooks/use-fabric";
import { Canvas } from 'fabric';

interface FabricImageRenderProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvasReady: boolean;
    isObjectSelected: boolean;
}

export default function ImageRender({
    canvasRef,
    isObjectSelected,
    canvasReady,
}: FabricImageRenderProps) {
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [initialDistance, setInitialDistance] = useState<number | null>(null);
    const [initialScale, setInitialScale] = useState<number>(1);
    const [imageLoaded, setImageLoaded] = useState(false);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const controls = useAnimation();
    const isZooming = useRef(false);
    const zoomTimeout = useRef<NodeJS.Timeout>();
    const lastZoomTime = useRef<number>(Date.now());

    const resetZoomState = () => {
        isZooming.current = false;
        if (zoomTimeout.current) {
            clearTimeout(zoomTimeout.current);
            zoomTimeout.current = undefined;
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            lastZoomTime.current = Date.now();
            isZooming.current = true;

            const newScale = scale - e.deltaY * 0.005;
            const clampedScale = Math.min(Math.max(0.5, newScale), 3);
            setScale(clampedScale);

            resetZoomState();

            zoomTimeout.current = setTimeout(() => {
                const timeSinceLastZoom = Date.now() - lastZoomTime.current;
                if (timeSinceLastZoom >= 150) {
                    isZooming.current = false;
                }
            }, 150);
        }
    };

    const getDistance = (touches: React.TouchList): number => {
        if (touches.length < 2) return 0;
        const touch1 = touches[0];
        const touch2 = touches[1];
        return Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            lastZoomTime.current = Date.now();
            isZooming.current = true;
            const distance = getDistance(e.touches);
            setInitialDistance(distance);
            setInitialScale(scale);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && initialDistance !== null) {
            e.preventDefault();
            lastZoomTime.current = Date.now();
            const currentDistance = getDistance(e.touches);
            const scaleDiff = (currentDistance - initialDistance) * 0.005;
            const newScale = Math.min(Math.max(0.5, initialScale + scaleDiff), 3);
            setScale(newScale);
        }
    };

    const handleTouchEnd = () => {
        setInitialDistance(null);
        setInitialScale(scale);

        const timeSinceLastZoom = Date.now() - lastZoomTime.current;
        if (timeSinceLastZoom >= 150) {
            resetZoomState();
        } else {
            setTimeout(resetZoomState, 150 - timeSinceLastZoom);
        }
    };

    const handlePan = (e: any, info: any) => {
        if (scale > 1 && !isZooming.current) {
            const newX = position.x + info.delta.x;
            const newY = position.y + info.delta.y;

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

    const handleImageLoad = () => {
        setImageLoaded(true);
        // Reset position and scale when a new image is loaded
        setPosition({ x: 0, y: 0 });
        setScale(1);
    };

    useEffect(() => {
        controls.start({ scale, x: position.x, y: position.y });
    }, [scale, position, controls]);

    useEffect(() => {
        return () => {
            resetZoomState();
        };
    }, []);

    // Reset image state when originalImage changes
    useEffect(() => {
        setImageLoaded(false);
        setPosition({ x: 0, y: 0 });
        setScale(1);
    }, [canvasReady]);

    useEffect(() => {
        console.log('Selection state:', { isObjectSelected });
    }, [isObjectSelected]);

    return (
        <div
            className="w-full h-[calc(100vh-4rem)] overflow-hidden flex items-center justify-center bg-gray-100"
            style={{
                backgroundImage:
                    "radial-gradient(circle, #838383e9 1px, transparent 1px)",
                backgroundSize: "20px 20px",
            }}
            onWheel={handleWheel}
        >
            <div
                ref={constraintsRef}


                className="w-full h-full relative overflow-hidden flex items-center justify-center"
            >
                <motion.div
                    drag={!isZooming.current && !isObjectSelected}
                    dragConstraints={constraintsRef}
                    dragElastic={0.1}
                    dragMomentum={false}
                    onDragStart={() => !isObjectSelected && setIsDragging(true)}
                    onDragEnd={() => !isObjectSelected && setIsDragging(false)}
                    animate={controls}
                    onPan={handlePan}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="relative flex items-center justify-center"
                    style={{
                        width: imageLoaded ? "auto" : "100%",
                        height: imageLoaded ? "auto" : "100%",
                        touchAction: "none",
                    }}
                >
                    <div
                        className="relative"
                        style={{ maxWidth: "100%", maxHeight: "100vh" }}
                    >

                        {/* {canvasReady && ( */}
                        <div style={{

                        }}>
                            <div className={` `}>

                                <canvas
                                    ref={canvasRef}
                                    className={`border rounded-3xl overflow-hidden `}
                                />
                            </div>

                        </div>

                        {/* )} */}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
