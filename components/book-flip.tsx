"use client"

import { memo, useState } from "react"
import { motion, useAnimation, useMotionValue } from "framer-motion"
import serenity from '@/public/serenity.jpg';

const colors = [
    "bg-gray-100",
    "bg-yellow-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-orange-100",
    "bg-teal-100",
]


const images = [
    serenity,
    serenity,
    serenity,
    serenity,
    serenity,
    serenity,
    serenity,
    serenity,
];

const Carousel = memo(() => {
    const [currentPage, setCurrentPage] = useState(0)
    const controls = useAnimation()
    const dragX = useMotionValue(0)

    const cardWidth = 300
    const cardHeight = 400
    const pageGap = 40 // Increased gap between pages
    const perspective = 2000

    return (
        <div className="relative h-screen max-md:h-[calc(100vh-40vh)] w-full overflow-hidden ">
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                    perspective: `${perspective}px`,
                    transformStyle: "preserve-3d",
                    transform: 'translate(-50%, -50%)',
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
                    onDrag={(_, info) => {
                        dragX.set(info.point.x)
                    }}
                    onDragEnd={(_, info) => {
                        const velocity = info.velocity.x
                        const shouldFlip = Math.abs(info.offset.x) > 50

                        if (shouldFlip) {
                            const newPage = info.offset.x > 0
                                ? Math.max(0, currentPage - 1)
                                : Math.min(colors.length - 1, currentPage + 1)

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
                    }}
                    animate={controls}
                >
                    {colors.map((color, i) => {
                        const isCurrentPage = i === currentPage
                        const hasPassedPage = i < currentPage
                        const zIndex = colors.length - Math.abs(currentPage - i)

                        return (
                            <motion.div
                                key={`${color}-${i}`}
                                className={`absolute ${color} rounded-2xl`}
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

                                    backgroundImage: 'url("/serenity.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',

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
                                <div className="relative h-full w-full rounded-xl ">
                                    {/* Front of page */}
                                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-700">
                                        {i + 1}
                                    </div>

                                    {/* Back of page */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center rounded-xl text-2xl font-bold text-gray-700"
                                        style={{
                                            transform: "rotateY(180deg)",
                                            backfaceVisibility: "hidden",
                                            backgroundColor: color,
                                        }}
                                    >
                                        Back {i + 1}
                                    </div>
                                </div>

                                {/* Book spine */}
                                <div
                                    className="absolute left-0 top-0 h-full w-[3px] "
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

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-500">
                Swipe to turn pages
            </div>
        </div >
    )
})

Carousel.displayName = "Carousel"

export default function FlipBook() {
    return <Carousel />
}

