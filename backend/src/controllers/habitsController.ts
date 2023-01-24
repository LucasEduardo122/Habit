import mainController from '@controllers/mainController'
import dayjs from 'dayjs';

export default class habitsController extends mainController {
    async getHabits() {
        try {
            const habits = await this.db.habit.findMany();

            return { habits }
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    async createHabits({ title, weekDays }: createHabits) {
        try {
            const today = dayjs().startOf('day').toDate()
            const createHabits = await this.db.habit.create({
                data: {
                    title,
                    created_at: today,
                    weekDays: {
                        create:
                            weekDays.map((weekDay) => {
                                return {
                                    week_day: weekDay
                                }
                            })
                    }
                }
            })

            return { createHabits }
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    async toogleHabits({ id }: toogleHabits) {
        try {
            let toogleHabits = {};

            const today = dayjs().startOf('day').toDate()

            let day = await this.db.day.findUnique({
                where: {
                    date: today
                }
            })

            if (!day) {
                day = await this.db.day.create({
                    data: {
                        date: today
                    }
                })
            }

            const dayHabit = await this.db.dayHabit.findUnique({
                where: {
                    day_id_habit_id: {
                        day_id: day.id,
                        habit_id: id
                    }
                }
            })

            if (dayHabit) {
                const deleteDayHabit = await this.db.dayHabit.delete({
                    where: {
                        id: dayHabit.id
                    }
                })

                toogleHabits = {
                    delete: deleteDayHabit
                }
            } else {
                const createDayHabit = await this.db.dayHabit.create({
                    data: {
                        day_id: day.id,
                        habit_id: id
                    }
                })

                toogleHabits = {
                    create: createDayHabit
                }
            }

            return { toogleHabits }
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    async summary() {
        try {

            const summary = await this.db.$queryRaw`
            SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HDW
          JOIN habits H
            ON H.id = HDW.habit_id
          WHERE
            HDW.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
            AND H.created_at <= D.date
        ) as amount
      FROM days D`

            return { summary }

        } catch (error) {
            console.log(error)
            return null;
        }
    }
}

type createHabits = {
    title: string,
    weekDays: number[]
}

type toogleHabits = {
    id: string
}