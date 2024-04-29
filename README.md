# Miini e-commerce website
## Overview
This is minimalistic e-commerce app for home products where users can search for their product and buy it with ease.

**LIVE LINK :** https://miini-e-commerce.netlify.app/
## Features

- The home page is designed for exploring specific products and then navigating to the product page to gather more details about them.
- On every page, except the category page, a carousel showcases trending products, allowing users to scroll left and right to view all trending items.
- The category page features category-based filtering, which depends on the category clicked.
- The product page serves as a detailed repository of information for each item, offering multiple options such as quantity adjustment, adding to cart, altering the main image, and purchasing the product. The image changes when another small image below the main image is clicked. When the 'Buy Now' button is clicked, the page navigates to the first step of the checkout process.
- The shopping cart displays all the items added to the cart, along with the total cost of those items. It also shows the total quantity of products in the cart. When the 'Payment' button is clicked, it navigates to the first step of the checkout process.
- The first checkout step presents the contents of the cart nicely, allowing changes such as deleting products from the basket before proceeding to checkout step two.
- The second step of checkout features a form that needs to be correctly populated with required fields. A delivery option must be chosen before the form can be submitted with the 'Order' button. Next to the form is a structured display of the cart, including subtotal and shipping costs, culminating in the total price of the entire cart. After submission of the form, the page redirects to the final step of the checkout process, where a success message will be displayed, along with a unique order ID, to acknowledge the completion of the transaction.
## Tech Used / Dependencies
This is a React App boostrapped with CRA

Add-on packages include:

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router DOM](https://reactrouter.com/en/main)
