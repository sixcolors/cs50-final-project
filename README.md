# Canadian Wildfire Map

#### Video Demo:  https://youtu.be/3aE-jOlO_YE

#### Live Demo:  https://canadian-wildfire-map-u3ppf.ondigitalocean.app/

## Description:

This is a my CS50 Final Project. With the wildfire season in Canada getting worse every year, I wanted to create a web app that would allow users to see the current wildfires in Canada. The app uses the NRCAN Open Data API to get the current wildfires in Canada.

Wildfire data is displayed on a web map using Leaflet and OpenStreetMap.

The app will ask the user for their location and zoom to that location if location access is allowed and can be determined. If the user denies location access or the location cannot be determined, the map will zoom to the default location of Canada at latitute 60 and longitude -95 and zoom level 4.

When a user clicks on a wildfire marker, a popup will display the wildfire name, the agency in charge, the fire size and status, and the distance to the wildfire from the user's location.

The user can also search for a location using the search input. The app will use the NRCAN Geolocation Service to get the geographic location of the named feature. The app will then zoom to the location and display the wildfires in that area.

#### The Components and What They Do

* **App.svelte** - The main component that contains the map and the search input.
* **Map.svelte** - The component that contains the Leaflet map.
* **Locator.svelte** - The component that lets the user search for a location.
* **Location.svelte** - A component that displays a possible location for the user to select in the Locator's dropdown menu.

#### Design Decisions

I chose to use Svelte for this project because I wanted to learn a new framework. I chose Svelte because it is a compiled, lightweight and fast. It also has a reputation for being fun to use.

I chose to use TypeScript for this project because I wanted to practice using TypeScript. I have more experiance developing web application using JavaScript.

I chose to use Leaflet for the map because it is lightweight and easy to use. I also chose Leaflet because it is open source and has a large community.

I chose to use OpenStreetMap for the map tiles because it is open source, has a large community and it's free.

I chose to use the NRCAN Open Data API because it is free and has a large amount of data, including the current wildfires in Canada.

Using a web map to display the wildfires allows the user to see the wildfires in relation to their location. This allows the user to see how close the wildfires are to them. This can help the user make decisions about their safety. I also thought it was important to highlight wildfires that are very close (within 100 km) so I added a header to the map that displays the number of wildfires that are within 100 km of the user's location.

Overall, this was a fun project to work on and I learned a lot about Svelte and TypeScript. I did run into some issues with figuring out how to properly nest Svelte components and use message passing between components. I also had some issues with getting the Leaflet map to work properly with Svelte, speficically I used svelte-leafletjs, but it lacks many methods and events, so I had to handle those in the onMount and other handlers by accessing the Leaflet map object directly.

## About the Tech Stack
The app is built using Svelte with typescript, Leaflet, and OpenStreetMap. The app uses the NRCAN Open Data to get the current wildfires in Canada and the NRCAN Web Mapping Service to get the wildfire boundaries and point location icons. Geting the geographic location of named features is done using the NRCAN Geolocation Service.

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
4. Open http://localhost:8080 to view it in the browser.

## How to Use the App
1. Allow the app to access your location.
2. Click on a wildfire marker to get more information about the wildfire.
3. Search for a location using the search input.

## How to Run the Tests
```
npm run test
```

## How to Build the App
```
npm run build
```

## How to Deploy the App
1. Create a new repository on GitHub.
2. Push the app to GitHub.
```
git remote add origin
git push -u origin main
```
3. Create a new app on DigitalOcean.
4. Connect the app to the GitHub repository.
5. Deploy the app.

## How to Contribute to the Project
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
This project is licensed under the MIT License - see the LICENSE.md file for details.

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