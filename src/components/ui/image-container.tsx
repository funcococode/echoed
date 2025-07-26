'use client'

import Image from "next/image";
import { Modal } from "./modal";
import { useState } from "react";

interface ImageContainerProps {
    // Define any props you need here
    src: string;
    size?: 'small' | 'medium' | 'large' | 'thumbnail';
    allowFullSizeViewing?: boolean;
}
const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-64 h-64',
    large: 'w-80 h-80',
    thumbnail: 'w-12 h-12 ring ring-offset-2 border-none ring-gray-200 shadow-lg',
};
export default function ImageContainer({ src, size = 'medium', allowFullSizeViewing = true }: ImageContainerProps) {
    const [showFullSize, setShowFullSize] = useState(false);

    return (
        <div key={src} className={`border rounded p-2 border-gray-300 hover:bg-gray-100 ${sizeClasses[size]} relative cursor-pointer hover:scale-95 transition`} onClick={() => setShowFullSize(true)}>
            <Image fill={true} alt="Image" src={src} className="object-contain" />
            {showFullSize && allowFullSizeViewing && <Modal title="Full Size Image" open={showFullSize} onClose={() => setShowFullSize(false)}>
                <div className="w-[700px] h-[500px] relative">
                    <Image fill={true} quality={100} src={src} alt="Full Size" className="object-contain" />
                </div>
            </Modal>}
        </div>
    )
}
