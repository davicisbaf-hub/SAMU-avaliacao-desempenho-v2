type Props = {
    titulo: string;
    placeholder: string;
}

export default function TextArea({ titulo, placeholder }: Props){
    return (
        <div className='bg-card border border-border rounded-xl p-4 space-y-2 gap-3 flex flex-col'>
            <label className='text-[14px] font-semibold text-[#0e1216]'>{titulo}</label>
            <textarea className='w-full bg-[#fcfcfc] border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:[text-#555f69]/50 resize-none focus:outline-none focus:ring-2 focus:ring-ring' rows={4} placeholder={placeholder}></textarea>
        </div>
    )
}