const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const config = require(path.join(__dirname, '../../', 'config', 'config.json'));

const app = express();
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../../', 'public')));
app.use(favicon(path.join(__dirname, '../../', 'public', 'img', 'favicon.ico')));
app.use('/js', express.static(path.join(__dirname, '../../', 'dest', 'front')));
app.use('/vue-material', express.static(path.join(__dirname, '../../', 'node_modules', 'vue-material')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../', 'html', 'index.html'));
});

const port = process.env.PORT || config.port;
console.info(`listen at ${port}`);
app.listen(port);
