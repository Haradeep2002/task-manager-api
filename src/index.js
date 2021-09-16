const app = require('./app')

//environment variabls can be set in config directory
//for heroku used heroku config command and mongodb atlas to deploy
const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})