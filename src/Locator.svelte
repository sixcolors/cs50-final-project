<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Location from "./Location.svelte";

    const dispatch = createEventDispatcher();

    /* FILTERING location DATA BASED ON INPUT */
    let filteredLocations: string[] = [];
    let hiLiteIndex: number | null = null;

    const filterLocations = (): void => {
        console.log("Searching for locations..." + searchInput.value);
        fetch(
            `https://geogratis.gc.ca/services/geolocation/en/autocomplete?q=${encodeURIComponent(
                searchInput.value
            )}`
        )
            .then((response) => response.json())
            .then((data) => {
                filteredLocations = data.suggestions;
            })
            .catch((error) => console.log(error));
    };

    /* HANDLING THE INPUT */
    let searchInput: HTMLInputElement;
    let inputValue = "";

    $: if (!inputValue) {
        filteredLocations = [];
        hiLiteIndex = null;
    }

    const clearInput = (): void => {
        inputValue = "";
        searchInput.focus();
    };

    const setInputVal = (locationName: string): void => {
        inputValue = removeBold(locationName);
        filteredLocations = [];
        hiLiteIndex = null;
        document.querySelector("#location-input").focus();
    };

    const submitValue = (): void => {
        if (inputValue) {
            console.log(`${inputValue} is submitted!`);
            fetch(
                `https://geogratis.gc.ca/services/geolocation/en/locate?q=${encodeURIComponent(
                    inputValue
                )}`
            )
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    let locationType: string;
                    let locationQualifier: string;
                    const postalCodeRegex = new RegExp(/^[A-Za-z]\d[A-Za-z]$/);
                    if (postalCodeRegex.test(inputValue)) {
                        locationType =
                            "ca.gc.nrcan.geoloc.data.model.PostalCode";
                        locationQualifier = "INTERPOLATED_CENTROID";
                    } else {
                        locationType = "ca.gc.nrcan.geoloc.data.model.Geoname";
                        locationQualifier = "LOCATION";
                    }
                    data = data.filter(
                        (location) =>
                            location.type === locationType &&
                            location.qualifier === locationQualifier
                    );
                    console.log(data);
                    if (data.length > 0) {
                        let geometry = data[0].geometry;
                        if (geometry.type === "Point") {
                            let lat = geometry.coordinates[1];
                            let lon = geometry.coordinates[0];
                            let placeName = data[0].title;
                            onLocationFound(lat, lon, placeName);
                        }
                    } else {
                        alert("No such location found.");
                    }
                })
                .catch((error) => console.log(error));
            setTimeout(clearInput, 1000);
        } else {
            alert("You didn't type anything.");
        }
    };

    const makeMatchBold = (str: string): string => {
        let matched = str.substring(0, inputValue.length);
        let makeBold = `<strong>${matched}</strong>`;
        let boldedMatch = str.replace(matched, makeBold);
        return boldedMatch;
    };

    const removeBold = (str: string): string => {
        return str.replace(/<(.)*?>/g, "");
    };

    /* NAVIGATING OVER THE LIST OF LOCATIONS W HIGHLIGHTING */
    let hiLitedLocation: string;
    const navigateList = (e: KeyboardEvent): void => {
        if (
            e.key === "ArrowDown" &&
            hiLiteIndex! <= filteredLocations.length - 1
        ) {
            hiLiteIndex = hiLiteIndex === null ? 0 : hiLiteIndex + 1;
        } else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
            hiLiteIndex =
                hiLiteIndex === 0
                    ? filteredLocations.length - 1
                    : hiLiteIndex - 1;
        } else if (e.key === "Enter") {
            setInputVal(filteredLocations[hiLiteIndex!]);
        } else {
            return;
        }
    };

    const onLocationFound = function (
        lat: number,
        lon: number,
        placeName: string
    ): void {
        const data = { lat, lon, placeName };
        dispatch("locationFound", data); // dispatching event to parent component
    };
</script>

<svelte:window on:keydown={navigateList} />

<form autocomplete="off" on:submit|preventDefault={submitValue}>
    <div class="autocomplete">
        <input
            id="location-input"
            type="text"
            placeholder="Search Location"
            bind:this={searchInput}
            bind:value={inputValue}
            on:input={filterLocations}
        />

        <!-- FILTERED LIST OF LOCATIONS -->
        {#if filteredLocations.length > 0}
            <ul id="autocomplete-items-list">
                {#each filteredLocations as location, i}
                    <Location
                        itemLabel={location}
                        highlighted={i === hiLiteIndex}
                        on:click={() => setInputVal(location)}
                    />
                {/each}
            </ul>
        {/if}
    </div>

    <input type="submit" />
</form>

<style>
    div.autocomplete {
        /*the container must be positioned relative:*/
        position: relative;
        display: inline-block;
        width: 300px;
    }

    input {
        border: 1px solid transparent;
        background-color: #f1f1f1;
        padding: 10px;
        font-size: 16px;
        margin: 0;
    }

    input[type="text"] {
        background-color: #f1f1f1;
        width: 100%;
    }

    input[type="submit"] {
        background-color: DodgerBlue;
        color: #fff;
    }

    #autocomplete-items-list {
        position: absolute;
        margin: 0;
        padding: 0;
        z-index: 999999;
        width: 297px;
        border: 1px solid #ddd;
        background-color: #ddd;
    }

    @media (prefers-color-scheme: dark) {
        input {
            background-color: #333;
            color: #fff;
        }

        input[type="text"] {
            background-color: #333;
        }

        #autocomplete-items-list {
            border: 1px solid #fff;
            background-color: #333;
        }
    }
</style>
