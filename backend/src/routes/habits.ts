import server from '@providers/express';
import habitsController from '@controllers/habitsController';

import { z } from "zod";
import dayjs from 'dayjs';

const habits = new habitsController();

server.get('/habits', async (req, res) => {
    try {
        const getHabits = await habits.getHabits();

        if (!getHabits) return res.status(500).json({ error: 'Server Internal Error' })
    } catch (error) {
        return res.status(500).json({ error: 'Server Internal Error', message: error })
    }
})

server.get('/teste', (req, res) => {
    res.status(200).send("OI")
})

server.post('/habits/create', async (req, res) => {
    try {
        const verifyHabits = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })

        const { title, weekDays } = verifyHabits.parse(req.body);

        const createHabits = await habits.createHabits({ title, weekDays });

        if (!createHabits) return res.status(500).json({ error: 'Server Internal Error' })

        return res.status(201).json(createHabits)
    } catch (error) {
        return res.status(500).json({ error: 'Server Internal Error', message: error })
    }
})

server.patch('/habits/:id/toogle', async (req, res) => {
    try {
        const toogleHabitsParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = toogleHabitsParams.parse(req.params);

        const createHabits = await habits.toogleHabits({ id });

        if (!createHabits) return res.status(500).json({ error: 'Server Internal Error' })

        return res.status(201).json(createHabits)
    } catch (error) {
        return res.status(500).json({ error: 'Server Internal Error', message: error })
    }
})

server.get('/summary', async (req, res) => {
    try {
        const summary = await habits.summary()

        console.log(summary)

        return res.status(201).json(summary)
    } catch (error) {
        return res.status(500).json({ error: 'Server Internal Error', message: error })
    }
})