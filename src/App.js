import logo from './logo.svg';
import React from 'react'
import './App.css';

function App () {
  // let interval = React.useRef(null)
  React.useEffect(() => {
    console.log({ connect: window.connect })
    window.connect?.core?.initCCP({ /* ... */ });
    // interval.current = window.setInterval(() => {
    //   console.log({ connect: window.connect })
    // }, 1000)

    // return () => {
    //   window.clearInterval(interval.current)
    // }
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
