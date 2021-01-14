import React from 'react'
import './App.css';

function App () {
  const ccpContainerRef = React.useRef(window.document.getElementById('root'))
  const secureIVREndpoint = React.useRef(null)

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
              endpoints.filter(({ name }) => /SecureIVR/i.test(name)).forEach(endpoint => {
                console.log({ quickConnect: endpoint })
                secureIVREndpoint.current = endpoint
                return endpoint
              })
            },
            failure: function (err) {
            }
          }
        );
      });
    });

    window.connect?.contact(contact => {
      contact.onRefresh(contact => { console.log({ onRefresh: contact }) })
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
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>test</p>
        <button onClick={ascend} disabled={secureIVREndpoint.current === null}>Secure IVR</button>
      </header>
    </div>
  );

  function ascend () {
    var agent = new window.connect.Agent();
    var queueARN = "arn:aws:connect:<REGION>:<ACCOUNT_ID>:instance/<CONNECT_INSTANCE_ID>/queue/<CONNECT_QUEUE_ID>";

    agent.connect(secureIVREndpoint.current, {
      queueARN,
      success: function () { console.log("outbound call connected"); },
      failure: function (err) {
        console.log("outbound call connection failed");
        console.log(err);
      }
    });
  }
}

export default App;
