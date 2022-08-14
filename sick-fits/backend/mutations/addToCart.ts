import { KeystoneContext, SessionStore } from '@keystone-next/types';
import { CartItem } from '../schemas/CartItem';
import { Session } from '../types';

import { CartItemCreateInput } from '../.keystone/schema-types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('ADD TO CART!');
  // 1. Query current user to check for sign-in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to add items to your cart!');
  }
  // 2. Query current user cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity',
  });
  // console.log(sesh.itemId);
  // console.log(productId);
  // console.log('all: ', allCartItems);

  // 3. Check if item is in cart
  const [existingCartItem] = allCartItems;

  // 4. If item in cart, then increment
  if (existingCartItem) {
    // console.log(
    //   `There are already ${existingCartItem.quantity}, increment by 1!`
    // );

    return context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
      resolveFields: false,
    });
  }

  // 5. If item is not in cart, create new cart item
  return context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    },
    resolveFields: false,
  });
}
