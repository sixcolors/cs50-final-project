import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { describe, expect, it, afterEach, vi } from 'vitest';
import App from '../src/Locator.svelte';
import type { SvelteComponent } from 'svelte';

describe('Locator.svelte', () => {
  // TODO: @testing-library/svelte claims to add this automatically but it doesn't work without explicit afterEach
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders without errors', () => {
    const { container } = render(App as unknown as new () => SvelteComponent, { target: document.body });
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain('Search Location');
    expect(container.innerHTML).toMatchSnapshot();
  });

  it('find location', async () => {
    vi.stubGlobal('fetch', vi.fn(() => {
      return Promise.resolve({
        json: () => Promise.resolve([{
          display_name: 'toronto',
          lat: '43.6532',
          lon: '-79.3832'
        }])
      });
    }));

    render(App as unknown as new () => SvelteComponent, { target: document.body });
    const input: HTMLInputElement = screen.getAllByPlaceholderText('Search Location')[0] as HTMLInputElement;
    const button = screen.getAllByDisplayValue('Submit')[0];
    await fireEvent.input(input, { target: { value: 'Toronto' } });
    await new Promise(r => setTimeout(r, 100));
    expect(screen.getByText('toronto')).toBeInstanceOf(HTMLLIElement);
    await fireEvent.click(button);
    await new Promise(r => setTimeout(r, 1200));
    expect(input.value).toBe(''); // input should be cleared
  });
});