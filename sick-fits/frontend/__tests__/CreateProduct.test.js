import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import Router from 'next/router';
import wait from 'waait';
import CreateProduct, {
  CREATE_PRODUCT_MUTATION,
} from '../components/CreateProduct';
import { fakeItem, makePaginationMocksFor } from '../lib/testUtils';
import { ALL_PRODUCTS_QUERY } from '../components/Products';

const item = fakeItem();

jest.mock('next/router', () => ({
  push: jest.fn(),
}));

const mocks = [
  {
    request: {
      query: CREATE_PRODUCT_MUTATION,
      variables: {
        name: item.name,
        description: item.description,
        price: item.price,
        image: '',
      },
    },
    result: {
      data: {
        createProduct: {
          ...item,
          __typename: 'Item',
        },
      },
    },
  },
  {
    request: {
      query: ALL_PRODUCTS_QUERY,
      variables: { skip: 0, first: 2 },
    },
    result: {
      data: {
        allProuducts: [item],
      },
    },
  },
];

describe('<CreateProduct/>', () => {
  it('renders and matches snapshot', () => {
    const { container, debug } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('handles the updating', async () => {
    const { container, debug } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );
    await userEvent.type(screen.getByPlaceholderText(/Name/i), item.name);
    userEvent.clear(screen.getByPlaceholderText(/Price/i));
    await userEvent.type(
      screen.getByPlaceholderText(/Price/i),
      item.price.toString()
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      item.description
    );
    expect(screen.getByDisplayValue(item.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.price)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.description)).toBeInTheDocument();
  });

  it('creates the items when the form is submitted', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <CreateProduct />
      </MockedProvider>
    );
    await userEvent.type(screen.getByPlaceholderText(/Name/i), item.name);
    userEvent.clear(screen.getByPlaceholderText(/Price/i));
    await userEvent.type(
      screen.getByPlaceholderText(/Price/i),
      item.price.toString()
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      item.description
    );
    await userEvent.click(screen.getByText('+ Add Product'));
    // console.log(Router.push);
    await waitFor(() => wait(0));
    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith({
      pathname: `/product/${item.id}`,
    });
  });
});
