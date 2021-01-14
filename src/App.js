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
              // agentLogin: null
              // endpointARN: "arn:aws:connect:eu-west-2:172096265603:instance/fe234290-4bc8-492f-a601-3c4b29259ae2/transfer-destination/f893010f-7d84-42a2-afb8-d8287050ad57"
              // endpointId: "arn:aws:connect:eu-west-2:172096265603:instance/fe234290-4bc8-492f-a601-3c4b29259ae2/transfer-destination/f893010f-7d84-42a2-afb8-d8287050ad57"
              // name: "SecureIVR"
              // phoneNumber: null
              // queue: null
              // type: "queue"
              console.log({ filter: endpoints.map(({ name }) => name) })
              const quickConnect = endpoints.filter(({ name }) => /SecureIVR/i.test(name)).map(x => x)
              console.log({ quickConnect })
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
