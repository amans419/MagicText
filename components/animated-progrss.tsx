'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Progress } from './ui/progress'
import { ReloadIcon } from '@radix-ui/react-icons'

const messages = [
    "Initializing",
    "Loading data",
    "Processing",
    "Almost there",
    "Finishing up"
]

interface Props {

    uploadProgress: number;

    currentMessage: string;

}


const Message = ({ message }: { message: string }) => (
    <AnimatePresence mode="wait">
        <motion.div
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium text-gray-600 min-h-[20px]"
        >
            {message}
        </motion.div>
    </AnimatePresence>
)



export default function AnimatedProgress({ uploadProgress, currentMessage }: Props) {
    const [progress, setProgress] = useState(0)
    const [messageIndex, setMessageIndex] = useState(0)

    useEffect(() => {
        setMessageIndex(Math.min(Math.floor(progress / 20), messages.length - 1))
    }, [progress])

    return (
        <div className="max-w-sm mx-auto mt-10 p-4 bg-white rounded-lg border border-gray-100 ">
            <div className="flex items-center  flex-col justify-between mb-2  ">

                <span className="flex flex-col items-center gap-3 mb-4">
                    {/* <ReloadIcon className="animate-spin" /> */}
                    <span className="animate-spin text-xl mr-2 shadow-sm">⌛</span>
                    <Message message={currentMessage} />
                </span>
                <motion.div className="w-64 min-h-[10px]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}

                >
                    <Progress value={uploadProgress} className="h-2" />
                </motion.div>

            </div>
        </div >
    )
}

