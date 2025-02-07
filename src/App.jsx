 
import { Routes ,Route} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PrivateRoutes from "./user/PrivateRoutes"
import Profile from "./user/Profile"
import Dashboard from "./user/DashBoard"

 

function App() {
 

  return (
    <>
    <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />

      {/* Private Routes */}
       <Route path='/dashboard' element={<PrivateRoutes />}>
       <Route path="user" element={<Dashboard />} />
       <Route path="user/profile" element={<Profile />} />
       </Route>
    </Routes>
    </>
  )
}

export default App
