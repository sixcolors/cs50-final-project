import { render, cleanup } from '@testing-library/svelte';
import { describe, expect, it, afterEach } from 'vitest';
import App from '../src/App.svelte';
import type { SvelteComponent } from 'svelte';

describe('App.svelte', () => {
  // TODO: @testing-library/svelte claims to add this automatically but it doesn't work without explicit afterEach
  afterEach(() => cleanup());

  it('should render the component correctly', () => {
    const { container } = render(App as unknown as new () => SvelteComponent, { target: document.body });
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain('Canadian Wildfire Map');
    expect(container.innerHTML).toMatchSnapshot();
  });
});