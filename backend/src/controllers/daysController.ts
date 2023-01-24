import mainController from '@controllers/mainController'
import dayjs from 'dayjs';

export default class daysController extends mainController {

    async getDay({ date }: getDay) {
        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day')

        try {
            const possibleHabits = await this.db.habit.findMany({
                where: {
                    created_at: {
                        lte: date
                    },

                    weekDays: {
                        some: {
                            week_day: weekDay
                        }
                    }
                }
            });

            const day = await this.db.day.findFirst({
                where: {
                    date: parsedDate.toDate()
                },

                include: {
                    dayHabits: true,
                }
            })

            const completedHabits = day?.dayHabits.map((dayHabit: any) => {
                return dayHabit.habit_id
            }) ?? []

            return { possibleHabits, completedHabits }
        } catch (error) {
            console.log(error)
            return null;
        }
    }
}

type getDay = {
    date: Date
}