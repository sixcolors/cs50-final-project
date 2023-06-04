<script lang="ts">
    import { LeafletMap, TileLayer } from "svelte-leafletjs";
    import { onMount } from "svelte";
    import { calculateDistance } from "./utils";
    import Locator from "./Locator.svelte";
    import "leaflet/dist/leaflet.css";
    import L from "leaflet";

    // detect dark mode
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    interface Fire {
        agency: string;
        firename: string;
        lat: number;
        lon: number;
        startdate: string;
        hectares: number;
        stage_of_control: string;
        timezone: string;
    }

    let map: L.Map;
    let mapOptions: L.MapOptions = {
        center: [60, -95],
        zoom: 4,
    };

    onMount(() => {
        // download data
        fetch(
            "https://cwfis.cfs.nrcan.gc.ca/downloads/activefires/activefires.csv"
        )
            .then((response) => response.text())
            .then((data) => {
                // parse csv
                // header: agency, firename, lat, lon, startdate, hectares, stage_of_control, timezone
                const rows = data.split("\n");
                const headers = rows[0].split(",");
                // trim whitespace
                for (let i = 0; i < headers.length; i++) {
                    headers[i] = headers[i].trim();
                }
                const fires: Fire[] = rows
                    .slice(1)
                    .map((row) => {
                        if (row.trim() === "") {
                            return undefined;
                        }
                        const values = row.split(",");
                        const fire: Fire = {} as Fire;
                        for (let i = 0; i < headers.length; i++) {
                            const value = values[i]?.trim();
                            if (!isNaN(value as any)) {
                                fire[headers[i]] = parseFloat(value);
                            } else {
                                fire[headers[i]] = value;
                            }
                        }
                        return fire;
                    })
                    .filter((fire) => fire !== undefined);


                // get location from browser
                let userLocation: number[] | undefined;
                navigator.geolocation.getCurrentPosition((position) => {
                    mapOptions.center = [
                        position.coords.latitude,
                        position.coords.longitude,
                    ];
                    mapOptions.zoom = 8;
                    mapOptions = { ...mapOptions };

                    map.getMap().setView(mapOptions.center, mapOptions.zoom);

                    userLocation = [
                        position.coords.latitude,
                        position.coords.longitude,
                    ];

                    var circle = L.circle(userLocation, {
                        color: "white",
                        fillColor: "#ddd",
                        fillOpacity: 0.5,
                        radius: 10000,
                    }).addTo(map.getMap());
                    
                    addMarkers();
                }, (error) => { 
                    console.log(error);
                    addMarkers() });

                const addMarkers = () => {
                    // add markers
                    fires.forEach((fire) => {
                        let distance: Number | undefined;
                        if (userLocation !== undefined) {
                            distance = calculateDistance(
                                userLocation[0],
                                userLocation[1],
                                fire.lat,
                                fire.lon
                            );
                        }
                        // if (distance < 100000) {
                        let stageOfControl : string;
                        //Possible values for stage of control include: OC (Out of Control), BH (Being Held), UC (Under Control), EX (Out).
                        switch (fire.stage_of_control) {
                            case "OC":
                                stageOfControl = "Out of Control";
                                break;
                            case "BH":
                                stageOfControl = "Being Held";
                                break;
                            case "UC":
                                stageOfControl = "Under Control";
                                break;
                            case "EX":
                                stageOfControl = "Out";
                                break;
                            default:
                                stageOfControl = "Unknown";
                        }

                        var marker = L.marker([fire.lat, fire.lon])
                            .bindPopup(
                                `<h4>Wild Fire ${fire.firename}</h4>
                                ${ typeof(distance) === 'number' ? `<p>${Math.round(distance / 1000)} km your reported location.</p>` : "" }
                                <p>Started on ${fire.startdate}<br>
                                ${fire.agency.toUpperCase()} is in charge<br>
                                ${fire.hectares} hectares burned<br>
                                Stage of control: ${stageOfControl}</p>`
                            )
                            .addTo(map.getMap());
                        // alert(
                        //     `You are within ${distance} meters of ${fire.firename}!`
                        // );
                        // }
                    });
                };
            });
    });

    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    // const tileUrl = darkMode ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    const tileLayerOptions: L.TileLayerOptions = {
        minZoom: 0,
        maxZoom: 20,
        maxNativeZoom: 19,
        attribution: "© OpenStreetMap contributors",
    };
    // const wmsTileUrl =
    //     "http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi";
    // const wmsTileLayerOptions: L.TileLayerOptions = {
    //     layers: "nexrad-n0r-900913",
    //     format: "image/png",
    //     transparent: true,
    //     attribution: "Weather data © 2012 IEM Nexrad",
    // };

    const wmsFireTileUrl =
        "https://cwfis.cfs.nrcan.gc.ca/geoserver/public/wms?";
    const wmsFireTileLayerOptions: L.TileLayerOptions = {
        layers: "m3_polygons_current,activefires_current",
        format: "image/png",
        transparent: true,
        legend: "true",
        tms: true,
        attribution:
            "Canadian Forest Service. 2022. Canadian Wildland Fire Information System (CWFIS), Natural Resources Canada, Canadian Forest Service, Northern Forestry Centre, Edmonton, Alberta. http://cwfis.cfs.nrcan.gc.ca.",
    };

    let tileLayer: L.TileLayer;
    // let wmsTileLayer: L.TileLayer.WMS;
    let wmsFireTileLayer: L.TileLayer.WMS;

    function onLocationFound(event) {
		map.getMap().setView([event.detail.lat, event.detail.lon], 8);
	}
</script>

<Locator on:locationFound={onLocationFound} />

<div class="map">
    <LeafletMap bind:this={map} options={mapOptions}>
        <TileLayer
            bind:this={tileLayer}
            url={tileUrl}
            options={tileLayerOptions}
        />
        <!-- <TileLayer
            bind:this={wmsTileLayer}
            wms={true}
            url={wmsTileUrl}
            options={wmsTileLayerOptions}
        /> -->
        <TileLayer
            bind:this={wmsFireTileLayer}
            wms={true}
            url={wmsFireTileUrl}
            options={wmsFireTileLayerOptions}
        />
    </LeafletMap>
</div>

<style>
    .map {
        width: calc(100% - 2rem);
        margin-top: 1rem;
        padding: 1rem;
        height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 3rem);
    }
</style>
