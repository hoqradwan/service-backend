// cookies for download request
export const getCookie = () => {
  return "envato_client_id=fef508f9-3f6a-4cde-a5c8-8ed5a4e84013; _ce.clock_data=-46%2C180.148.213.24%2C1%2C362d7fe3d8b2581bffa359f0eeda7106%2CChrome%2CBD; _ce.irv=returning; cebs=1; _gcl_gs=2.1.k1$i1722424960; __cf_bm=FnrUvjmGP2TSnzyL2iE_DVlekEVtfxpVqfSxAc7bkWU-1722425199-1.0.1.1-0itW_cWJJKt450jSqdOypCCqAfVihvpAwvHend2ZPu462eo2s3PxA4bc292BKGwXqWNnMQOQhRRvN6FFLoFgHw; _cfuvid=9xNOMKNQqLxBYD3rnPAhP2Ae9ZgD1k3w_kotG0mFCUc-1722425199564-0.0.1.1-604800000; _gcl_aw=GCL.1722425216.Cj0KCQjwwae1BhC_ARIsAK4JfrxKTXOE0kZj47mtXGz3SDpYRvg6lEqXKcOs83LN4do8oItdLJgIMooaAhycEALw_wcB; _rdt_uuid=1722182354315.52f8ed0d-87d0-4f43-a165-a9f141748e0b; _uetsid=5685b7504cfa11ef81225ff85d1ffbf0; _uetvid=5685d7704cfa11ef8ba73dc9f75a5646; cebsp_=9; _elements_session_4=eFNORUM5Z3JKL2JucFdldXpFb29MbVQya2gxaDZzMzZ0NUdqckZEV0czbGNOUTBSclpxc0FabEhOSXZJbTJXYmhub3l1NE8xS1g4UURERUxWYkt0eE9RdmN5cHlDaWtuMnFUcVBYRzJLbVBCTWM0MjBDc1FYMFdSMTFTRzFIbXVBTXVjc3A1TFlOZmhMNFVoSDNmblVQYmlZODNpRTM0c2phVnRSeHpPYzN5KzNDakVKZFBhZ2VLd2FtQzVTd3pjSnhxamxIQjVyRWxRY0FnVjdVRkFHTnNFakwzODFqa0o2QlBkNlhzakVRZDRvVklVVExVWGc5VndGRzZXMElEV3BqcGxXR2ZPWitRZ29ja0VYSUxhMVBMUE9jY2VIdmpXZkh2RGhkT0VXaTBwZ2p6RWYzWktoQUFUN3pDdTNKKzBFWjc5WXRhSzhYSTZHQ0VUMmZnNGJwRkZ0QmpTbzVrL3J0NFV6a0xlYW03ei9VbmJQOGZMYjY1SDd6dWgxSHlHODlVVzhtSFhNOCtJMGxmMGU2Q0w2Zz09LS04NVNXMk44K1dlSGRoNlVuQmUvUkNRPT0%3D--6e8f644450f8621f497f404149cc0bcca258bb09; elements.session.5=Fe26.2*0*df4a638574b95e06d0892108081bc9a04dcba479a7931837f589491df3f84586*Gneh8JefWwvElHLxc-pYwg*K1xZNusb138rh6U4nezZljzkERe-80LtN5bG6ibOF8ctkjkgf1sA8Mg8yUkH28AT4wdKvIhBkEskdl2BEWk1aJT2oHa8er-n2MPBlFXhp9utc0_Cj27N__aI7URJscFi725JZugRnLhodBIZ8YG4Un816dK8-9Reqe0vvMt9Cpk*1723636313626*1ff931d922f2de3ae744230471861a81fdf3434aae1bb6cff78b0086c0fa5ef9*N-AgL91ogXfAhvYneUMEttkfqaCNAtN9hMr_fn9G92Y~2; __cf_bm=iIwY59IYVyB9j0XGD4.UcmY0M0jUQd_7AchrfkZIeiQ-1722426714-1.0.1.1-BDnK2gGV.eDamZZKOzuvB7gzadxIbTdy_pnR_wKfdaQP.vaD6uYDIsk.BDdwJO__nuGzmCCe7EwfnrmTp6k01g; _dd_s=rum=0&expire=1722427624818; _ce.s=v~2f76f03163871556b87c63c025026dfdc3d22779~lcw~1722426724907~lva~1722421003766~vpv~10~v11.fhb~1722419880913~v11.lhb~1722426708969~gtrk.la~lz9seer0~v11.cs~229985~v11.s~352e2ad0-4f2f-11ef-a8bd-ad62a3e471b6~v11.sla~1722426724907~v11slnt~1722426673202~v11.send~1722426679258~lcw~1722426724908; _ga_SFZC8HJ4D7=GS1.1.1722424606.18.1.1722426724.1.0.0";
};
// cookies for download request
export const getCSRFToken = () => {
  return "8MCzJGeWxTd874YnhWmRkUm7v6dOcuHLdGU8cdEcT4D6KoB7hbuphxeYRRnEEp_VibtCtHsrVBqDQCNL5D6k7Q";
};

// payload for download request 
export const getPayload = () => {
  return {
    licenseType: "project",
    projectName: "04digitaltoolsbd",
    searchCorrelationId: "61964461-3f5c-4eeb-85f7-2548bd03a97c"
  }
};

// payload for download request 

export const getHeaders = async (url) => {
  const cookie = await getCookie();
  const csrfToken = await getCSRFToken();
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
