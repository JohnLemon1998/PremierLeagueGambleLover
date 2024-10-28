# English Premier League Fan App

This application is designed for fans of the English Premier League (EPL) and users interested in placing bets. It provides up-to-date information on matches, odds, and teams by integrating multiple external data sources. The project covers system requirements, technical architecture, data flow, deployment with Docker, and includes a comprehensive testing plan.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [APIs and Resources](#apis-and-resources)
- [Technical Breakdown](#technical-breakdown)
- [Data Flow](#data-flow)
- [Deployment with Docker](#deployment-with-docker)
- [Testing Plan](#testing-plan)
- [Future Expansion](#future-expansion)
- [License](#license)

## Overview

This fan application integrates data from various APIs to offer a detailed experience for EPL fans. Users can explore match schedules, team details, betting odds, and related news articles. The app is containerized using Docker to ensure a stable deployment across environments, and Amazon S3 is used for persistent data storage.

## Features

- Live match schedules and team information
- Betting odds and historical data for matches
- Player, team, and coach information with live updates
- News updates filtered by teams or coaches
- Persistent visitor count tracking with Amazon S3

## APIs and Resources

1. **Sports Data IO**
   - Provides match schedule data, including teams and match dates.

2. **Odds API**
   - Supplies various types of betting odds for upcoming and past events, supporting multiple sports.

3. **API-Football**
   - Offers extensive football data, including information on coaches, players, and lineups.

4. **NEWSDATA.IO**
   - Fetches news articles from various publishers, filtered by team or coach.

5. **Persistence Service**
   - **Amazon S3**: Stores visitor count data.
   - **Docker**: Containerizes the app for consistent deployment.

## Technical Breakdown

### Architecture and Data Flow

- **app.js**: Entry point that configures the Express application, middleware, and routes.
- **index.js**: Handles main route, fetches data from APIs, processes and merges it, and renders it in `index.hbs`.
- **team.js**: Displays detailed team information (coach, players, news) and renders `team.hbs`.
- **Handlebars Views**:
  - `index.hbs`, `team.hbs`: Define the HTML structure for data display, with placeholders for dynamic content.

### Code Organization

- **Data Fetching**: HTTP requests are made to external APIs for live match data, odds, and news.
- **Persistence**: Visitor count data is retrieved and updated in Amazon S3.
- **Error Handling**: Middleware in `app.js` captures and returns error responses.

## Data Flow

1. A user request (typically to the root URL "/") is processed through middleware in `app.js`.
2. Depending on the URL, either `index.js` or `team.js` fetches data from external APIs.
3. Data is merged, transformed, and structured to be displayed in the Handlebars views.
4. The view is rendered and returned as an HTML response for the user’s browser.
5. Errors are captured and processed through error handling middleware in `app.js`.

## Deployment with Docker

This application uses Docker for containerization. The setup ensures consistent environments for development and production.

1. **Dockerfile**:
   - **Base Image**: Uses the official Node.js LTS image.
   - **Application Setup**:
     - Copies code to `/CAB432_MashUp`.
     - Sets working directory.
     - Installs dependencies with `npm install`.
     - Exposes port 3000 and starts the app with `npm start`.

   ```dockerfile
   FROM node:lts
   COPY . /CAB432_MashUp
   WORKDIR /CAB432_MashUp
   RUN npm install
   EXPOSE 3000
   CMD ["npm", "start"]
