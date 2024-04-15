import './App.css'
import {Routes , Route} from 'react-router-dom'
import Home from './components/Home'
import CityDetails from './components/CityDetails'



function App() {
  

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/city-details/:name/:lat/:lon' element={<CityDetails/>} />
    </Routes>
    </>
  )
}

export default App
