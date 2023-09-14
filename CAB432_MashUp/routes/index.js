var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');

router.get('/', async function(req, res) {
  
  let GamesInfo = [];

  AWS_ACCESS_KEY_ID="ASIA5DYSEEJ4TLZAGPPJ"
  AWS_SECRET_ACCESS_KEY="qFYvp54kHiZfQpNv10dIPuaS+Hp91k8HJvFB1nse"
  AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEFgaDmFwLXNvdXRoZWFzdC0yIkYwRAIgdMUf/jYdq0WhTYWHATHVt2h++m++KfcUHxJu+oGcE2gCIBoE/QIocKMug8KvgJpnBpKxRw1QUyBaXPnC456ev5qhKqUDCEEQAxoMOTAxNDQ0MjgwOTUzIgy8/hxjCq2WalQM9gIqggPqRw/HzlREkDN+e5h+KAi9KYWGHIey/KIBTaEz/AaYNByOmm1DOhXgAPKhUbedK6HiaZJtTkmzBjr1F0DGttHnfb1YtaNauF4XJpJ0ALlRnUZo9+vq+Xu38YEvwZRZpm+j22MD2FLMpDg/4HM2yMq9qh2YU3/wJ0o9S9Q2Kuwf0TsoyOS07cF3XFpnekBwcXqkQYVu2L930oA3w4v9dRp6Qh2tBp8pJqsrF2SgAsi2rBmA9TxgZT19V5ys11RCvKfG6RhDQWH6ApIZH6BSciApB4DwLtrGdJwKybVjoP2DE3Z08mjpSvCQiuVq8rLHecppJDysYGkecAOVSnGgyuWhG56O8l388HeiXLMcO76DqXogDLzgisHdVbvhSplKtQy/x3UUxOpCFIxF60mXp135hhLufKS/uDSEwHL7eRKMqGawQSWGaMAPxCFepNqZ2IHxrTvMVgFJfA4YFFICjA1P4Tb0bb3xcIeCvXAPBydv8DwASL1iyS3y6WzuXrVd9ixM0TCK6oqoBjqnAQqQiu+DdmU3SevmmdK3fy2FDOtaDFIhxovH6iJaRwMvmRTbIyC/efnCT//sLOOQEQ6vw9lxOXd4lHu0IvRw60ZVgZRleUXDsRyNHUHG64pF57Ma7WbaFUNwB1nai1kYoi1X2gIO/fYFPP9swXI+g8hW14p8fEgifnTpACXxmqzL1QSpMlkEFSe75HsPj7cMrT8LqYjWJknq0cqdUNgVSL7APN+w52sU"

  try {
    //Page Counter
    const s3 = new AWS.S3();
    const BUCKET_NAME = 'n11371188';
    const PAGE_COUNT_KEY = "page-count.txt"

    const number = await s3.getObject({Bucket : BUCKET_NAME, Key:PAGE_COUNT_KEY}).promise();
    const pageCount = parseInt(number.Body.toString() || '0', 10);
    console.log(pageCount);

    //Football data
    const SOCCER_API_KEY = "8d7aeb39f9b14916b21b053feba4ba7d";
    const competition = "EPL";
    const season = "2024";

    const url_1 = `https://api.sportsdata.io/v4/soccer/scores/json/Schedule/${competition}/${season}?key=${SOCCER_API_KEY}`;

    const response = await fetch(url_1);
    const data = await response.json();
    
    const now = new Date();
    const currentDateTime = now.toISOString();
   
GamesInfo = data.flatMap(competition => {
  return competition.Games.filter(game => {
    return game.DateTime > currentDateTime;
  }).slice(0, 5) 
  .map(game => ({
    DateTime: game.DateTime.replace("T","  "),
    HomeTeamName: game.HomeTeamName,
    AwayTeamName: game.AwayTeamName,
    HomeTeamKey : game.HomeTeamKey,
    AwayTeamKey : game.AwayTeamKey
  }));
});

const url_2 = `https://api.sportsdata.io/v4/soccer/scores/json/Teams/${competition}?key=${SOCCER_API_KEY}`;
const team_response = await fetch(url_2);
const team_data = await team_response.json();

const teamLogoMap = {};
team_data.forEach(team => {
  teamLogoMap[team.Name] = team.WikipediaLogoUrl;
});

GamesInfo.forEach(game => {
  game.HomeTeamLogoUrl = teamLogoMap[game.HomeTeamName];
  game.AwayTeamLogoUrl = teamLogoMap[game.AwayTeamName];
});

for (const match of GamesInfo) {
  match.HomeTeamName = EditName(match.HomeTeamName);
  match.AwayTeamName = EditName(match.AwayTeamName);
  match.HomeTeamKey = EditKey(match.HomeTeamKey);
  match.AwayTeamKey = EditKey(match.AwayTeamKey);
}

function EditName(Name){

  if(Name == "AFC Bournemouth"){
      Name = "Bournemouth";
  }else if(Name == "Brighton & Hove Albion FC"){
      Name = "Brighton and Hove Albion";
  }else if(Name == "Luton Town FC"){
      Name = "Luton";
  }else{
      Name = Name.replace(/ FC/g,"");
  }
  return Name;
}

function EditKey(Name){

  switch (Name) {
    case "BOR":
      Name = "BOU";
      break;
    case "CHC":
      Name = "CHE";
      break;
    case "MNU":
      Name = "MUN";
      break;
    case "MNC":
      Name = "MAC";
      break;
    case "WBA":
      Name = "WES";
      break;
    case "BHA":
      Name = "BRI";
      break;
    default:
      break;
  }

  return Name;
}

const ODDS_API_KEY = "9a57fd35089cc16ee2faf6c2412283da";
const League = "soccer_epl"
const region = "uk";

const url_3 = `https://api.the-odds-api.com/v4/sports/${League}/odds/?apiKey=${ODDS_API_KEY}&regions=${region}&markets=h2h,spreads&oddsFormat=american`;
const odds_response = await fetch(url_3);
const odds_data = await odds_response.json();

const matched_data = [];

for (const game of GamesInfo) {
    const home_team = game.HomeTeamName;
    const away_team = game.AwayTeamName;
    
    for (const match_data of odds_data) {
        if (
            match_data.home_team === home_team
            && match_data.away_team === away_team
        ) {
          const bookmarkKeys = match_data.bookmakers.slice(0, 3).map(bookmaker => {
            const outcomes = bookmaker.markets[0].outcomes;
            const homeOutcome = outcomes.find(outcome => outcome.name === home_team);
            const awayOutcome = outcomes.find(outcome => outcome.name === away_team);
            const drawOutcome = outcomes.find(outcome => outcome.name === 'Draw');
            
            return {
                key: bookmaker.key,
                homeodds: homeOutcome ? homeOutcome.price : null,
                awayodds: awayOutcome ? awayOutcome.price : null,
                drawodds: drawOutcome ? drawOutcome.price : null
            };
          });
          matched_data.push(bookmarkKeys);
      }
    }
}

const mergedData = GamesInfo.map((matchInfo, index) => ({
  ...matchInfo,
  ...matched_data[index]
}));

console.log(mergedData);

res.render("index", { mergedData,pageCount});

  } catch (error) {
    console.error('error:', error);
    res.status(500).json({ error: 'unable to fetch data' });
  }

});

module.exports = router;
