const http = require('http');
const axios = require('axios');

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
    const urlObj = new URL(req.url, 'http://localhost:8080');
    let data = [];

    res.setHeader('Content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
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
            res.statusCode = 404;
            res.end();
    }
});

server.listen(PORT, () => console.log(`Server opened on port ${PORT}...`));