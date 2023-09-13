<script lang="ts">
    import { onMount } from "svelte";

    export let itemLabel: string;
    export let highlighted: boolean;

    onMount(() => {
        const handleClick = () => {
            const liElement = document.querySelector(".autocomplete-items");
            if (liElement) {
                liElement.setAttribute("aria-selected", "true");
            }

            const liElements = document.querySelectorAll(".autocomplete-items");
            liElements.forEach((li) => {
                if (li !== liElement) {
                    li.setAttribute("aria-selected", "false");
                }
            });
        };

        const liElement = document.querySelector(".autocomplete-items");
        if (liElement) {
            liElement.addEventListener("click", handleClick);
        }

        return () => {
            return liElement;
        };
    });
</script>

<li class="autocomplete-items" class:autocomplete-active={highlighted} on:click role="option" on:keydown aria-selected="false">
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
