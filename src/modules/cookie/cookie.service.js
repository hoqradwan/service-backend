import axios from 'axios';



// Login Request in Envato

export const loginRequest = async () => {
  try {
    console.log("hitting login");

    const url = 'https://account.envato.com/api/public/sign_in';

    // Set up the headers
    const headers = {
      'accept': 'application/json',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
      'origin': 'https://elements.envato.com',
      'referer': 'https://elements.envato.com/',
      'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'sec-ch-ua-mobile': '?1',
      'sec-ch-ua-platform': '"Android"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
      'x-client-version': '3.0.3'
    };

    // Define the payload for the login request
    const loginPayload = {
      language_code: "en",
      password: "3$00D.#@#%67030p7bpIl96", // Use your actual password or consider using environment variables
      state: "JTdCJTIycGF0aCUyMiUzQSUyMiUyRiUyMiU3RA==",
      to: "elements",
      username: "bddigitaltools@gmail.com" // Use your actual username or consider using environment variables
    };

    // Make the HTTP request
    const loginResponse = await axios({
      method: 'POST',
      url: url,
      headers: headers,
      data: JSON.stringify(loginPayload),
    });
    const loginToken = loginResponse?.data?.token;
    console.log('login response', loginToken);

    if (loginToken) {
      // Set up the headers
      const secondHeaders = {
        'Accept': 'application/json; version=2',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Content-Type': 'application/json',
        'Origin': 'https://elements.envato.com',
        'Referer': 'https://elements.envato.com/sign-in',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
        'Cookie': 'envato_client_id=fef508f9-3f6a-4cde-a5c8-8ed5a4e84013',
      };

      const secondPayload = {
        attribution: null,
        authentication_action: "sign_in",
        language_code: "en",
        token: loginToken
      };

      const SecondLoginResponse = await axios({
        method: 'POST',
        url: "https://elements.envato.com/auth-api/sign-in",
        headers: secondHeaders,
        data: JSON.stringify(secondPayload),
      });

      console.log("second request", SecondLoginResponse);

    }

    // Check the response for a successful login
    if (loginResponse.status === 200 && loginResponse.data) {
      return { response: loginResponse.data, message: 'Login successful' };
    } else {
      throw new Error('Unexpected response status or missing data');
    }
  } catch (error) {
    console.error('Error in login:', error.message);
    throw new Error('Failed to login');
  }
};


// {
//   "state": "ok",
//   "redirect": "https://elements.envato.com/sign-in/with-token?state=JTdCJTIycGF0aCUyMiUzQSUyMiUyRiUyMiU3RA%3D%3D\u0026token=kJWafQEwUX4QBjoJmRejgSXLjaMTmsp4ip44bWOhkuhduItpSCYm5JEtfWbl5gHA\u0026utm_nooverride=1",
//   "token": "kJWafQEwUX4QBjoJmRejgSXLjaMTmsp4ip44bWOhkuhduItpSCYm5JEtfWbl5gHA"
// }