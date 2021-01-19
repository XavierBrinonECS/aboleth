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
## Assumptions

