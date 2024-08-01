// cookies for download request
export const getCookie = () => {
    return "envato_client_id=fef508f9-3f6a-4cde-a5c8-8ed5a4e84013;  _ce.clock_event=1; _ce.clock_data=-2755%2C180.148.213.24%2C1%2C362d7fe3d8b2581bffa359f0eeda7106%2CChrome%2CBD; _uetsid=5685b7504cfa11ef81225ff85d1ffbf0; _uetvid=5685d7704cfa11ef8ba73dc9f75a5646; _gcl_aw=GCL.1722492332.Cj0KCQjwwae1BhC_ARIsAK4Jfrw-xdA7KZBloocqoUo2kGvJswbTBNL0TGTnsVbDryXVqE5F295yEhoaAqH_EALw_wcB; cebsp_=12; _elements_session_4=LzU4TWJxUlRScDZac0wzNjRnUUxFMnlRcG5TdUJlVTFpQnlEUFN4QWt4QWRadlM3eGVPYXJUeTNZUXdPS0Q4eHk5cFFqNzRPVHM2aFBNdzNwc00reWZDZmRPZ3ZwVXg5NEJqbjdNV092VVdUNUk2OXlhWXBNQlpqNFBFUVIvZG9LU2hQUzF5c2RGd2IwaThWdHZKN1d0WHVhRTQyL2VYY0NvMndRRjN6cVFnRGIxbWtFalp0ZytOdUxqZEtPeFM5U3BYNE93M25zckkvZzJjemU5NG8wTW1HQ0pIY1pmTExZZ29uYUhVVVFQSVVodXVqQ1FiKzFxRnNSREFzTGtVeG5yY2VtSHpYd25MelVhQjZPUDltSlJvRXZuczJ5OVpkSURrTWVxUmlpUjBvNVVGdUV5a1FsOTJad0RVdGNsdm5MZUtuOGsxZTdFRGhVSlBpeCtNeE5HRzFMNEIzWHk3VkRkaVNtdnVyY0U4YnF4WVp2cUM2L2EvdStPQ1JCUDNhVDVzT3R4V1lzWFFPZ2RxZENqczdaUT09LS1rT2xKL09FeHlqaUxTRjBVeGNDcTNnPT0%3D--fabe04e22c0e1a98808eb95b5d6118b0b0a2d46d; elements.session.5=Fe26.2*0*720be6b7fa081d784c37f47ee8a182dc0c8dd9932caa8de372174c42e54e0cf1*w41ttgjXqegCN0oapFUe3w*8EO5lGy3QD_79CZa0E6zJSTNqpTk5owoE_nETaOj-WFSNqCNg4BmTpNW2kbaIQ4tn7QHGlERzgmZUGKHEfSquqQSAZeB-0IH_zH0VljxBEWsmmkoj8T68U2nd1q_eAYzCKWB32BG2g3vyX8bZYhnrlbg30xiO5gKSnQxS5AbDA8*1723708860279*f7470e830875d55979adfcea60d8e4dd83206b04dbdb6553ff76366dfb8f7c7d*HrlETuBYz2Zfopz4ogb5dj15zIVor9N1hKeCzVfnhLM~2; _dd_s=rum=0&expire=1722500165934; __cf_bm=hr7SEmawSa1FPSCf7Hw17509GD0Xx7aCe7Ehn3OI6h8-1722499269-1.0.1.1-6_Oe2mw.zKpn6E2a5zz6H8GqfVMiPrs.v9Tn70KYQyOgcPYpPPJTf.GV3HqeY2LHUZIR4JYE7ZorYd6PshOYQg; _ce.s=v~2f76f03163871556b87c63c025026dfdc3d22779~lcw~1722499266221~lva~1722486379430~vpv~11~v11.fhb~1722419880913~v11.lhb~1722431348970~v11slnt~1722426673202~gtrk.la~lzazl7zi~v11.cs~229985~v11.sla~1722499266221~lcw~1722499266222; _ga_SFZC8HJ4D7=GS1.1.1722499231.23.1.1722499266.25.0.0";
  };
  // cookies for download request
  export const getCSRFToken = () => {
    return "teYkxcRu3l2hBirahp1itguEBjwDwN5pSve2AQvfBLu4r2iLYnNBIdpgMzT-QY64fM8Ftl1oeXx8tQrmECsJaA";
  };
  
  // payload for download request 
  export const getPayload = () => {
    return {
      licenseType: "project",
      projectName: "04digitaltoolsbd",
      searchCorrelationId: "83e4587f-2fc9-4bde-a3c8-a1d34434302f"
    }
  };
  
  // payload for download request 
  
  export const getHeaders =  (url) => {
    const cookie =  getCookie();
    const csrfToken =  getCSRFToken();
    return {
      'Cookie': cookie,
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.9',
      'Content-Type': 'application/json',
      'Origin': 'https://elements.envato.com',
      'Referer': url,
      'Sec-CH-UA': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'Sec-CH-UA-Mobile': '?1',
      'Sec-CH-UA-Platform': '"Android"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
      'X-CSRF-Token': csrfToken,
    }
  };
  