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
    window.connect?.agent(agent => {
      agent.onStateChange(({ newState, oldState }) => {
        console.log({ newState, oldState })
        console.log({ contacts: agent.getContacts() })
        const queuesARNs = agent.getAllQueueARNs();
        agent.getEndpoints(
          queuesARNs,
          {
            success: function (data) {
              var endpoints = data.endpoints; // or data.addresses
              console.log({ endpoints })
            },
            failure: function (err) {
            }
          }
        );
      });
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
