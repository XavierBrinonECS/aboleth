# Goal: Transfer the call to the Secure IVR flow
## PoC

For now the Proof of Concept is hosted in ECS AWS as an [amplify app](https://main.d312cw88l3c3jl.amplifyapp.com/)

### Authentication
To run the PoC, the first step is to get authenticated:
  * Login to Jumpcloud
  * Select the AWS Connect Dev Profile
  * Open the [amplify app](https://main.d312cw88l3c3jl.amplifyapp.com/)
### Receiving a call from the client
On your mobile phone: 0808 189 5305

### Transfering to the IVR
Once you accepted the call, click the button `Secure IVR`

## Code

The main code is in the folder `/src/App.js`

### CCP initialisation

The init of the ccp happens on page load, for here it is set when the main component is being mounted.
```js
React.useEffect(() => {
  // initialisation
}, [])
```

The CCP will be loaded inside an iFrame. To that end, we provide the html element that will contain this iFrame.
```js
const ccpContainerRef = React.useRef(window.document.getElementById('root'))
```

The variable needed to create the CCP instance is the URL
```js
window.connect?.core?.initCCP(ccpContainerRef.current, {
  ccpUrl: 'https://dlg-connect-dev.awsapps.com/connect/ccp-v2/',
  loginPopup: true,
  softphone: {
    allowFramedSoftphone: true,
    disabledRingtone: false,
  },
});
```
The `loginPopup` is the behavior of the ccp when the agent hasn't been authenticated yet.

### Transfer the call to the IVR
The transfer is: 
- a connection to the IVR endpoint 
- added to the list of conctacts 
- of the Agent object. 

We first get access to the `Agent` object
```js
let agent = new window.connect.Agent();
```

From there we get the details of the endpoint, the `SecureIVR` endpoint.
The Endpoint can be a phone number, but here it's a queueARN. 
```js
agent.getEndpoints(
  agent.getAllQueueARNs(), {
  success: ({ endpoints }) => {
    secIVR = endpoints
      .filter(({ name }) => /SecureIVR/i.test(name))
      .pop()
  // Do something with the endpoint
  },
  failure: data => console.log({ getEndpointsFailure: data })
});
```
***Note: This is callback based, the actions are triggerd in cascade.

Once the Endpoint is found, we add the connection to the Contacts:
```js
agent
  .getContacts(window.connect.ContactType.VOICE)
  .pop()
  ?.addConnection(secIVR, {
    success: data => { console.log({ addConnectionSuccess: data }) },
    failure: data => { console.log({ addConnectionFailure: data }) }
})
```
The add is what triggers the transfer.

## Assumptions
* the CCP has been initialised already
  - meaning the browser has loaded the library and `window.connect` is available
  - the iFrame is either hidden or fully visible by CSS styling
*
