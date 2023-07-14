<script lang="ts">
    import { LeafletMap, TileLayer } from "svelte-leafletjs";
    import { onMount } from "svelte";
    import { calculateDistance } from "./utils";
    import Locator from "./Locator.svelte";
    import "leaflet/dist/leaflet.css";
    import L from "leaflet";

    // Globals
    let userLocation: number[] | undefined;
    let fires: Fire[] = [];
    let userLocationCircleLayer: L.Circle | undefined;
    let userLocationPlaceName: string;
    let firesNearYou = -1;

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

    let fireMarkerLayerGroup: L.LayerGroup;

    // addMarkers adds markers to the fireMarkerLayerGroup
    // old markers are cleared first
    function addMarkers(fires: Fire[]) {
        firesNearYou = userLocation !== undefined ? 0 : -1;
        fireMarkerLayerGroup.clearLayers();

        // add markers
        fires.forEach((fire) => {
            let distance: number | undefined;
            if (userLocation !== undefined) {
                distance = calculateDistance(
                    userLocation[0],
                    userLocation[1],
                    fire.lat,
                    fire.lon
                );
            }
            let stageOfControl: string;
            // Possible values for stage of control include: OC (Out of Control), BH (Being Held), UC (Under Control), EX (Out).
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

            L.marker([fire.lat, fire.lon])
                .bindPopup(
                    `<h4>Wildfire ${fire.firename}</h4>
          ${
              typeof distance === "number"
                  ? `<p>${Math.round(
                        distance / 1000
                    )} km from ${userLocationPlaceName}.</p>`
                  : ""
          }
          <p>Started on ${fire.startdate}<br>
          ${fire.agency.toUpperCase()} is in charge<br>
          ${fire.hectares} hectares burned<br>
          Stage of control: ${stageOfControl}</p>`
                )
                .addTo(fireMarkerLayerGroup);
            if (typeof distance === "number" && distance < 100000) {
                firesNearYou++;
            }
        });
        lastRefreshed = new Date();
    };

    // Called when svelte component is mounted
    onMount(() => {
        // add layer that is not shown by default
        const wmsFireDangerTileLayerOptions: L.TileLayerOptions = {
            layers: "fdr_current",
            format: "image/png",
            transparent: true,
            opacity: 0.6,
            legend: "true",
            tms: true,
            attribution:
                "Canadian Forest Service. 2022. Canadian Wildland Fire Information System (CWFIS), Natural Resources Canada, Canadian Forest Service, Northern Forestry Centre, Edmonton, Alberta. https://cwfis.cfs.nrcan.gc.ca.",
        };
        const wmsFireDangerTileLayer: L.TileLayer.WMS = L.tileLayer.wms(
            wmsFireTileUrl,
            wmsFireDangerTileLayerOptions
        );

        // add layer control
        const mapLegend: L.LegengControl = L.control
            .layers(
                {},
                {
                    "Fire Danger": wmsFireDangerTileLayer,
                },
                {
                    position: "topright",
                }
            )
            .addTo(map.getMap());

        fireMarkerLayerGroup = L.layerGroup().addTo(map.getMap());

        // download wildfire data
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
                fires = rows
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
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        mapOptions.center = [
                            position.coords.latitude,
                            position.coords.longitude,
                        ];
                        mapOptions.zoom = 8;
                        mapOptions = { ...mapOptions };

                        map.getMap().setView(
                            mapOptions.center,
                            mapOptions.zoom
                        );

                        userLocation = [
                            position.coords.latitude,
                            position.coords.longitude,
                        ];

                        userLocationPlaceName = "your reported location";

                        if (userLocationCircleLayer !== undefined) {
                            userLocationCircleLayer.remove();
                        }

                        userLocationCircleLayer = L.circle(userLocation, {
                            color: "white",
                            fillColor: "#ddd",
                            fillOpacity: 0.5,
                            radius: 10000,
                        }).addTo(map.getMap());

                        addMarkers(fires);
                    },
                    (error) => {
                        // we don't have permission to get location
                        // or location services are turned off, etc
                        console.log(error);
                        addMarkers(fires);
                    }
                );
            });
    });

    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const tileLayerOptions: L.TileLayerOptions = {
        minZoom: 0,
        maxZoom: 20,
        maxNativeZoom: 19,
        attribution: "© OpenStreetMap contributors",
    };

    const wmsFireTileUrl =
        "https://cwfis.cfs.nrcan.gc.ca/geoserver/public/wms?";
    const wmsFireTileLayerOptions: L.TileLayerOptions = {
        layers: "m3_polygons_current,activefires_current",
        format: "image/png",
        transparent: true,
        legend: "true",
        tms: true,
        attribution:
            "Canadian Forest Service. 2022. Canadian Wildland Fire Information System (CWFIS), Natural Resources Canada, Canadian Forest Service, Northern Forestry Centre, Edmonton, Alberta. https://cwfis.cfs.nrcan.gc.ca.",
    };

    let tileLayer: L.TileLayer;
    let wmsFireTileLayer: L.TileLayer.WMS;

    function onLocationFound(event) {
        if (userLocationCircleLayer !== undefined) {
            userLocationCircleLayer.remove();
        }

        userLocation = [event.detail.lat, event.detail.lon];
        userLocationPlaceName = event.detail.placeName;

        addMarkers(fires);

        userLocationCircleLayer = L.circle(userLocation, {
            color: "white",
            fillColor: "#ddd",
            fillOpacity: 0.5,
            radius: 10000,
        }).addTo(map.getMap());
        map.getMap().setView(userLocation, 8);
    }

    let lastRefreshed: Date | null = null;
</script>

<Locator on:locationFound={onLocationFound} />

{#if firesNearYou > 0}
    <div class="fires-near-you">
        There are {firesNearYou} wildfires within 100km of {userLocationPlaceName}.
    </div>
{:else if firesNearYou === 0}
    <div class="no-fires-near-you">
        There are no wildfires within 100km of {userLocationPlaceName}.
    </div>
{/if}

<div class="map">
    <LeafletMap bind:this={map} options={mapOptions}>
        <TileLayer
            bind:this={tileLayer}
            url={tileUrl}
            options={tileLayerOptions}
        />
        <TileLayer
            bind:this={wmsFireTileLayer}
            wms={true}
            url={wmsFireTileUrl}
            options={wmsFireTileLayerOptions}
        />
    </LeafletMap>
</div>

{#if lastRefreshed !== null}
    <div class="last-refreshed">
        Last refreshed: {lastRefreshed.toLocaleString()}
    </div>
{/if}

<style>
    .map {
        margin-top: 1rem;
        padding: 1rem 0;
        height: calc(
            100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) -
                8rem
        );
    }

    .fires-near-you {
        padding: 1rem;
        margin: 1rem 0 -2rem 0;
        border: 1px solid #ffcc00; /* yellow warning color */
        border-radius: 0.5rem 0.5rem 0 0;
    }

    .no-fires-near-you {
        padding: 1rem;
        margin: 1rem 0 -2rem 0;
        border: 1px solid #ccc;
        border-radius: 0.5rem 0.5rem 0 0;
    }

    .last-refreshed {
        padding: 1rem;
        margin: -1rem 0 1rem 0;
        border: 1px solid #ccc;
        border-radius: 0 0 0.5rem 0.5rem;
    }
</style>
