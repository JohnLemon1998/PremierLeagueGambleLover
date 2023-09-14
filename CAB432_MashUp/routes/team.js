var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:teamKey', async function(req, res) {

  try {
    const teamKey = decodeURIComponent(req.params.teamKey);
    const LeagueID = 39;
    const FOOTBALL_API_KEY = "12e4dbcac95159408b8ff73edff192a3";
    const SEASON = "2023";
    const MATCH_STATUS = "FT";

    //Get team id based on input from previous page
    const response1 = await fetch(`https://v3.football.api-sports.io/teams?code=${teamKey}&league=${LeagueID}&season=${SEASON}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": FOOTBALL_API_KEY
      }
    });
    const data1 = await response1.json();
    const teamID = data1.response[0].team.id;
  
    //Get fixture number based on team id
    const response2 = await fetch(`https://v3.football.api-sports.io/fixtures?season=${SEASON}&team=${teamID}&league=${LeagueID}&status=${MATCH_STATUS}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": FOOTBALL_API_KEY
      }
    });

    const data2 = await response2.json();
    let lastElement = data2.response.pop();
    const FIXTURE_ID = lastElement.fixture.id;

    //Get line ups of the lastet match
    const response3 = await fetch(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${FIXTURE_ID}&team=${teamID}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": FOOTBALL_API_KEY
      }
    })
    
    const data3 = await response3.json();
    const team = data3.response;

    console.log("team");
    console.log(team);

    //NewsAPI part
    const NEWS_API_KEY = "pub_29360e5f859ce61d30e8f1501f7a5ad065461";
    const category = "sports";
    const language = "en";
    const team_name = team[0].team.name;
    
    const parts = team[0].coach.name.split(' ');
    const coach_name = parts[1];
    console.log(coach_name);

    const news_url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=${coach_name}%20AND%20${team_name}&language=${language}&category=${category}`;
    const response4 = await fetch(news_url);
    
    const data4 = await response4.json();
    const news = data4.results

    console.log(news);

    res.render("team", { team,news });

  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).send("An error occured");
}
});

module.exports = router;
