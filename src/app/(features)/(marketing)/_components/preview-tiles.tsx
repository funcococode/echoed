
export default function PreviewTile({ title, meta }: { title: string; meta: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="text-sm font-medium text-zinc-100">{title}</div>
            <div className="text-xs text-zinc-400">{meta}</div>
        </div>
    );
}