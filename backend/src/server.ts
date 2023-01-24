import server from '@providers/express';

import "@routes/habits"
import "@routes/days"

server.listen(3333, () => {
    console.log("Server iniciado")
})

