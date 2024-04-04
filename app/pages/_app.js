import "@/styles/globals.css";
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react'

Amplify.configure({
  Auth: {
    Cognito: {
      //  Amazon Cognito User Pool ID
      userPoolId: 'us-east-1_ujtMueces',
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: '100d3kpmsuk6qt752bcqkstbsp',
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
      // OPTIONAL - Set to true to use your identity pool's unauthenticated role when user is not logged in
      allowGuestAccess: true,
      // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
      // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
      // signUpVerification Method: 'code', // 'code' | 'link'
      loginWith: {
        // OPTIONAL - Hosted UI configuration
        oauth: {
          domain: 'https://team25officialsignup.auth.us-east-1.amazoncognito.com/',
          scopes: [
            'email',
            'phone',
            'openid',
            'profile',
          ],
          redirectSignIn: ['https://main.d2gmf4p0ogiu5s.amplifyapp.com/'],
          redirectSignOut: ['https://main.d2gmf4p0ogiu5s.amplifyapp.com/'],
          responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
        }
      }
    }
  }
});

// You can get the current config object
//const currentConfig = Amplify.getConfig();
// console.log("Current Config:\n");
// console.log(Amplify.getConfig());

function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default App;
