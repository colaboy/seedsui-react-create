const proxyMiddleware = require('http-proxy-middleware');
const axios = require('axios');
const querystring = require('querystring');

module.exports = function(app) {
  // 自定义代理
  app.use(proxyMiddleware('/login', {
      target: 'http://172.31.3.232:7050',
      changeOrigin: true,
      pathRewrite: {
        '^/login': ''
      }
    }
  ));
  app.use(proxyMiddleware('/test', {
      target: 'http://172.31.3.232:7050',
      changeOrigin: true,
      pathRewrite: {
        '^/test': ''
      }
    }
  ));
  app.use(proxyMiddleware('/api', {
      target: 'http://172.31.3.232:7050',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  ));
  // 使用axios模拟登录过程,在当前域名下注入cookie
  app.get('/auto/login', (req, resp) => {
    const request = axios.post(
      'http://172.31.3.232:7050/portal/logon.action',
      querystring.stringify({
        "identifiers.src": "waiqin365",
        "identifiers.password": "a111111",
        "refer": "https%3A%2F%2Fcloud.waiqin365.com",
        "identifiers.type": "1",
        "identifiers.tenantname": "cuxiaodms",
        "identifiers.code": "lb"
      })
    )
    request.then((result) => {
      resp.append('Set-Cookie', result.headers['set-cookie']);
      resp.redirect('/#/reportEdit?isFromApp=1');
      // resp.json({success: true, cookie: result.headers['set-cookie']});
    })
  });
};