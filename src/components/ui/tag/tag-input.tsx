'use client'
import { addTagToPost } from "@/actions/tag";
import Input from "@/components/form/input";
import useTags from "@/hooks/use-tag";
import { useForm } from "react-hook-form";
import { TbTag } from "react-icons/tb";

export interface TagInputProps {
    postId?: string
    refetch?: () => void
}

export default function TagInput({ postId, refetch }: TagInputProps) {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            tag: ''
        }
    });

    const onSubmit = handleSubmit(async (value) => {
        if (postId) {
            const payload = {
                ...value,
                postId
            }
            const response = await addTagToPost(payload);
            if (response?.id) {
                reset()
                refetch?.()
            }
        }
    })

    return (
        <form onSubmit={onSubmit}>
            <Input withIcon icon={<TbTag />} control={control} name="tag" showLabel={false} placeholder="Add tags" />
        </form>
    )
}
