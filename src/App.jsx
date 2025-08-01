 
import { Routes ,Route} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PrivateRoutes from "./user/PrivateRoutes"
import Profile from "./user/Profile"
import Dashboard from "./user/DashBoard"
import Update from "./user/Update"
import AdminRoutes from "./admin/AuthRoutes"
import AdminDashboard from "./admin/AdminDashboard"
import AdminProfile from "./admin/AdminProfile"
import AdminUpdate from "./admin/AdminUpdate"
import CreateProduct from "./admin/CreateProduct"
import CreateCategory from "./admin/CreateCategory"
import Orders from "./admin/Orders"
import Products from "./admin/Products"
import ProductDetails from "./admin/ProductDetails"
import ProductPage from "./pages/ProductPage"
import CartPage from "./pages/CartPage"
import CheckoutPage from "./pages/CheckOut"

 

function App() {
 

  return (
    <>
    <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/products" element={<ProductPage />} />
       <Route path="/cart" element={<CartPage />} />
       <Route path="/checkout" element={<CheckoutPage />} />

      {/* Private Routes */}
       <Route path='/dashboard' element={<PrivateRoutes />}>
       <Route path="user" element={<Dashboard />} />
       <Route path="user/profile" element={<Profile />} />
       <Route path="user/update/:id" element={<Update />} />
       </Route>
      {/* admin Routes */}
       <Route path='/dashboard' element={<AdminRoutes />}>
       <Route path="admin" element={<AdminDashboard />} />
       <Route path="admin/profile" element={<AdminProfile />} />
       <Route path="admin/update/:userId" element={<AdminUpdate />} />
       <Route path="admin/create-product" element={<CreateProduct />} />
       <Route path="admin/create-category" element={<CreateCategory />} />
       <Route path="admin/orders" element={<Orders />} />
       <Route path="admin/products/details/:id" element={<ProductDetails />} />
       <Route path="admin/products" element={<Products />} />

       </Route>
    </Routes>
    </>
  )
}

export default App
