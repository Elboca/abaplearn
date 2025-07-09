const fetch = require('node-fetch');

exports.handler = async function(event) {
  const { prompt } = JSON.parse(event.body || '{}');
  const apiKey = process.env.OPENAI_API_KEY;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.5
    }),
  });

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
