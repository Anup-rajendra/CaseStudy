const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51PvFPH1adOqTPZqxBpHlcFZ8OYxCXpZgbHWyMSyuid6an3sgIywIqhJrOt8cUZ0kBhJe7RZEXcm6DZ0nlxJIQ2wl00FKEEv8GI"
); // Use environment variable for the secret key

app.use(express.json());
app.use(cors());

// Checkout API
app.post("/api/create-checkout-session", async (req, res) => {
  const { products } = req.body;
  console.log("Received products:", products);

  try {
    // Ensure `unit_amount` is in integer cents
    const lineItems = products.map((product) => {
      const unitAmountCents = Math.round(product.productPrice * 100);
      const imageUrl =
        product.photoUrl.startsWith("http") ||
        product.photoUrl.startsWith("https")
          ? product.photoUrl
          : `http://localhost:3000${product.photoUrl}`; // Adjust this based on your server setup

      console.log(imageUrl);

      console.log(
        `Product: ${product.productName}, Price: ${product.productPrice}, Unit Amount : ${unitAmountCents}`
      );
      return {
        price_data: {
          currency: "INR", // Ensure this matches your intended currency
          product_data: {
            name: product.productName,
            images: [imageUrl], // Ensure the image URL is valid
          },
          unit_amount: unitAmountCents, // Convert to cents
        },
        quantity: product.quantity,
      };
    });

    // Debug lineItems structure
    console.log("Formatted line items:", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/checkout",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(7000, () => {
  console.log("Server started on port 7000");
});
