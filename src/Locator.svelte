<script>
    import Location from "./Location.svelte";
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()


    /* FILTERING countres DATA BASED ON INPUT */	
    let filteredLocations = [];
    // $: console.log(filteredLocations)	
    
    const filterLocations = () => {
        // fetch suggestions from countries https://geogratis.gc.ca/services/geolocation/fr/autocomplete?q=location
        console.log("Searching for locations..." + searchInput.value)
        fetch(`https://geogratis.gc.ca/services/geolocation/en/autocomplete?q=${encodeURIComponent(searchInput.value)}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                filteredLocations = data.suggestions;
            })
            .catch(error => console.log(error))
        // let storageArr = []
        // if (inputValue) {
        //     locations.forEach(location => {
        //          if (location.toLowerCase().startsWith(inputValue.toLowerCase())) {
        //              storageArr = [...storageArr, makeMatchBold(inputValue)];
        //          }
        //     });
        // }
        // filteredLocations = storageArr;
    }	
    
    
    /* HANDLING THE INPUT */
    let searchInput; // use with bind:this to focus element
    let inputValue = "";
        
    $: if (!inputValue) {
        filteredLocations = [];
        hiLiteIndex = null;
    }
    
    const clearInput = () => {
        inputValue = "";	
        searchInput.focus();
    }
        
    const setInputVal = (locationName) => {
        inputValue = removeBold(locationName);
        filteredLocations = [];
        hiLiteIndex = null;
        document.querySelector('#location-input').focus();
    }	
    
    const submitValue = () => {
        if (inputValue) {
            console.log(`${inputValue} is submitted!`);
            fetch(`https://geogratis.gc.ca/services/geolocation/en/locate?q=${encodeURIComponent(inputValue)}`)
            .then(response => response.json())
            .then(data => {
                data = data.filter(location => location.type === 'ca.gc.nrcan.geoloc.data.model.Geoname' && location.qualifier === 'LOCATION')
                console.log(data)
                if (data.length > 0) {
                    let geometry = data[0].geometry;
                    if (geometry.type === 'Point') {
                        let lat = geometry.coordinates[1];
                        let lon = geometry.coordinates[0];
                        onLocationFound(lat, lon);
                    }
                } else {
                    alert("No such location found.")
                }
            }).catch(error => console.log(error))
            setTimeout(clearInput, 1000);
        } else {
            alert("You didn't type anything.")
        }
    }
    
    const makeMatchBold = (str) => {
        // replace part of (location name === inputValue) with strong tags
        let matched = str.substring(0, inputValue.length);
        let makeBold = `<strong>${matched}</strong>`;
        let boldedMatch = str.replace(matched, makeBold);
        return boldedMatch;
    }
    
    const removeBold = (str) => {
        //replace < and > all characters between
        return str.replace(/<(.)*?>/g, "");
        // return str.replace(/<(strong)>/g, "").replace(/<\/(strong)>/g, "");
    }	
        
    
    /* NAVIGATING OVER THE LIST OF COUNTRIES W HIGHLIGHTING */	
    let hiLiteIndex = null;
    //$: console.log(hiLiteIndex);	
    $: hiLitedLocation = filteredLocations[hiLiteIndex]; 	
        
    const navigateList = (e) => {
        if (e.key === "ArrowDown" && hiLiteIndex <= filteredLocations.length-1) {
            hiLiteIndex === null ? hiLiteIndex = 0 : hiLiteIndex += 1
        } else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
            hiLiteIndex === 0 ? hiLiteIndex = filteredLocations.length-1 : hiLiteIndex -= 1
        } else if (e.key === "Enter") {
            setInputVal(filteredLocations[hiLiteIndex]);
        } else {
            return;
        }
    } 

    const onLocationFound = function(lat, lon) {
        const data = {lat, lon}
        dispatch('locationFound', data); // dispatching event to parent component
    }
    </script>
    
    
    <svelte:window on:keydown={navigateList} />
    
    <form autocomplete="off" on:submit|preventDefault={submitValue}>
      <div class="autocomplete">
        <input id="location-input" 
                         type="text" 
                         placeholder="Search Location" 
                         bind:this={searchInput}
                         bind:value={inputValue} 
                         on:input={filterLocations}>
        
        <!-- FILTERED LIST OF COUNTRIES -->
        {#if filteredLocations.length > 0}
        <ul id="autocomplete-items-list">
            {#each filteredLocations as location, i}
                <Location itemLabel={location} highlighted={i === hiLiteIndex} on:click={() => setInputVal(location)} />
            {/each}			
        </ul>
    {/if}
      </div>
        
      <input type="submit">
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
    input[type=text] {
      background-color: #f1f1f1;
      width: 100%;
    }
    input[type=submit] {
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
        input[type=text] {
            background-color: #333;
        }
        #autocomplete-items-list {
            border: 1px solid #fff;
            background-color: #333;
        }
    }
    </style>	