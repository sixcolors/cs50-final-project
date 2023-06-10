import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import {describe, expect, it, afterEach} from 'vitest';
import App from '../src/Locator.svelte';

describe('Locator.svelte', () => {
  // TODO: @testing-library/svelte claims to add this automatically but it doesn't work without explicit afterEach
    afterEach(() => cleanup())

  it('renders without errors', () => {
    const { container } = render(App);
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain('Search Location');
    expect(container.innerHTML).toMatchSnapshot();
  });

  it('find location', async () => {
    render(App);
    const input: HTMLInputElement = screen.getAllByPlaceholderText('Search Location')[0] as HTMLInputElement;
    const button = screen.getAllByDisplayValue('Submit')[0];
    await fireEvent.input(input, { target: { value: 'Toronto' } });
    await new Promise(r => setTimeout(r, 1000));
    expect(screen.getByText('toronto')).toBeInstanceOf(HTMLLIElement);
    await fireEvent.click(button);
    await new Promise(r => setTimeout(r, 1000));
    expect(input.value).toBe(''); // input should be cleared
  });
});