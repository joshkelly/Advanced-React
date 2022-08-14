import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import Nav from '../components/Nav';
import { CartStateProvider } from '../lib/cartState';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeCartItem, fakeUser } from '../lib/testUtils';

// create mocks for being logged out, logged in, and logged in with cart items
const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: null } },
  },
];
const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: fakeUser() } },
  },
];
const signedInWithCartMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: { authenticatedItem: fakeUser({ cart: [fakeCartItem()] }) },
    },
  },
];

describe('<Nav />', () => {
  it('Renders minimal nav when signed out', () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={notSignedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    expect(container).toHaveTextContent('Sign In');
    expect(container).toMatchSnapshot();
    const link = screen.getByText('Sign In');
    expect(link).toHaveAttribute('href', '/signin');
  });

  it('Renders full nav when signed in', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={signedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    await screen.findByText('Sign Out');
    expect(container).toMatchSnapshot();
  });

  it('Renders full nav when signed in', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={signedInWithCartMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    await screen.findByText('Sign Out');
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
