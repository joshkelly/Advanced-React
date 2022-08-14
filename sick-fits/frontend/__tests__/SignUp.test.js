import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import Signup, { CREATE_USER_MUTATION } from '../components/SignUp';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';

const me = fakeUser();
const mePassword = 'Te$t1234';

const mocks = [
  // mutation mock
  {
    request: {
      query: CREATE_USER_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password: mePassword,
      },
    },
    result: {
      data: {
        createUser: {
          __typename: 'User',
          id: 'abc123',
          name: me.name,
          email: me.email,
        },
      },
    },
  },
  // current user mock
  // {
  //   request: { query: CURRENT_USER_QUERY },
  //   result: { data: { authenticatedItem: me } },
  // },
];

describe('<SignUp/>', () => {
  it('renders and matches snapshot', () => {
    const { container, debug } = render(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('calls the mutation properly', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <Signup />
      </MockedProvider>
    );
    await userEvent.type(screen.getByPlaceholderText(/Name/i), me.name);
    await userEvent.type(screen.getByPlaceholderText(/Email/i), me.email);
    await userEvent.type(screen.getByPlaceholderText(/Password/i), mePassword);
    await userEvent.click(screen.getByText('Sign Up'));
    await screen.findByText(
      `Signed up with ${me.email} - You can now sign in!`
    );
  });
});
