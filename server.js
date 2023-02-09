const http = require('http');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

require('dotenv').config();

const plataformApi = axios.create({
    baseURL: 'https://br1.api.riotgames.com',
    headers: {
        'X-Riot-Token': process.env.RIOT_API_TOKEN
    }
})

const regionalApi = axios.create({
    baseURL: 'https://americas.api.riotgames.com',
    headers: {
        'X-Riot-Token': process.env.RIOT_API_TOKEN
    }
})

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const extension = path.extname(req.url);

    let contenType, filePath;

    switch (extension) {
        case '.css':
            contenType = 'text/css';
            break;
        case '.js':
        case '.mjs':
            contenType = 'text/javascript';
            break;
        case '.txt':
            contenType = 'text/plain';
        case '.jpg':
        case '.jpeg':
            contenType = 'image/jpg';
            break;
        case '.png':
            contenType = 'image/png';
            break;
        case '.json':
            contenType = 'application/json';
            break;
        default:
            contenType = 'text/html';
    }

    res.setHeader('Content-type', contenType);
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (contenType === 'text/html') {
        if (urlObj.pathname === '/') filePath = path.join(__dirname, 'build', 'index.html');
        else filePath = path.join(__dirname, 'build', urlObj.pathname);
    }
    else filePath = path.join(__dirname, 'build', urlObj.pathname);

    switch (urlObj.pathname) {
        case '/summoner':
            plataformApi.get(`/lol/summoner/v4/summoners/by-name/${urlObj.searchParams.get('summonerName')}`)
                .then(response => {
                    res.statusCode = response.status;
                    res.write(JSON.stringify(response.data));
                    res.end();
                })
                .catch(err => {
                    res.statusCode = err.response.status;
                    res.write(JSON.stringify(err.response.data));
                    res.end();
                });
            break;
        case '/matches':
            regionalApi.get(`/lol/match/v5/matches/by-puuid/${urlObj.searchParams.get('summonerPuuid')}/ids?start=0&count=10`)
                .then(response => {
                    res.statusCode = response.status;
                    res.write(JSON.stringify(response.data));
                    res.end();
                })
                .catch(err => {
                    res.statusCode = err.response.status;
                    res.write(JSON.stringify(err.response.data));
                    res.end();
                });
            break;
        case '/match':
            regionalApi.get(`/lol/match/v5/matches/${urlObj.searchParams.get('matchId')}`)
                .then(response => {
                    res.statusCode = response.status;
                    res.write(JSON.stringify(response.data));
                    res.end();
                })
                .catch(err => {
                    res.statusCode = err.response.status;
                    res.write(JSON.stringify(err.response.data));
                    res.end();
                });
            break;
        case '/masteries':
            plataformApi.get(`/lol/champion-mastery/v4/champion-masteries/by-summoner/${urlObj.searchParams.get('summonerId')}`)
                .then(response => {
                    res.statusCode = response.status;
                    res.write(JSON.stringify(response.data));
                    res.end();
                })
                .catch(err => {
                    res.statusCode = err.response.status;
                    res.write(JSON.stringify(err.response.data));
                    res.end();
                });
            break;
        default:
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end();
                    throw err;
                }

                res.end(data);
            });
    }
});

server.listen(PORT, () => console.log(`Server opened on port ${PORT}...`));