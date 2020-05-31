const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


const express = require('express')
const path = require('path')

const app = express()
const port = 3000

// hide powered by express
app.disable('x-powered-by');

// Serving static files
app.use('/public', express.static(path.resolve(__dirname, 'public')));
app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log('__dirname ', __dirname)
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

