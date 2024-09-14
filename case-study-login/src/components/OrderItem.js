import React, { useEffect, useState } from 'react';
import '../css/Orders.css';
import { useQuery } from '@apollo/client';
import { GET_ADDRESS_BY_USERID } from '../Apollo/queries';
import { loadStripe } from '@stripe/stripe-js';
import ChangeAddress from './ChangeAddress';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card';
import { useLocation, useNavigate } from 'react-router-dom';
const OrderItem = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [currentAddressNumber, setCurrentAddressNumber] = useState(0);
  const [changeAddress, setChangeAddress] = useState(false);
  const location = useLocation();
  console.log(location.state);
  const { productId, productName, productPrice, productPhotoURL } =
    location.state;
  console.log(productId);

  const productArray = [
    {
      productName,
      productPrice,
      quantity: 1,
      photoUrl: productPhotoURL,
    },
  ];

  console.log('productArray', productArray);
  // Retrieve user ID and address number from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userData');
    console.log('AddressNumber', currentAddressNumber);
    const storedAddressNumber = localStorage.getItem('addressnumber');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }
    setCurrentAddressNumber(
      storedAddressNumber ? parseInt(storedAddressNumber, 10) : 0
    );
  }, [changeAddress]);

  const {
    loading: addressLoading,
    error: addressError,
    data: addressData,
    refetch: refetchAddress,
  } = useQuery(GET_ADDRESS_BY_USERID, {
    variables: { userId: userId },
    skip: !userId, // Skip if userId is not set
  });

  // Optionally refetch data when userId or currentAddressNumber changes
  useEffect(() => {
    if (userId !== null) {
      refetchAddress();
    }
  }, [userId, currentAddressNumber, refetchAddress]);

  if (addressLoading) return <p>Loading...</p>;
  if (addressError)
    return <p>Error fetching addresses: {addressError.message}</p>;

  const displayAddress =
    addressData?.addressesByUserId[currentAddressNumber] || {};
  const makePayment = async () => {
    const stripe = await loadStripe(
      'pk_test_51PvFPH1adOqTPZqxtt6RZyDNusEZez3sNi8rv3Lb1PXVXf0vQrEjxK4TiAgh12fOmIVGy5f0eLQygl96ldRRrBap00op42RAX4'
    );

    const body = {
      products: productArray,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await fetch(
      'http://localhost:7000/api/create-checkout-session',
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    navigate('/checkout');
    if (result.error) {
      console.log(result.error);
    }
  };
  const handleAddressChange = (newAddressNumber) => {
    setCurrentAddressNumber(newAddressNumber);
    localStorage.setItem('addressnumber', newAddressNumber);
    refetchAddress(); // Refetch the address data after the state is updated
  };

  return (
    <div className="p-7">
      <div className="text-2xl font-extrabold">Order Details</div>
      <div className="flex flex-row gap-3 justify-around pt-6 ">
        <div className="flex flex-col gap-6 flex-grow ">
          {changeAddress ? (
            <ChangeAddress
              onChangeAddress={setChangeAddress}
              onAddressSelect={handleAddressChange}
            />
          ) : (
            <div className="flex justify-between border p-4 bg-white ">
              <div className=" flex flex-col p-1 gap-3 justify-center ">
                <div className="text-xl font-bold pb-2 text-primary">
                  Shipping Address
                </div>
                <div className="flex gap-2 text-wrap ">
                  <div>{displayAddress.street}, </div>
                  <div>{displayAddress.city}, </div>
                  <div>{displayAddress.state},</div>
                  <div>{displayAddress.zipCode},</div>
                  <div>India</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Button
                  className="bg-gradient-to-r from-primary to-blue-400 animated-background transition ease-in-out delay-150 hover:translate-y-1 hover:scale-110 duration-300"
                  onClick={() => {
                    setChangeAddress(true);
                  }}
                >
                  Change Address
                </Button>
              </div>
            </div>
          )}

          <div className="pt-5 ">
            {productArray.length > 0 ? (
              <div className="flex flex-col">
                {productArray.map((item, index) => (
                  <div
                    className="flex items-start bg-white gap-4 p-4 border"
                    key={index}
                  >
                    <img
                      src={item.photoUrl}
                      alt={item.productName}
                      className="w-20 h-20 mr-4 object-fill rounded-[8px]"
                    />
                    <div className="flex flex-col gap-">
                      <div className="font-bold text-lg">
                        {item.productName}
                      </div>
                      <p>Price: ${productPrice}</p>
                      {/* <p>Quantity: {productQuantity}</p> */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No items.</p>
            )}
          </div>
        </div>
        <div className="pl-5 flex flex-col justify-between items-end w-[300px]"></div>
        <div className="fixed right-4 flex flex-col items-end gap-64">
          <Card className="w-[300px]">
            <CardHeader className="border-b bg-gradient-to-r from-primary to-blue-400 animated-background">
              <CardTitle className="text-white">Summary</CardTitle>
              <CardDescription className="text-white">
                Order Summary
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 pt-4 border-b">
              <div className="flex gap-4">
                <div className="text-primary font-semibold">Subtotal:</div>
                <div className="text-black font-normal">{productPrice}</div>
              </div>
              <div className="flex gap-4">
                <div className="text-primary font-semibold">Delivery fee:</div>
                <div className="text-black font-normal">Free</div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row gap-4 pt-4">
              <div className="text-primary font-semibold">Total Price:</div>
              <div className="text-black font-normal">${productPrice}</div>
            </CardFooter>
          </Card>

          <div className="">
            <Button
              onClick={makePayment}
              className="bg-gradient-to-r from-primary to-blue-400 animated-background px-8 transition ease-in-out delay-150 hover:translate-y-1 hover:scale-110 duration-300"
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
