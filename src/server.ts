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
        'client_id': 'AfJeTfrVBHkVfvFgjRmpv8z2-jDeQprZ6DMMAXdgLXsn_BIS3rlW6VOEqhfa79bY-gYziHCyLSidP3ar', // please provide your client id here 
        'client_secret': 'EK-QBsOc0nPguci13VC5md7gUwu9FBbyOVIXmthtcASzKWRsuZY7LP3jIppeooxafyZbkulZayDQZxDX' // provide your client secret here 
      });



app.dbConnection();

app.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


app.app.get('/' , (req , res) => {
    console.log('cosole' , __dirname +'/index.html')
    res.sendFile(__dirname +'/index.html'); 
})

app.app.get('/success' , (req ,res ) => {
    console.log('quewry', req.query); 

    var paymentId = req.query.paymentId.toString();
    var payerId = { 'payer_id': req.query.PayerID.toString() };
    paypal.payment.execute(paymentId, payerId, function(error, payment){
        if(error){
            console.error(error);
        } else {
            if (payment.state == 'approved'){ 

                console.log('all sucess')

                res.sendFile(__dirname +'/success.html'); 
            } else {
                res.send('payment not successful');
            }
        }
    });
    
})

// error page 
app.app.get('/err' , (req , res) => {
    console.log(req.query); 
    res.sendFile(__dirname +'/err.html'); 
})



