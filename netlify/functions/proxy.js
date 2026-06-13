const https = require('https');

exports.handler = async function(event) {
  const body = event.body;
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': JSON.parse(body).apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'mcp-client-2025-04-04'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: 200,
        headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        body: data
      }));
    });

    req.on('error', e => resolve({statusCode: 500, body: JSON.stringify({error: e.message})}));
    const b = JSON.parse(body);
    delete b.apiKey;
    req.write(JSON.stringify(b));
    req.end();
  });
};
