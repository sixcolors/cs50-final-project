import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import {describe, expect, it, afterEach} from 'vitest';
import App from '../src/App.svelte';

describe('App.svelte', () => {
  // TODO: @testing-library/svelte claims to add this automatically but it doesn't work without explicit afterEach
    afterEach(() => cleanup())

  it('renders without errors', () => {
    const { container } = render(App);
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain('Canadian Wildfire Map');
    expect(container.innerHTML).toMatchSnapshot();
  });
});