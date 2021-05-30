import App from './app'
import * as bodyParser from 'body-parser'
import loggerMiddleware from './middleware/logger'
import * as express from 'express'
import * as YAML from 'yamljs';

import * as swaggerUi from 'swagger-ui-express';
var cors = require('cors')
import HomeRoute from './routes/home/home.route'
import AuthRoute from './routes/auth/auth.route'
import MemberSkillRoute from './routes/skills/member-skill.route';
import EventRoutes from './routes/events/event.route';
import ParticipationsRoute from './routes/participations/participations.route';
import * as paypal from "paypal-rest-sdk"


const server: express.Application = express();

const swaggerDocument = YAML.load('docs/swagger.yaml');



const app = new App({
    port: process.env.PORT || 8000,
    middleWares: [

		bodyParser.json({ limit: '50mb' }),
		bodyParser.urlencoded({ limit: '50mb', extended: true }),
        loggerMiddleware
    ],
    controllers: [
        new HomeRoute(),
        new AuthRoute(),
        new MemberSkillRoute(),
        new EventRoutes(),
        new ParticipationsRoute()
    ],
})

    // configure paypal with the credentials you got when you created your paypal app
    paypal.configure({
        'mode': 'sandbox', //sandbox or live 
        'client_id': 'AYsgr-D5cjaFn3nFFut2XL5YhCuqFh0M52TEdYtGdJrNaSzKJaNOlNtrdVXq1x9JN96goLO1e891yg50', // please provide your client id here 
        'client_secret': 'EL6QnWqfUAKJ18DX_pHB6Zk4w2hw6RX3fppvbMEfhnfqK8I0rQktsvQddrarPM285_RikMOcFUTZn0Q2' // provide your client secret here 
      });



app.dbConnection();

app.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


app.app.get('/' , (req , res) => {
    console.log('cosole' , __dirname +'/index.html')
    res.sendFile(__dirname +'/index.html'); 
})

app.app.get('/success' , (req ,res ) => {
    console.log(req.query); 
    res.sendFile(__dirname +'/success.html'); 
})

// error page 
app.app.get('/err' , (req , res) => {
    console.log(req.query); 
    res.sendFile(__dirname +'/err.html'); 
})



