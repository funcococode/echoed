'use client'
import type { Dispatch, SetStateAction } from "react";
import { TbArrowLeft, TbArrowRight } from "react-icons/tb";
import Button from "../form/button";

export interface PaginationProps {
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>
    totalRecords: number;
    totalPages: number;
}

export default function Pagination({ currentPage, setCurrentPage, totalRecords, totalPages }: PaginationProps) {
    return (
        <div className="flex justify-end w-full">
            <div className="flex items-center justify-center gap-4 w-fit border p-2 rounded border-secondary/60 bg-gray-50/10 ">
                <Button text="" className="p-1.5 rounded bg-gray-100 disabled:text-gray-400" onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 0} icon={<TbArrowLeft />} />
                <div className="space-x-4">
                    {Array.from({ length: totalPages }, (_, idx) => (
                        <Button
                            key={idx}
                            // variant="outline-secondary"
                            className={`text-xs p-1.5 px-3 rounded ${currentPage === idx ? 'bg-primaryLight text-primary' : 'text-gray-400 bg-gray-50 '}`}
                            onClick={() => setCurrentPage(idx)}
                            text={String(idx + 1)}
                        />
                    ))}
                </div>
                <Button text="" className="p-1.5 rounded bg-gray-100 disabled:text-gray-900" onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === 0} icon={<TbArrowRight />} />
            </div >
        </div>
    )
}
