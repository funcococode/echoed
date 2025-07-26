"use client";

import { useState } from "react";
import { pinata } from "@/utils/config";
import { TbLoader, TbPhoto, TbUpload } from "react-icons/tb";
import Button from "../form/button";
import { toast } from "sonner";
import { addAttachmentToEcho } from "@/actions/post";
import Image from "next/image";
import { Modal } from "./modal";

export default function FileUploadForm({ postId }: { postId: string }) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [showFilesModal, setShowFilesModal] = useState(false);

    const uploadFiles = async () => {
        if (!postId) {
            toast.error('Invalid Post ID', { richColors: true });
            return;
        }
        if (!files.length) {
            toast.error('No files selected', { richColors: true });
            return;
        }

        try {
            setUploading(true);
            for (const file of files) {
                const urlRequest = await fetch("/api/files");
                const urlResponse = await urlRequest.json();
                const upload = await pinata.upload.public
                    .file(file)
                    .url(urlResponse.url);
                const saveToDb = await addAttachmentToEcho({
                    cid: upload.cid,
                    fileId: upload.id,
                    postId,
                    type: upload.mime_type
                });
                if (saveToDb.data?.id) {
                    toast.success(`Attachment "${file.name}" Added`, { richColors: true });
                }
            }
            setFiles([]);
        } catch (e) {
            toast.error("Trouble uploading files", { richColors: true });
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    return (
        <main className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-2">
                {files.length > 0 && <Button text={`${files.length} files selected`} variant="secondary" onClick={() => setShowFilesModal(true)} />}

                <div>
                    <label
                        htmlFor="attachment"
                        className="flex items-center gap-2 rounded w-fit px-4 py-2 text-xs font-medium bg-gray-700 text-white border hover:bg-gray-900 cursor-pointer"
                    >
                        <TbPhoto className="text-base" />
                        Add Attachments
                    </label>
                    <input
                        type="file"
                        onChange={handleChange}
                        name="attachment"
                        id="attachment"
                        className="hidden"
                        multiple
                    />
                </div>
                {files.length > 0 && (
                    <Button
                        text={uploading ? "Uploading" : "Upload"}
                        disabled={uploading}
                        onClick={uploadFiles}
                        variant="outline-primary"
                        icon={uploading ? <TbLoader className="animate-spin" /> : <TbUpload />}
                    />
                )}
            </div>
            {showFilesModal && <Modal open={true} onClose={() => setShowFilesModal(false)} title="Selected Files" description="Here are the files you have selected for upload" >
                <div className="py-2 px-5 space-y-8">
                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center text-sm gap-8">
                                <div className="h-10 w-10 relative">
                                    <Image fill={true} src={URL.createObjectURL(file)} alt={file.name} className="w-10 h-10 object-scale-down rounded" />
                                </div>
                                <div>
                                    <p className="font-semibold">{file.name}</p>
                                    <span className="text-gray-400 font-medium text-xs">{(file.size / 1024).toFixed(2)} KB</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Button text="Close" onClick={() => setShowFilesModal(false)} className="w-full text-sm font-medium bg-red-800/10 py-2 rounded-md text-red-500" />
                </div>
            </Modal>}
        </main>
    );
}
