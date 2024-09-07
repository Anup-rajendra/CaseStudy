import { gql } from '@apollo/client';


export const GET_PRODUCTS = gql`
 query {
  products {
    categoryId
    name
    price
    photoUrl
    productId
    supplierId
    description
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

export const GET_PRODUCTS_BY_CATEGORY = gql`
query GetProductsByCategory($categoryId: Int!) {
  productsByCategory(categoryId: $categoryId) {
    productId
    name
    price
    photoUrl
    category {
      categoryId
      categoryName
    }
    supplier {
      supplierId
      name
    }
    inventory {
      stockQuantity
    }
  }
}
`
export const GET_PRODUCTS_BY_NAME =gql`
query GetProductsByMatchingString($searchString: String!) {
  productsByMatchingString(searchString: $searchString) {
    productId
    name
    price
    photoUrl
    category {
      categoryId
      categoryName
    }
    supplier {
      supplierId
      name
    }
    inventory {
      stockQuantity
    }
  }
}
`

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
            photoUrl
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

export const GET_ADDRESS_BY_USERID = gql`
  query GetAddressByID($userId: Int!) {
    addressesByUserId(userId: $userId) {
      street
      city
      state
      zipCode
    }
  }
`;
export const ADD_TO_ADDRESS = gql`
  mutation AddToAddress($userId: Int!, $city: String!, $state: String!, $street: String!, $zipcode: String!) {
    addToAddress(userId: $userId, city: $city, state: $state, street: $street, zipcode: $zipcode) {
      addressId
      userId
      city
      street
      state
      zipCode
    }
  }
`;

  