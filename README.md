# Canadian Wildfire Map

[![CI](https://github.com/sixcolors/cs50-final-project/actions/workflows/ci.yml/badge.svg)](https://github.com/sixcolors/cs50-final-project/actions/workflows/ci.yml)
[![CodeQL](https://github.com/sixcolors/cs50-final-project/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/sixcolors/cs50-final-project/actions/workflows/github-code-scanning/codeql)
[![Coverage Status](https://coveralls.io/repos/github/sixcolors/cs50-final-project/badge.svg?branch=main)](https://coveralls.io/github/sixcolors/cs50-final-project?branch=main)

#### Video Demo:  [Watch on YouTube](https://youtu.be/3aE-jOlO_YE)

#### Live Demo:  [Access the Canadian Wildfire Map](https://canadian-wildfire-map-u3ppf.ondigitalocean.app/)

## Description:

This project is my CS50 Final Project. As the wildfire season in Canada worsens each year, I developed a web app that allows users to track the current wildfires in Canada. The app utilizes the NRCAN Open Data API to retrieve the latest information on wildfires in Canada.

The wildfire data is displayed on an interactive web map using Leaflet and OpenStreetMap.

The app prompts the user for their location and automatically zooms to that location if location access is permitted and available. In case the user denies location access or the location cannot be determined, the map defaults to Canada's coordinates (latitude 60, longitude -95) with a zoom level of 4.

When a user clicks on a wildfire marker, a popup displays the wildfire name, the agency in charge, the fire size and status, and the distance between the wildfire and the user's location.

Additionally, users can search for specific locations using the search input. The app utilizes the NRCAN Geolocation Service to obtain the geographic coordinates of the named feature. The map then zooms to the searched location and displays the wildfires in that area.

### Components and Their Functions

* **App.svelte** - The main component containing the map and the search input.
* **Map.svelte** - The component responsible for rendering the Leaflet map.
* **Locator.svelte** - The component enabling users to search for a specific location.
* **Location.svelte** - A component displaying a potential location for the user to select from the dropdown menu in the Locator.

### Design Decisions

I opted to use Svelte for this project to learn a new framework. Svelte appealed to me due to its compilation process, lightweight nature, speed, and reputation for being enjoyable to use.

To practice TypeScript, I chose it as the programming language for this project, even though I have more experience developing web applications with JavaScript.

For the map functionality, I selected Leaflet due to its simplicity and user-friendly nature. Additionally, Leaflet is an open-source library with a large community.

To provide map tiles, I utilized OpenStreetMap, which is open-source, widely supported by the community, and free of charge.

To retrieve wildfire data, I employed the NRCAN Open Data API because it offers extensive data, including information about the current wildfires in Canada, and it is freely accessible.

Using a web map to display the wildfires allows users to visualize the wildfires in relation to their own location, enabling them to assess their proximity to the fires and make informed decisions regarding their safety. To emphasize wildfires within close range (within 100 km), I added a header to the map displaying the number of wildfires within 100 km of the user's location.

Overall, this project was an enjoyable learning experience. I gained valuable knowledge about Svelte and TypeScript, although I encountered challenges with nesting Svelte components and implementing message passing between them. Additionally, integrating the Leaflet map with Svelte presented difficulties since the chosen svelte-leafletjs library lacked certain methods and events. I had to handle them within onMount and other handlers by directly accessing the Leaflet map object.

## Tech Stack
The app is built using Svelte with TypeScript, Leaflet, and OpenStreetMap. It relies on the NRCAN Open Data for retrieving current wildfire data in Canada and the NRCAN Web Mapping Service for wildfire boundaries and point location icons. The NRCAN Geolocation Service is used to obtain geographic coordinates for named features.

## How to Run the App
1. Clone the repo
2. Install the dependencies
```
npm install
```
3. Run the app
```
npm run dev
```
4. Open http://localhost:8080 in your browser to view the app.

## Running the App in Production Mode
```
npm run start
```

4. Open http://localhost:8080 to view it in the browser.

## Using the App
1. Allow the app to access your location.
2. Click on a wildfire marker to view more information about the wildfire.
3. Use the search input to find specific locations.

## Running Svelte Check
```
npm run svelte-check
```

## Running the Tests
```
npm run test
```

## Running the Tests and Viewing in Web UI
```
npm run test:ui
```

## Checking Code Coverage
```
npm run coverage
```

## Building the App
```
npm run build
```

## Deploying the App to DigitalOcean as a Static Site
1. Create a new repository on GitHub.
2. Push the app to GitHub.
```
git remote add origin
git push -u origin main
```
3. Create a new app on DigitalOcean.
4. Connect the app to the GitHub repository.
5. Deploy the app selecting the main branch and the static site option.

## Contributing to the Project
1. Fork the repo.
2. Create a new branch.
```
git checkout -b <branch name>
```
3. Make changes and commit them.
```
git add .
git commit -m "commit message"
```
4. Push the changes to GitHub.
```
git push origin <branch name>
```
5. Create a pull request.

## License
This project is licensed under the MIT License. For details, see the LICENSE.md file.

## Acknowledgements
* [CWFIS Datamart](https://cwfis.cfs.nrcan.gc.ca/datamart)
* [NRCAN Web Mapping Service](https://cwfis.cfs.nrcan.gc.ca/geoserver/public/wms?service=WMS&request=getcapabilities&version=1.1.0&layers=activefires_current&legend_format=image/png&feature_info_type=text/plain)
* [NRCAN Geolocation Service](https://geogratis.gc.ca/services/geolocation/en/locate?q=)
* [Leaflet](https://leafletjs.com/)
* [svelte-leafletjs](https://github.com/ngyewch/svelte-leaflet)
* [OpenStreetMap](https://www.openstreetmap.org/)
* [Svelte](https://svelte.dev/)
* [CS50](https://cs50.harvard.edu/x/2023/)
* [CS50 Final Project](https://cs50.harvard.edu/x/2023/project/)

## Author
* [***Jason McNeil***](https://github.com/sixcolors)
