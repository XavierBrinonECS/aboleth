import React from 'react'
import './App.css';

function App () {
  const ccpContainerRef = React.useRef(window.document.getElementById('root'))

  React.useEffect(() => {
    window.connect?.core?.initCCP(ccpContainerRef.current, {
      ccpUrl: 'https://dlg-connect-dev.awsapps.com/connect/ccp-v2/',
      loginPopup: true,
      softphone: {
        allowFramedSoftphone: true,
        disabledRingtone: false,
      },
    });

    return () => {
      window.connect?.core?.terminate();
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>test</p>
      </header>
    </div>
  );
}

export default App;
