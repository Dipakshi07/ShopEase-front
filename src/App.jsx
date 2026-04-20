import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

// Components
import Header from "./components/Header";
import Home from "./components/Home";
import Shop from "./components/Shop";
import Categories from "./components/Categories";
import CategoryProducts from "./components/CategoryProduct";
import Deal from "./components/Deal";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import UpiPayment from "./components/UpiPayment";
import ProductDetails from "./components/ProductDetails";


function App() {
  return (
    <CartProvider>
      <Router>
        <Header />

        <Routes>
          {/* ================= HOME ================= */}
          <Route
            path="/"
            element={
              <>
                <Home />
                <Shop />
                <Categories />
                <Deal />
                <Contact />
              </>
            }
          />

          {/* ================= MAIN ================= */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />

          {/* ✅ FIXED ROUTE */}
          <Route path="/category/:category" element={<CategoryProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* ================= USER ================= */}
          <Route path="/login" element={<Login />} />
        

          {/* ================= CART ================= */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/upi-payment" element={<UpiPayment />} />

          {/* ================= EXTRA ================= */}
          <Route path="/deal" element={<Deal />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;