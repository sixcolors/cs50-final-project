import { render, cleanup } from '@testing-library/svelte';
import { describe, expect, it, afterEach, vi } from 'vitest';
import App from '../src/App.svelte';
import type { SvelteComponent } from 'svelte';

vi.mock('leaflet', () => {
  const createLayer = () => ({
    addTo: vi.fn().mockReturnThis(),
    bindPopup: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    removeFrom: vi.fn().mockReturnThis(),
    on: vi.fn(),
    off: vi.fn(),
  });

  const tileLayer = Object.assign(
    vi.fn(() => createLayer()),
    { wms: vi.fn(() => createLayer()) }
  );

  const map = {
    setView: vi.fn(),
    remove: vi.fn(),
  };

  return {
    default: {
      map: vi.fn(() => map),
      tileLayer,
      layerGroup: vi.fn(() => ({
        addTo: vi.fn().mockReturnThis(),
        clearLayers: vi.fn(),
      })),
      circle: vi.fn(() => createLayer()),
      marker: vi.fn(() => createLayer()),
      control: {
        layers: vi.fn(() => ({
          addTo: vi.fn().mockReturnThis(),
        })),
      },
    },
  };
});

describe('App.svelte', () => {
  // TODO: @testing-library/svelte claims to add this automatically but it doesn't work without explicit afterEach
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('should render the component correctly', () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network disabled in test'))));

    const { container } = render(App as unknown as new () => SvelteComponent, { target: document.body });
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain('Canadian Wildfire Map');
    expect(container.innerHTML).toMatchSnapshot();
  });
});