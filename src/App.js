import logo from './logo.svg';
import React from 'react'
import './App.css';

function App () {
  const ccpContainerRef = React.useRef(window.document.getElementById('root'))

  React.useEffect(() => {
    console.log({ connect: window.connect })
    window.connect?.core?.initCCP(ccpContainerRef.current, {
      //      ccpUrl: 'https://dlg-connect-dev.awsapps.com/connect/ccp-v2/', // https://cx-ecs-chandank.awsapps.com/connect/login
      ccpUrl: 'https://cx-ecs-chandank.awsapps.com/connect/ccp-v2/', // https://cx-ecs-chandank.awsapps.com/connect/login
      loginPopup: true,
      // loginUrl: REACT_APP_LOGIN_URL,
      softphone: {
        allowFramedSoftphone: true,
        disabledRingtone: false,
      },
    });
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
