// src/App.tsx
import Greeting from './Greeting' // <-- Step 2: Import

function App() {
  return (
    <div>
      <h1>Hello, World! This is my first React App.</h1>
      <Greeting /> {/* <-- Step 3: Use the component */}
    </div>
  )
}

export default App