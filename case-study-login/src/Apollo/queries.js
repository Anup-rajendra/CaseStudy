import { gql } from '@apollo/client';


export const GET_PRODUCTS = gql`
 query {
  products {
    categoryId
    name
    price
    productId
    supplierId
    inventory {
      inventoryId
      stockQuantity
    }
    inventoryId
    category {
      categoryId
      categoryName
    }
  }
}
`;

export const GET_CARTDETAILS=gql`
query GetCartDetails($userId: Int!) {
    userById(id: $userId) {
      userId
      username
      carts {
        cartId
        cartItems {
          cartId
          cartItemId
          quantity
          product {
            productId
            name
            price
          }
        }
      }
    }
  }
`;

export const GET_CART_TABLE=gql`
query GetCartTable($userId: Int!) {
  userById(id:$userId) {
    userId
    username
    carts {
    cartId
    userId
  }
  } 
}
`;
export const CREATE_OR_UPDATE_CART=gql`
mutation CreateOrUpdateCart($userId: Int!) {
    createOrUpdateCart(userId: $userId) {
      cartId
      userId
    }
  }
`;

export const UPDATE_CART_ITEM=gql`
mutation UpdateCart($cartId:Int!,$productId:Int!){
  addToCartItem(cartId: $cartId, productId: $productId) {
    cartItemId
    cartId
    productId
    quantity
  }
}
`;
  