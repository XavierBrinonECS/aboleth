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


## Assumptions
* the CCP has been initialised already
  - meaning the browser has loaded the library and `window.connect` is available
  - the iFrame is either hidden or fully visible by CSS styling
*
