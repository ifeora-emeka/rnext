import next from 'next';
import {RNextServer} from 'rnext-server'

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const server = new RNextServer({
    app,
})

server.listen(3000)