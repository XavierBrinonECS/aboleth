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
              var endpoints = data.endpoints
              window.connect.getLog()
                .info('Log Info')
                .withObject({ endpoints })

              endpoints.filter(({ name }) => /SecureIVR/i.test(name)).forEach(endpoint => {
                window.connect.getLog()
                  .info('Log Info')
                  .withObject({ quickConnect: endpoint })
                setSecureIVREndpoint(endpoint)
              })
            },
            failure: function (err) {
              window.connect.getLog()
                .warn('Log warn')
                .withException({ err })
            }
          }
        );
      });
    });

    window.connect?.contact(contact => {
      contact.onRefresh(contact => {
        console.log({
          onRefresh: contact,
          snapshot: (new window.connect.Agent()).toSnapshot()
        })
      })
      contact.onIncoming(contact => {
        window.connect.getLog()
          .info('Log Info')
          .withObject({ onIncoming: contact })
      })
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
      window.connect.getLog()
        .info('Log Info')
        .withObject({ contactId: onViewContactEvent.contactId })
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
        <button onClick={pauseCall} disabled={secureIVREndpoint === null}>Pause</button>
        <button onClick={resumeCall} disabled={secureIVREndpoint === null}>Resume</button>
      </header>
    </div>
  );

  function pauseCall () {
    let agent = new window.connect.Agent();
    let [contact,] = agent
      ?.getContacts(window.connect.ContactType.VOICE)
    const initialContactId = contact.getInitialContactId()
    const contactId = contact.getContactId()

    window.fetch(`https://gfdtv-connect-call-recording.dev.mycro.cloud/${contactId}/${initialContactId}/pause`)
  }

  function resumeCall () {
    let agent = new window.connect.Agent();
    let [contact,] = agent
      ?.getContacts(window.connect.ContactType.VOICE)
    const initialContactId = contact.getInitialContactId()
    const contactId = contact.getContactId()

    window.fetch(`https://gfdtv-connect-call-recording.dev.mycro.cloud/${contactId}/${initialContactId}/resume`)
  }

  function ascend () {
    let agent = new window.connect.Agent();
    let secIVR = {}
    agent.getEndpoints(
      agent.getAllQueueARNs(), {
      success: ({ endpoints }) => {
        window.connect.getLog()
          .info('Log Info')
          .withObject({ getEndpointsSuccess: endpoints })

        secIVR = endpoints
          .filter(({ name }) => /SecureIVR/i.test(name))
          .pop()

        const [contact,] = agent
          .getContacts(window.connect.ContactType.VOICE)

        if (contact) {
          const { contactId } = contact
          window.connect.getLog()
            .info('Log Info')
            .withObject({ contactId })

          contact?.addConnection(secIVR, {
            success: data => {
              window.connect.getLog()
                .info('Log Info')
                .withObject({ addConnectionSuccess: data, contactId })
            },
            failure: data => {
              window.connect.getLog()
                .info('Log Info')
                .withObject({ addConnectionSuccess: data })
            }
          })
        }
      },
      failure: data => {
        window.connect.getLog()
          .info('Log Info')
          .withObject({ getEndpointsFailure: data })
      }
    });
  }
}
export default App;
