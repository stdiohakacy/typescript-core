import * as path from 'path'
import 'reflect-metadata';
import { createExpressServer } from "routing-controllers";
import { createConnection } from 'typeorm';

const app = createExpressServer({
    controllers: [
        path.join(__dirname, '/modules/**/controllers/*{.js,.ts}')
    ]
})

app.listen(3000, () => {
    createConnection()
        .then(async connection => {
            console.log('App Express Server listening on port : 3000')
        })
        .catch(error => console.log("Error: ", error));
})