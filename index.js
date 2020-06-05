const express = require('express')
const path = require('path')

const app = express();
const port = 3000;

// hide powered by express
app.disable('x-powered-by');

// Serving static files
app.use('/public', express.static(path.resolve(__dirname, 'test')));
app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log('__dirname ', __dirname)
    res.sendFile(__dirname + '/public/facebook.html');
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

