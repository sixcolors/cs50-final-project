<script lang="ts">
  export let url: string | undefined = undefined;
  export let options: unknown;
  export let wms = false;
</script>

<div data-testid="tile-layer" data-url={url} data-wms={wms} data-options={JSON.stringify(options ?? {})}></div>
