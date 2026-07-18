<script lang="ts">
  export let options: unknown;

  const mapApi = {
    setView: () => undefined,
    remove: () => undefined,
  };

  export function getMap() {
    return mapApi;
  }
</script>

<div data-testid="leaflet-map" data-options={JSON.stringify(options ?? {})}>
  <slot />
</div>
