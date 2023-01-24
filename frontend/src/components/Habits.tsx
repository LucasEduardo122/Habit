type habitProps = {
    completed: number
}

export default function Habits({completed}: habitProps) {
    return(
        <div className="bg-zinc-900 w-10 text-white rounded m-2 text-center flex items-center justify-center">
            {completed}
        </div>
    )
}