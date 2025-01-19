'use client'
import type { Dispatch, SetStateAction } from "react";
import { TbArrowLeft, TbArrowRight } from "react-icons/tb";

export interface PaginationProps {
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>
    totalRecords: number;
    totalPages: number;
}

export default function Pagination({ currentPage, setCurrentPage, totalRecords, totalPages }: PaginationProps) {
    return (
        <div className="flex items-center justify-between gap-4 w-full">
            <button className="disabled:text-gray-300" onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 0}><TbArrowLeft /></button>
            <div className="space-x-4">
                {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                        key={idx}
                        className={`text-xs px-3 rounded ${currentPage === idx ? 'text-gray-100 bg-gray-800 border border-gray-800' : 'text-gray-400 bg-gray-50 border'}`}
                        onClick={() => setCurrentPage(idx)}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
            <button className="disabled:text-gray-300" onClick={() => setCurrentPage(prev => prev + 1)} disabled={!totalRecords || currentPage === totalPages - 1}><TbArrowRight /></button>
        </div>
    )
}
