<!-- Based on https://github.com/othneildrew/Best-README-Template/blob/master/README.md -->
<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/270px-React-icon.svg.png" alt="Logo" height="80">
  <h3 align="center">Kids Football Portal</h3>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

A React portal to keep track of my children football matches schedule, standings, etc. from one single place.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can see a live demo of this portal here: https://samuelcasanova.github.io

<img src="https://github.com/samuelcasanova/samuelcasanova.github.io/raw/master/public/premierportalmobile.png" alt="Screenshot" height="250">

### Built With

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Testing-Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

You will need a docker installation to run this portal

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/samuelcasanova/samuelcasanova.github.io
   ```
2. Run docker containers with compose
   ```sh
   docker compose up
   ```
3. You can run the portal locally with CRA scripts by
   ```sh
   npm install && npm start
   ```

### Yearly update

When the season begin there are several steps to do:

1. Go to premier scrapper project and update the index.json file with the classification URLs in the FCF site.
2. Execute the scrapper.
   ```sh
   npm start
   ```
3. Check the output.json file. Check each display name. If there is anyone incorrect adapt the preReplacements array at the end of the index.json file.
4. Replace the teams.json with the output.json file content.
5. Go to footballers.json and update the categories and stats URLs for the players.
6. Go to menu.js and update the classification urls
7. Execute the tests and commit and pull the changes to the repository to upload the live website
   ```sh
   npm test
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Samuel Casanova - [@casanovasamuel](https://twitter.com/casanovasamuel) - samuel.casanova@gmail.com

Project Link: [https://github.com/samuelcasanova/rabbitcourse-rpc](https://github.com/samuelcasanova/rabbitcourse-rpc)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[react-shield]: https://img.shields.io/badge/react
[react-url]: https://react.dev/
