type Props = {
    Responsavel: string;

}

export default function Assinatura({ Responsavel }: Props) {
    return (
        <div className='text-center'>
            <div className='h-12 border-b-2 border-border mb-2'></div>
            <p className='text-sm [text-#555f69]'>{Responsavel}</p>
            <p className='text-xs [text-#555f69] mt-0.5'>Data: ___/___/______</p>
        </div>
    )
}