import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { describe, expect, it, afterEach, vi } from 'vitest';
import type { SvelteComponent } from 'svelte';

vi.mock('leaflet', () => {
  const createLayer = () => ({
    addTo: vi.fn().mockReturnThis(),
    bindPopup: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    removeFrom: vi.fn().mockReturnThis(),
    setUrl: vi.fn(),
    setOpacity: vi.fn(),
    setZIndex: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  });

  function Marker(this: unknown) {}
  Marker.prototype._initIcon = vi.fn();
  Marker.prototype._setPos = vi.fn();
  Marker.addInitHook = vi.fn();
  Marker.include = vi.fn();

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
      Marker,
      DomUtil: {
        TRANSFORM: 'transform',
      },
      control: {
        layers: vi.fn(() => ({
          addTo: vi.fn().mockReturnThis(),
        })),
      },
    },
  };
});

import Map from '../src/Map.svelte';

describe('Map.svelte', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('renders the locator and map shell', () => {
    const { container } = render(Map as unknown as new () => SvelteComponent, { target: document.body });
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain('Search Location');
  });

  it('loads wildfire data and handles a location search', async () => {
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();

      if (url.includes('geoserver/wfs')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            features: [{
              properties: {
                agency_code: 'onf',
                agency_fire_id: 'abc123',
                latitude: '43.6532',
                longitude: '-79.3832',
                situation_report_date: '2026-06-16',
                fire_size: 12,
                stage_of_control_status: 'OC',
              },
              geometry: { coordinates: [-79.3832, 43.6532] },
            }],
          }),
        });
      }

      if (url.includes('nominatim.openstreetmap.org/search')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve([
            {
              display_name: 'Toronto, Ontario, Canada',
              lat: '43.6532',
              lon: '-79.3832',
            },
          ]),
        });
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    }));

    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: vi.fn((success) => {
          success({
            coords: {
              latitude: 43.6532,
              longitude: -79.3832,
            },
          } as GeolocationPosition);
        }),
      },
    } as unknown as Navigator);

    render(Map as unknown as new () => SvelteComponent, { target: document.body });

    expect(await screen.findByText(/wildfires within 100km/i)).toBeTruthy();

    const input = screen.getByPlaceholderText('Search Location') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: 'Toronto' } });

    const suggestion = await screen.findByText('Toronto, Ontario, Canada');
    vi.useFakeTimers();
    await fireEvent.click(suggestion);
    await vi.runAllTimersAsync();

    expect(input.value).toBe('');
  });
});
