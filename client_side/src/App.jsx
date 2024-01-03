import Home from "./Home"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteMap from "./SiteMap"

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="site_map" element={<SiteMap/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
