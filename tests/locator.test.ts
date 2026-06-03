import { render, fireEvent, screen, cleanup, waitFor } from '@testing-library/svelte';
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
        ok: true,
        status: 200,
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
    expect(await screen.findByText('toronto')).toBeInstanceOf(HTMLLIElement);
    await fireEvent.click(button);
    await waitFor(() => expect(input.value).toBe(''), { timeout: 2000 });
  });
});