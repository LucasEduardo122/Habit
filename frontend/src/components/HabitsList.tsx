import { Check } from 'phosphor-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';
import services from '@/services/axios';
import dayjs from 'dayjs';
import { ApiError } from 'next/dist/server/api-utils';

interface HabitsListProps {
    date: Date,
    onCompletedChange: (completed: number) => void
}

interface HabitsInfo {
    possibleHabits: Array<{
        id: string,
        title: string,
        created_at: string
    }>,
    completedHabits: string[]
}

export default function HabitsList({ date, onCompletedChange }: HabitsListProps) {
    const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

    async function handleToggleHabit(habitId: string) {

        await services.patch(`/habits/${habitId}/toogle`)

        const isHabitAlreadyCompleted = habitsInfo?.completedHabits.includes(habitId)

        let completedHabits: string[] = [];

        if(isHabitAlreadyCompleted) {
            completedHabits = habitsInfo!.completedHabits.filter(id => id != habitId)
        } else {
            completedHabits = [...habitsInfo!.completedHabits, habitId]
        }

        setHabitsInfo({
            possibleHabits: habitsInfo!.possibleHabits,
            completedHabits,
        })

        onCompletedChange(completedHabits.length)
    }

    useEffect(() => {
        services.get("/day", {
            params: {
                date: date.toISOString()
            }
        }).then(response => {
            setHabitsInfo(response.data)
        }).catch(error => {
            alert("Falha ao trazer dados")
        })
    }, [])

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

    return (
        <>

            <div className='mt-6 flex flex-col gap-3'>
                {habitsInfo?.possibleHabits.map(habit => (
                    <Checkbox.Root
                        key={habit.id}
                        onCheckedChange={() => handleToggleHabit(habit.id)}
                        checked={habitsInfo.completedHabits.includes(habit.id)}
                        disabled={isDateInPast}
                        className='flex items-center gap-3 group'
                    >
                        <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50 transition-colors'>
                            <Checkbox.Indicator>
                                <Check size={20} className="text-white" />
                            </Checkbox.Indicator>
                        </div>

                        <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                            {habit.title}
                        </span>
                    </Checkbox.Root>
                ))}

            </div>
        </>
    )
}