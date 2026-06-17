<script lang="ts">
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";
    import Location from "./Location.svelte";

    const dispatch = createEventDispatcher();

    // Used to disable submit button while fetching data
    let isFetching = false;

    /* FILTERING location DATA BASED ON INPUT */
    let filteredLocations: string[] = [];
    let hiLiteIndex: number | null = null;

    export const filterLocations = (): void => {
        if (!searchInput.value.trim()) {
            filteredLocations = [];
            hiLiteIndex = null;
            return;
        }
        fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                searchInput.value
            )}&format=json&countrycodes=ca&limit=5`
        )
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then((data) => {
                filteredLocations = Array.isArray(data) ? data.map((item: any) => item.display_name) : [];
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
        const locationInput = document.querySelector("#location-input") as HTMLInputElement;
        locationInput.focus();
        // Automatically submit the form when user selects a location
        submitValue();
    };

    const submitValue = async (): Promise<void> => {
        if (inputValue) {
            isFetching = true;
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                        inputValue
                    )}&format=json&countrycodes=ca&limit=1`
                );
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    if (!isFinite(lat) || !isFinite(lon)) {
                        alert("No such location found.");
                        return;
                    }
                    const placeName = data[0].display_name;
                    onLocationFound(lat, lon, placeName);
                } else {
                    alert("No such location found.");
                }
            } catch (error) {
                console.log(error);
            } finally {
                isFetching = false;
            }
            setTimeout(clearInput, 1000);
        } else {
            alert("You didn't type anything.");
        }
    };

    const removeBold = (str: string): string => {
        return str.replace(/<(.)*?>/g, "");
    };

    /* NAVIGATING OVER THE LIST OF LOCATIONS W HIGHLIGHTING */
    const navigateList = (e: KeyboardEvent): void => {
        if (
            e.key === "ArrowDown" &&
            hiLiteIndex! <= filteredLocations.length - 1
        ) {
            hiLiteIndex = hiLiteIndex === null ? 0 : hiLiteIndex + 1;
        } else if (e.key === "ArrowUp" && hiLiteIndex !== 0) {
            hiLiteIndex =
                hiLiteIndex === null
                    ? filteredLocations.length - 1
                    : hiLiteIndex - 1;
        } else if (e.key === "Enter") {
            if (hiLiteIndex !== null) {
                setInputVal(filteredLocations[hiLiteIndex]);
            } else {
                return;
            }
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

    $: isSubmitDisabled = inputValue.length < 1 || isFetching; // calculate submit button disabled status
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
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
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

    <input type="submit" value="Submit" disabled={isSubmitDisabled} />
</form>

<style>
    div.autocomplete {
        /*the container must be positioned relative:*/
        position: relative;
        display: inline-block;
        max-width: 300px;
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

    input[type="submit"]:disabled {
        background-color: #ccc;
        color: #666;
    }

    #autocomplete-items-list {
        position: absolute;
        margin: 0;
        padding: 0;
        z-index: 999999;
        width: 100%;
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
