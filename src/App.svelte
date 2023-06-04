<script lang="ts">
	import Map from "./Map.svelte";
</script>

<main>
	<header>
		<h1>Canadian Wildfire Map</h1>
	</header>
	<section>
		<h2>Stay Updated on Wildfires Across Canada</h2>
		<p>
			The Canadian Wildfire Map is an interactive web app that provides
			users with up-to-date information on wildfires across the country.
			With point icons for Active Wildfires and Fire Perimeter Estimate
			Polygons indicating the affected areas, users can quickly see where
			wildfires are currently burning and how they are spreading.
		</p>
		<h2>Search for Locations and Access Detailed Information</h2>
		<p>
			Users can search for a location by entering a city name or postal
			code in the search bar. The map will then zoom to that location,
			allowing users to see if any wildfires are burning nearby. By
			clicking on a fire icon, users can access more detailed information
			about that specific wildfire, including its size, location, and
			status.
		</p>
		<h2>Stay Informed About Fire Danger Ratings</h2>
		<p>
			In addition to wildfire information, the Canadian Wildfire Map also
			provides users with Current Fire Danger Polygons, which indicate the
			current fire danger rating for each region. Fire Danger is a
			relative index of how easy it is to ignite vegetation, how difficult
			a fire may be to control, and how much damage a fire may do. Turn
			on this layer under the layers control in the top right of the map.
			By staying informed about fire danger ratings, users can take steps
			to protect themselves and their communities from wildfires.
		</p>
		<div class="legend">
			<h3>Fire Danger Ratings:</h3>
			<div class="legend-item">
				<div class="legend-color legend-color-low" />
				<div class="legend-label">Low</div>
			</div>
			<div class="legend-item">
				<div class="legend-color legend-color-moderate" />
				<div class="legend-label">Moderate</div>
			</div>
			<div class="legend-item">
				<div class="legend-color legend-color-high" />
				<div class="legend-label">High</div>
			</div>
			<div class="legend-item">
				<div class="legend-color legend-color-very-high" />
				<div class="legend-label">Very High</div>
			</div>
			<div class="legend-item">
				<div class="legend-color legend-color-extreme" />
				<div class="legend-label">Extreme</div>
			</div>
		</div>
		<h2>Get Involved in Wildfire Prevention Efforts</h2>
		<p>
			The Canadian Wildfire Map is not just a tool for staying informed
			about wildfires - it is also a platform for getting involved in
			wildfire prevention efforts. Here are some ways you can become
			involved:
		</p>
		<ol>
			<li>
				Spread Awareness: Share the Canadian Wildfire Map with your
				friends, family, and community to raise awareness about the
				severity of wildfires in Canada and the importance of
				prevention.
			</li>
			<li>
				Follow Safety Guidelines: Familiarize yourself with and adhere
				to local fire safety guidelines and regulations to reduce the
				risk of wildfires in your area.
			</li>
			<li>
				Report Suspicious Activity: If you notice any suspicious or
				potentially dangerous activities that could lead to wildfires,
				report them to the appropriate authorities.
			</li>
			<li>
				Support Local Fire Departments: Donate to or volunteer with
				local fire departments and organizations that work towards
				wildfire prevention, preparedness, and response efforts.
			</li>
			<li>
				Join Community Programs: Participate in community programs
				focused on wildfire prevention and education, such as firewise
				initiatives or fire prevention workshops.
			</li>
		</ol>
		<p>
			By actively participating in these efforts, you can help prevent
			wildfires and protect your community and the natural environment
			from the devastating impacts of uncontrolled fires.
		</p>
		<h2>Try the Canadian Wildfire Map Today</h2>
		<p>
			Whether you are a concerned citizen, a firefighter, or a government
			official, the Canadian Wildfire Map is an essential tool for staying
			informed about wildfires across the country. Try it today and see
			how it can help you stay safe and informed.
		</p>
		<h2>Learn More</h2>
		<p>
			Visit our <a href="https://github.com/sixcolors/cs50-final-project"
				>GitHub repository</a
			> to learn more about the Canadian Wildfire Map and how it was created.
		</p>
	</section>
	<Map />
</main>

<footer>
	<p>
		This service is provided as is, without warranty of any kind. The
		accuracy of data on this website is not guaranteed.
	</p>
	<p>
		For official Canadian Wildland Fire Information System (CWFIS)
		information, please visit <a href="https://cwfis.cfs.nrcan.gc.ca/"
			>https://cwfis.cfs.nrcan.gc.ca/</a
		>.
	</p>
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

	section {
		text-align: left;
		margin: 2em 0;
		color: #444;
	}

	footer {
		text-align: center;
		margin-top: 2em;
		color: #888;
		font-size: 0.8em;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 1rem;
	}

	.legend h3 {
		margin-right: 1rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		margin-right: 1rem;
	}

	.legend-color {
		width: 1rem;
		height: 1rem;
		margin-right: 0.5rem;
	}

	.legend-color-low {
		background-color: #5a58f7;
	}

	.legend-color-moderate {
		background-color: #a5fc8b;
	}

	.legend-color-high {
		background-color: #fffe92;
	}

	.legend-color-very-high {
		background-color: #d9be79;
	}

	.legend-color-extreme {
		background-color: #f07a70;
	}

	.legend-label {
		font-size: 0.8rem;
	}

	@media (prefers-color-scheme: dark) {
		main {
			background-color: #222;
			color: #fff;
		}

		h1 {
			color: #ff3e00;
		}

		section {
			color: #ccc;
		}

		footer {
			color: #aaa;
		}
	}
</style>
