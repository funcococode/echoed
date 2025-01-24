export interface SectionHeadingProps {
    text: string
}
export default function SectionHeading({ text }: SectionHeadingProps) {
    return (
        <h2 className="text-sm pl-4 border-l-4 border-indigo-700 text-indigo-700">{text}</h2>
    )
}
