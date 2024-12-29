"use client"

import { memo, useState, useEffect, useCallback, useRef } from "react"
import { motion, useAnimation, useMotionValue } from "framer-motion"
import Image from "next/image";



const cardImages = [
    "/nostalgic.png",
    "/drift.jpg",
    "/peace.png",
    "/dog.png",
    "/roar.jpg",
    "/speed.jpg",
    "/serenity.jpg",
    "/grace.png",
    "/thirsty.jpg",


];


const Carousel = memo(() => {
    const [currentPage, setCurrentPage] = useState(0)
    const controls = useAnimation()
    const dragX = useMotionValue(0)
    const [isUserInteracting, setIsUserInteracting] = useState(false)
    const autoFlipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const cardWidth = 300
    const cardHeight = 400
    const pageGap = 40
    const perspective = 2000

    const flipToNextPage = useCallback(() => {
        setCurrentPage((prevPage) => (prevPage + 1) % cardImages.length)
    }, [])

    const startAutoFlip = useCallback(() => {
        if (autoFlipTimeoutRef.current) {
            clearTimeout(autoFlipTimeoutRef.current)
        }
        autoFlipTimeoutRef.current = setTimeout(flipToNextPage, 4200)
    }, [flipToNextPage])

    useEffect(() => {
        startAutoFlip()
        return () => {
            if (autoFlipTimeoutRef.current) {
                clearTimeout(autoFlipTimeoutRef.current)
            }
        }
    }, [startAutoFlip, currentPage])

    const handleDragStart = () => {
        setIsUserInteracting(true)
        if (autoFlipTimeoutRef.current) {
            clearTimeout(autoFlipTimeoutRef.current)
        }
    }

    const handleDragEnd = (_: any, info: any) => {
        setIsUserInteracting(false)
        const velocity = info.velocity.x
        const shouldFlip = Math.abs(info.offset.x) > 50

        if (shouldFlip) {
            const newPage = info.offset.x > 0
                ? (currentPage - 1 + cardImages.length) % cardImages.length
                : (currentPage + 1) % cardImages.length

            setCurrentPage(newPage)
        }

        controls.start({
            x: 0,
            transition: {
                type: "spring",
                stiffness: 40,
                damping: 30,
                mass: 1.5,
            },
        })

        startAutoFlip()
    }

    return (
        <div className="relative h-screen max-md:h-[calc(100vh-40vh)] w-full overflow-hidden">
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                    perspective: `${perspective}px`,
                    transformStyle: "preserve-3d",
                }}
            >
                <motion.div
                    className="relative"
                    style={{
                        transformStyle: "preserve-3d",
                        width: cardWidth,
                        height: cardHeight,
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.05}
                    onDragStart={handleDragStart}
                    onDrag={(_, info) => {
                        dragX.set(info.point.x)
                    }}
                    onDragEnd={handleDragEnd}
                    animate={controls}
                >
                    {cardImages.map((imgUrl, i) => {
                        const isCurrentPage = i === currentPage
                        const hasPassedPage = i < currentPage
                        const zIndex = cardImages.length - Math.abs(currentPage - i)

                        return (
                            <motion.div
                                key={i}
                                className={`absolute rounded-2xl ${imgUrl}`}
                                style={{
                                    width: cardWidth,
                                    height: cardHeight,
                                    transformStyle: "preserve-3d",
                                    transform: `
                                        translateX(${hasPassedPage ? -pageGap : 0}px)
                                        translateZ(${(i - currentPage) * pageGap}px)
                                        rotateY(${hasPassedPage ? -180 : 0}deg)
                                    `,
                                    transformOrigin: "left center",
                                    zIndex,
                                    backfaceVisibility: "hidden",
                                }}
                                animate={{
                                    rotateY: hasPassedPage ? -180 : 0,
                                    x: hasPassedPage ? -pageGap : 0,
                                    transition: {
                                        duration: 0.6,
                                        ease: [0.4, 0, 0.2, 1],
                                    },
                                }}
                            >
                                <div className="relative h-full w-full rounded-xl flex items-center justify-center pointer-events-none select-none"

                                    style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                                >
                                    <Image
                                        className="rounded-xl pointer-events-none select-none"
                                        src={imgUrl}
                                        alt={`Card ${i + 1}`}
                                        layout="fill"
                                        objectFit="cover"
                                        priority={i === currentPage}

                                    />
                                </div>

                                {/* Book spine */}
                                <div
                                    className="absolute left-0 top-0 h-full w-[3px]"
                                    style={{
                                        transform: "translateX(-1.5px) rotateY(-90deg)",
                                        transformOrigin: "left center",
                                    }}
                                />
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>

            <div className="absolute bottom-16 max-md:bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-500">
                Swipe to turn pages
            </div>
        </div>
    )
})

Carousel.displayName = "Carousel"

export default function AutoFlipCarousel() {
    return <Carousel />
}

