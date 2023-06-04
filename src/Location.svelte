<script lang="ts">
    import { onMount } from "svelte";

    export let itemLabel: string;
    export let highlighted: boolean;

    onMount(() => {
        const handleClick = () => {
            // Handle click event here
        };

        const liElement = document.querySelector(".autocomplete-items");
        liElement.addEventListener("click", handleClick);

        return () => {
            liElement.removeEventListener("click", handleClick);
        };
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<li class="autocomplete-items" class:autocomplete-active={highlighted} on:click>
    {@html itemLabel}
</li>

<style>
    li.autocomplete-items {
        list-style: none;
        border-bottom: 1px solid #d4d4d4;
        z-index: 99;
        /*position the autocomplete items to be the same width as the container:*/
        top: 100%;
        left: 0;
        right: 0;
        padding: 10px;
        cursor: pointer;
        background-color: #fff;
    }

    li.autocomplete-items:hover {
        /*when hovering an item:*/
        background-color: #81921f;
        color: white;
    }

    li.autocomplete-items:active {
        /*when navigating through the items using the arrow keys:*/
        background-color: DodgerBlue !important;
        color: #ffffff;
    }

    .autocomplete-active {
        /*when navigating through the items using the arrow keys:*/
        background-color: DodgerBlue !important;
        color: #ffffff;
    }

    @media (prefers-color-scheme: dark) {
        li.autocomplete-items {
            background-color: #333;
            color: #fff;
        }

        li.autocomplete-items:hover {
            /*when hovering an item:*/
            background-color: #81921f;
            color: white;
        }

        li.autocomplete-items:active {
            /*when navigating through the items using the arrow keys:*/
            background-color: DodgerBlue !important;
            color: #ffffff;
        }

        .autocomplete-active {
            /*when navigating through the items using the arrow keys:*/
            background-color: DodgerBlue !important;
            color: #ffffff;
        }
    }
</style>
