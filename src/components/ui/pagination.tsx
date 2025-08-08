'use client'
import type { Dispatch, SetStateAction } from "react";
import { TbArrowLeft, TbArrowRight } from "react-icons/tb";
import { motion, LayoutGroup } from "motion/react";
import Button from "../form/button";

export interface PaginationProps {
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    totalRecords: number;
    totalPages: number;
}

export default function Pagination({
    currentPage,
    setCurrentPage,
    totalRecords,
    totalPages,
}: PaginationProps) {
    return (
        <div className="fixed bottom-0 -translate-y-full left-1/2 -translate-x-1/2 z-50">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-100"
            >
                {/* Prev Button */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                        text=""
                        className="cursor-pointer p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50 disabled:hover:bg-gray-100"
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 0}
                        icon={<TbArrowLeft className="text-gray-700" />}
                    />
                </motion.div>

                {/* Page Numbers */}
                <LayoutGroup>
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, idx) => {
                            const isActive = currentPage === idx;
                            return (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.92 }}
                                    className="relative"
                                >
                                    {/* {isActive && (
                                        <motion.div
                                            layoutId="activePage"
                                            className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
                                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                        />
                                    )} */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activePage"
                                            className="absolute inset-0 rounded-lg bg-primary/10"
                                            transition={{ type: "spring", stiffness: 320, damping: 25 }}
                                        />
                                    )}

                                    <Button
                                        className={` cursor-pointer relative text-sm p-2 px-4 rounded-full font-medium transition-colors duration-200 ${isActive
                                            ? 'text-primary'
                                            : 'text-gray-500 hover:text-primary'
                                            }`}
                                        onClick={() => setCurrentPage(idx)}
                                        text={String(idx + 1)}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                </LayoutGroup>

                {/* Next Button */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                        text=""
                        className=" cursor-pointer p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50 disabled:hover:bg-gray-100"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === totalPages - 1}
                        icon={<TbArrowRight className="text-gray-700" />}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}
