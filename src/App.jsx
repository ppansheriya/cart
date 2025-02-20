import { useState } from 'react'
import './App.css'
import PaintingCarts from "./components/PaintingCarts.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
      <>
          <div className="bg-gray-100 flex items-center justify-center">
              <PaintingCarts/>
          </div>
      </>
  )
}

export default App
