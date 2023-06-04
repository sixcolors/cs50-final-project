# Canadian Wildfire Map

This is a my CS50 Final Project. With the wildfire season in Canada getting worse every year, I wanted to create a web app that would allow users to see the current wildfires in Canada. The app uses the NRCAN Open Data API to get the current wildfires in Canada.

Wildfire data is displayed on a web map using Leaflet and OpenStreetMap.

The app will ask the user for their location and zoom to that location if location access is allowed and can be determined. If the user denies location access or the location cannot be determined, the map will zoom to the default location of Canada at latitute 56.1304 and longitude -106.3468 and zoom level 4.

When a user clicks on a wildfire marker, a popup will display the wildfire name, the fire center latitude and longitude, the fire size, and the distance to the wildfire from the user's location.

The user can also search for a location using the search input. However a distance to wildfires will not be displayed if the user searches for a location.

The user can click on a wildfire marker to get more information about the wildfire.

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