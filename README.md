This is the backend for the Summoner Search, which repo you can find [here](https://github.com/Rvaranda/summoner-search).

It receive requests from the frontend and then make requests to the Riot Games API, fetching the data and sending back to the frondend.

### Using this server

To run this server, you will need an API key. You can get one in the Riot Games developer [website](https://developer.riotgames.com). Create an `.env` file and create a variable named `RIOT_API_TOKEN` with your key, like this:

```
RIOT_API_TOKEN={your key here}
```