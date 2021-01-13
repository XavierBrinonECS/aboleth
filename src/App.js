import React from 'react'
import './App.css';

function App () {
  const ccpContainerRef = React.useRef(window.document.getElementById('ccpContainer'))

  React.useEffect(() => {
    console.log({ connect: window.connect })
    window.connect?.core?.initCCP(ccpContainerRef.current, {
      ccpUrl: 'https://dlg-connect-dev.awsapps.com/connect/ccp-v2/',
      loginPopup: true,
      softphone: {
        allowFramedSoftphone: true,
        disabledRingtone: false,
      },
    });
  })

  return (
    <div className="App">
      <header className="App-header" id="ccpContainer">
        <p>test</p>
      </header>
    </div>
  );
}

export default App;
