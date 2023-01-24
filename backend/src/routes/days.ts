import server from '@providers/express';
import daysController from '@controllers/daysController';

import {z} from "zod";

const days = new daysController();

server.get('/day', async (req, res) => {
    try {
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const {date} = getDayParams.parse(req.query)
        
        const getDays = await days.getDay({date});
        
        if (!getDays) return res.status(500).json({ error: 'Server Internal Error' })

        return res.status(200).json(getDays)
    } catch (error) {
        return res.status(500).json({ error: 'Server Internal Error', message: error })
    }
})