import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Link from 'next/link';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';
import OrderItemStyles from './styles/OrderItemStyles';

export const ALL_ORDERS_QUERY = gql`
  query ALL_ORDERS_QUERY($skip: Int = 0, $first: Int = 0) {
    allOrders(first: $first, skip: $skip) {
      id
      charge
      items {
        name
        price
        description
        id
        quantity
        photo {
          altText
          image {
            publicUrlTransformed
          }
        }
      }
      total
      user {
        id
        name
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid,
  //grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-template-columns: 1fr 1fr;
  grid-gap: 4rem;
`;

function countItemsInAnOrder(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function Orders() {
  const { data, error, loading } = useQuery(ALL_ORDERS_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;

  const { allOrders } = data;
  return (
    <div>
      <div>
        <h2>You have {allOrders.length} orders!</h2>
        <OrderUl>
          {allOrders.map((order) => (
            <OrderItemStyles>
              <Link href={`/order/${order.id}`}>
                <a>
                  <div className="order-meta" key={order.id}>
                    <p>
                      {countItemsInAnOrder(order)}{' '}
                      {countItemsInAnOrder(order) > 1 ? 'Items' : 'Item'}
                    </p>
                    <p>
                      {order.items.length} Product
                      {order.items.length === 1 ? '' : 's'}
                    </p>
                    <p>{formatMoney(order.total)}</p>
                  </div>
                  <div className="images">
                    {order.items.map((item) => (
                      <img
                        key={item.id}
                        src={item.photo.image.publicUrlTransformed}
                        alt={item.name}
                      />
                    ))}
                  </div>
                </a>
              </Link>
              {/* {order.items.map((item) => (
                <li key={item.id}>{item.name}</li> */}
            </OrderItemStyles>
          ))}
        </OrderUl>
      </div>
    </div>
  );
}
