
import './App.css'
import PaymentIntent from './PaymentIntent'

function App() {
  return (
    <>
      <h1>Coin-Box Timer Payment</h1>
      <br />
      <PaymentIntent />
      <div className="card">
        <p>
          Enter card number '4242 4242 4242 4242' for testing... 
        </p>
      </div>
    </>
  )
}

export default App
