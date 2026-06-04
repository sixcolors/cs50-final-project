<script lang="ts">
    // @ts-ignore
    import { LeafletMap, TileLayer } from "svelte-leafletjs";
    // @ts-ignore
    import { onMount } from "svelte";
    import { calculateDistance } from "./utils";
    import Locator from "./Locator.svelte";
    import "leaflet/dist/leaflet.css";
    // @ts-ignore
    import L from "leaflet";

    // Globals
    let userLocation: number[] | undefined;
    let fires: Fire[] = [];
    let userLocationCircleLayer: L.Circle | undefined;
    let userLocationPlaceName: string;
    let firesNearYou = -1;

    interface Fire {
        agency_code: string;
        agency_fire_id: string;
        latitude: number;
        longitude: number;
        situation_report_date: string;
        fire_size: number;
        stage_of_control_status: string;
        [key: string]: any;
    }

    let map: L.Map;
    let mapOptions: L.MapOptions = {
        center: [60, -95],
        zoom: 4,
    };

    let fireMarkerLayerGroup: L.LayerGroup;

    function escapeHtml(str: string): string {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

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
                    fire.latitude,
                    fire.longitude
                );
            }
            let stageOfControl: string;
            // Possible values for stage of control include: OC (Out of Control), BH (Being Held), UC (Under Control), EX (Out).
            switch (fire.stage_of_control_status) {
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

            L.marker([fire.latitude, fire.longitude])
                .bindPopup(
                    `<h4>Wildfire ${escapeHtml(fire.agency_fire_id)}</h4>
          ${
              typeof distance === "number"
                  ? `<p>${Math.round(
                        distance / 1000
                    )} km from ${escapeHtml(userLocationPlaceName)}.</p>`
                  : ""
          }
          ${ fire.situation_report_date ? `<p>Last reported: ${escapeHtml(fire.situation_report_date)}<br>` : '<p>No report date available<br>' }
          ${escapeHtml(String(fire.agency_code ?? '').toUpperCase())} is in charge<br>
          ${escapeHtml(String(fire.fire_size ?? ''))} hectares burned<br>
          Stage of control: ${escapeHtml(stageOfControl)}</p>`
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
        const mapLegend: L.LegendControl = L.control
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
            "https://geoserver.cwfif.nrcan.gc.ca/geoserver/wfs?service=WFS&version=2.0.1&request=GetFeature&outputFormat=application%2Fjson&typeNames=public:cwfif_national_activefires&sortBy=agency_code+A,record_start+D&CQL_FILTER=now()%3E=record_start%20AND%20now()%3C=record_end%20AND%20fire_was_prescribed%3C1"
        )
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then((data: any) => {
                // parse GeoJSON FeatureCollection from WFS
                // fall back to geometry.coordinates ([lon, lat]) if properties lack valid lat/lon
                fires = (data.features ?? [])
                    .map((feature: any) => {
                        const props = feature.properties as Fire;
                        const coords = feature.geometry?.coordinates;
                        return {
                            ...props,
                            latitude: Number.isFinite(Number(props.latitude)) ? Number(props.latitude) : (Array.isArray(coords) ? Number(coords[1]) : NaN),
                            longitude: Number.isFinite(Number(props.longitude)) ? Number(props.longitude) : (Array.isArray(coords) ? Number(coords[0]) : NaN),
                        };
                    })
                    .filter((fire: Fire) => isFinite(fire.latitude) && isFinite(fire.longitude));

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
            })
            .catch((err) => {
                console.error("Failed to load wildfire data:", err);
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

    function onLocationFound(event: { detail: { lat: number; lon: number; placeName: string; }; }) {
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