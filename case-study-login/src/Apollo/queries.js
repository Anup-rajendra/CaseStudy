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

export const UPDATE_CART_ITEM_QUANTITY = gql`
  mutation UpdateCartItemQuantity($cartItemId: Int!, $change: Int!) {
    updateCartItemQuantity(cartItemId: $cartItemId, quantityChange: $change) {
      cartItemId
      quantity
    }
  }
`;

export const ADD_NEW_ORDER = gql`
  mutation AddNewOrder($userId: Int!, $totalPrice: Int!) {
    addNewOrder(userId: $userId, totalprice: $totalPrice) {
      orderId
      orderDate
      totalAmount
    }
  }
`;

export const DELETE_CART_ITEM_BY_CART_ID = gql`
  mutation DeleteCartItemByCartId($cartId: Int!) {
    deleteCartItemByCartId(cartId: $cartId) {
      productId
      productQuantity
    }
  }
`;

export const UPDATE_INVENTORY = gql`
  mutation UpdateInventory($inventoryId: Int!, $quantity: Int!) {
    updateInventory(inventoryId: $inventoryId, quantity: $quantity) {
      inventoryId
      stockQuantity
    }
  }
`;

export const ADD_SHIPMENT = gql`
  mutation AddShipment($orderId: Int!) {
    addShipment(orderId: $orderId) {
      shipmentId
      shipmentDate
      orderId
    }
  }
`;

export const ADD_ORDER_ITEM = gql`
  mutation AddOrderItem($orderId: Int!, $productId: Int!, $quantity: Int!) {
    addOrderItem(orderId: $orderId, productId: $productId, quantity: $quantity) {
      productId
      price
      orderItemId
      orderId
      quantity
    }
  }
`;


  //profile mutations

  export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: Int!) {
    userById(id: $userId) {
      userId
      username
      firstname
      lastname
      email
      phoneNumber
      addresses {
        street
        city
        state
        zipCode
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateUserProfile(
    $userId: Int!,
    $firstName: String!,
    $lastName: String!,
    $email: String!,
    $phoneNumber: String
  ) {
    updateUserProfile(
      userId: $userId,
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      phoneNumber: $phoneNumber
    ) {
      userId
      firstname
      lastname
      email
      phoneNumber
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($userId: Int!, $street: String, $city: String, $state: String, $zipcode: String) {
    updateAddress(userId: $userId, street: $street, city: $city, state: $state, zipcode: $zipcode) {
      street
      city
      state
      zipcode
    }
  }
`;

//order history 

export const GET_USER_ORDERS = gql`
  query GetUserOrders($userId: Int!) {
    userOrders(userId: $userId) {
      orderId
      orderDate
      totalAmount
      orderItems {
        productId
        quantity
        price
        product {
          name
          photoUrl
        }
      }
    }
  }
`;

//order details
// queries.js

export const GET_ORDER_DETAILS = gql`
  query GetOrderDetails($orderId: Int!) {
  getOrderById(orderId: $orderId) {
    orderId
    orderDate
    totalAmount
    orderItems {
      orderItemId
      quantity
      price
      product {
        productId
        name
        photoUrl
      }
    }
    shipment {
      shipmentId
      trackingNumber
      shipmentDate
    }
  }
}

`;


