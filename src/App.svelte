<script lang="ts">
	import Map from './Map.svelte';
</script>

<main>
	<h1>Canadian Wild Fire Map</h1>
	<Map />
</main>

<footer>
	<p>This service is provided as is, without warranty of any kind. The accuracy of data on this website is not guaranteed.</p>
	<p>For official Canadian Wildland Fire Information System (CWFIS) information, please visit <a href="https://cwfis.cfs.nrcan.gc.ca/">https://cwfis.cfs.nrcan.gc.ca/</a>.</p>
</footer>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 1080px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		font-size: 4em;
		font-weight: 100;
	}

	footer {
		text-align: center;
		margin-top: 2em;
		color: #888;
		font-size: 0.8em;
	}

	
	@media (prefers-color-scheme: dark) {
		main {
			background-color: #222;
			color: #fff;
		}

		h1 {
			color: #ff3e00;
		}

		footer {
			color: #aaa;
		}
	}
</style>