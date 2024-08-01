

export const loginIntoEvanto = async () => {
  const payload = {
    username: "mohammadrobin636@gmail.com",
    password: "robin123"
  }
  const url = "https://account.envato.com/api/public/sign_in";
//   const url = "https://elements.envato.com/auth-api/sign-in";
  const headers = {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': 'https://elements.envato.com',
      'Origin': 'https://elements.envato.com',
      'Referer': 'https://elements.envato.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'X-Client-Data': 'CIe2yQEIorbJAQipncoBCOCSywEIkqHLAQibossBCIWgzQEIjafNAQiLqM4B',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8'
  }


  const res = await fetch(url, {
    method: "POST",
    headers,
    body: payload,
  })
  console.log(res);


  return res;
};