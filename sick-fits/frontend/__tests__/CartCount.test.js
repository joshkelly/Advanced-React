import { render, screen } from '@testing-library/react';
import wait from 'waait';
import CartCount from '../components/CartCount';

describe('<CartCount />', () => {
  it('Renders', () => {
    render(<CartCount count={10} />);
  });

  it('Matches snapshot', () => {
    const { container, debug } = render(<CartCount count={15} />);
    expect(container).toMatchSnapshot();
  });

  it('updates via props', async () => {
    const { container, rerender, debug } = render(<CartCount count={15} />);

    expect(container.textContent).toBe('15');
    // expect(container).toHaveTextContent('15'); Same as above just a style preference.

    // Update the props
    rerender(<CartCount count={10} />);

    // wait for X ms
    await wait(400);
    // await screen.findByText('10'); - Doesn't work, tests 1015 as found 10.

    expect(container.textContent).toBe('10');
    expect(container).toMatchSnapshot();
  });
});
