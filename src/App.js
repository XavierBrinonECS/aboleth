import React from 'react'
import './App.css';

function App () {
  const ccpContainerRef = React.useRef(window.document.getElementById('root'))
  const [secureIVREndpoint, setSecureIVREndpoint] = React.useState(null)

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
        console.log({ newState, oldState, snapshot: agent.toSnapshot() })
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
              endpoints.filter(({ name }) => /SecureIVR/i.test(name)).forEach(endpoint => {
                console.log({ quickConnect: endpoint })
                setSecureIVREndpoint(endpoint)
              })
            },
            failure: function (err) {
              console.error({ err })
            }
          }
        );
      });
    });

    window.connect?.contact(contact => {
      contact.onRefresh(contact => { console.log({ onRefresh: contact, snapshot: (() => { const ag = new window.connect.Agent(); return ag.toSnapshot() })() }) })
      contact.onIncoming(contact => { console.log({ onIncoming: contact }) })
      contact.onPending(contact => { console.log({ onPending: contact }) })
      contact.onConnecting(contact => { console.log({ onConnecting: contact }) })
      contact.onAccepted(contact => { console.log({ onAccepted: contact }) })
      contact.onMissed(contact => { console.log({ onMissed: contact }) })
      contact.onEnded(contact => { console.log({ onEnded: contact }) })
      contact.onDestroy(contact => { console.log({ onDestroy: contact }) })
      contact.onACW(contact => { console.log({ onACW: contact }) })
      contact.onConnected(contact => { console.log({ onConnected: contact }) })
      contact.onError(contact => { console.log({ onError: contact }) })
    });

    window.connect?.core.onViewContact(onViewContactEvent => {
      console.log({ contactId: onViewContactEvent.contactId })
    });
    return () => {
      window.connect?.core?.terminate();
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>test</p>
        <button onClick={ascend} disabled={secureIVREndpoint === null}>Secure IVR</button>
      </header>
    </div>
  );

  function ascend () {
    var agent = new window.connect.Agent();
    let secIVR = {}
    agent.getEndpoints(
      agent.getAllQueueARNs(), {
      success: ({
        endpoints
      }) => {
        console.log({ endpoints })
        secIVR = endpoints
          .filter(endpoint => /SecureIVR/i.test(endpoint.name))
          .pop()
      },
      failure: data => console.log({ failure: data })
    }
    )
    agent
      .getContacts(window.connect.ContactType.VOICE)
      .pop()
      ?.addConnection(secIVR, {
        success: data => { console.log({ success: data }) },
        failure: data => { console.log({ failure: data }) }
      })
  }
}
export default App;
