import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { describe, expect, it, afterEach, vi } from 'vitest';
import App from '../src/Locator.svelte';
import type { SvelteComponent } from 'svelte';

describe('Locator.svelte', () => {
  // TODO: @testing-library/svelte claims to add this automatically but it doesn't work without explicit afterEach
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
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
    vi.useFakeTimers();
    await fireEvent.click(button);
    await vi.runAllTimersAsync();
    expect(input.value).toBe('');
  });

  it('alerts when the form is submitted empty', async () => {
    const alertMock = vi.fn();
    vi.stubGlobal('alert', alertMock);

    render(App as unknown as new () => SvelteComponent, { target: document.body });
    const form = document.querySelector('form') as HTMLFormElement;

    await fireEvent.submit(form);

    expect(alertMock).toHaveBeenCalledWith("You didn't type anything.");
  });

  it('supports keyboard navigation for suggestions', async () => {
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();

      if (url.includes('limit=5')) {
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

      if (url.includes('limit=1')) {
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

    render(App as unknown as new () => SvelteComponent, { target: document.body });
    const input: HTMLInputElement = screen.getAllByPlaceholderText('Search Location')[0] as HTMLInputElement;

    await fireEvent.input(input, { target: { value: 'Toronto' } });
    expect(await screen.findByText('Toronto, Ontario, Canada')).toBeInstanceOf(HTMLLIElement);

    vi.useFakeTimers();
    await fireEvent.keyDown(window, { key: 'ArrowDown' });
    await fireEvent.keyDown(window, { key: 'Enter' });
    await vi.runAllTimersAsync();

    expect(input.value).toBe('');
  });
});