const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PLATFORM_HOST = 'https://br1.api.riotgames.com';
const REGIONAL_HOST = 'https://americas.api.riotgames.com';

const options = {
    headers: {
        'X-Riot-Token': 'RGAPI-8624a4f1-1be3-4f6e-a278-0679a78e9e7e'
    }
};

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    const urlObj = new URL(req.url, 'http://localhost:8080');
    let data = [];

    console.log(req.method, req.headers.origin, req.url);
    // console.log(req.headers);

    res.setHeader('Content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    switch (urlObj.pathname) {
        case '/summoner':
            https.get(
                `${PLATFORM_HOST}/lol/summoner/v4/summoners/by-name/${urlObj.searchParams.get('summonerName')}`,
                options, 
                r => {
                    r.on('error', err => {
                        console.log(err.name, err.message);
                        res.statusCode = 500;
                        res.end();
                    });

                    r.on('data', chunk => data.push(chunk));
                    r.on('end', () => {
                        res.statusCode = r.statusCode;
                        res.write(Buffer.concat(data).toString());
                        res.end();
                    });
                });
            break;
        case '/matches':
            https.get(
                `${REGIONAL_HOST}/lol/match/v5/matches/by-puuid/${urlObj.searchParams.get('summonerPuuid')}/ids?start=0&count=3`,
                options, 
                r => {
                    r.on('error', err => {
                        console.log(err.name, err.message);
                        res.statusCode = 500;
                        res.end();
                    });

                    r.on('data', chunk => data.push(chunk));
                    r.on('end', () => {
                        res.statusCode = r.statusCode;
                        res.write(Buffer.concat(data).toString());
                        res.end();
                    });
                });
            break;
        case '/match':
            https.get(
                `${REGIONAL_HOST}/lol/match/v5/matches/${urlObj.searchParams.get('matchId')}`,
                options, 
                r => {
                    r.on('error', err => {
                        console.log(err.name, err.message);
                        res.statusCode = 500;
                        res.end();
                    });

                    r.on('data', chunk => data.push(chunk));
                    r.on('end', () => {
                        res.statusCode = r.statusCode;
                        res.write(Buffer.concat(data).toString());
                        res.end();
                    });
                });
            break;
        case '/masteries':
            https.get(
                `${PLATFORM_HOST}/lol/champion-mastery/v4/champion-masteries/by-summoner/${urlObj.searchParams.get('summonerId')}`,
                options, 
                r => {
                    r.on('error', err => {
                        console.log(err.name, err.message);
                        res.statusCode = 500;
                        res.end();
                    });

                    r.on('data', chunk => data.push(chunk));
                    r.on('end', () => {
                        res.statusCode = r.statusCode;
                        res.write(Buffer.concat(data).toString());
                        res.end();
                    });
                });
            break;
        default:
            res.statusCode = 404;
            res.end();
    }
});

server.listen(PORT, () => console.log(`Server opened on port ${PORT}...`));