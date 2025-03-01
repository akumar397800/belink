
import { Outlet } from 'react-router'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast,{Toaster} from 'react-hot-toast'

function App() {

  return (
    <> <Toaster/>
      <Header/>
      <main className='min-h-[78vh]'>
        
        <Outlet/>
        
      </main>
      <Footer />
     
      </>
  )
}

export default App

