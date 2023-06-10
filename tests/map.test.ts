import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import {describe, expect, it, afterEach} from 'vitest';
import Map from '../src/Map.svelte';

describe('Map.svelte', () => {
  // TODO: @testing-library/svelte claims to add this automatically but it doesn't work without explicit afterEach
    afterEach(() => cleanup())

  it('renders without errors', () => {
    const { container } = render(Map);
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain('Leaflet');
  });
});