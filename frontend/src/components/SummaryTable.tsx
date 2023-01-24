import services from '@/services/axios'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { weekDays } from '../utils/constants'
import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning'
import HabitDay from './HabitDay'
import WeekDay from './WeekDay'

const summaryDates = generateDatesFromYearBeginning()
const minimumSummaryDatesSize = 18 * 7
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

export default function SummaryTable() {

  const [summary, setSummary] = useState<Summary>([])

  useEffect(() => {
    services.get('/summary').then(response => {
      console.log(response.data.summary)
      setSummary(response.data.summary)
    })
  }, [])
  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, index) => (
          <WeekDay label={weekDay} key={index} />
        ))}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 && summaryDates.map((date) => {
          const dayInSummary = summary.length != 0 ? summary.find(day => {
            return dayjs(date).isSame(day.date, 'day')
          }) : null;

          return (
            <HabitDay key={date.toString()}
              date={date}
              amount={dayInSummary?.amount}
              defaultCompleted={dayInSummary?.completed} />
          )
        })}
        {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, index) => (
          <div key={index} className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed" />
        ))}
      </div>
    </div>
  )
}

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[]