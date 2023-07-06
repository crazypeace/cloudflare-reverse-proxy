addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    const url = new URL(request.url);
    //const actualUrlStr = url.pathname.replace("/proxy/","")

    // 如果想把 /proxy/ 当作某种钥匙
    const prefix = "/proxy/";

    // 那么应该判断是否以 /proxy/ 开头
    if (!url.pathname.startsWith(prefix)) {
      return new Response('404', {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
        status: 404
      })
    }

    // 再把 /proxy/ 从字符串的头部去掉
    const actualUrlStr = url.pathname.slice(prefix.length);    
    console.log(actualUrlStr)
  
    const actualUrl = new URL(actualUrlStr)
  
    const modifiedRequest = new Request(actualUrl, {
      headers: request.headers,
      method: request.method,
      body: request.body,
      redirect: 'follow'
    });
  
    const response = await fetch(modifiedRequest);
    const modifiedResponse = new Response(response.body, response);
  
    // 添加允许跨域访问的响应头
    modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
  
    return modifiedResponse;
  }
