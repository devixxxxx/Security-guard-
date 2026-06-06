import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/generate', async (req, res) => {
    try {
      const { prompt, systemPrompt, model } = req.body;
      const apiKey = process.env.OPENROUTER_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: 'OpenRouter API Key is missing. Please add it in AI Studio settings (OPENROUTER_API_KEY).' });
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'https://ai.studio',
          'X-Title': 'Guard English AI',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model || 'z-ai/glm-4.5-air:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter error:', errorText);
        return res.status(response.status).json({ error: 'Failed to generate response from OpenRouter.' });
      }

      const data = await response.json();
      return res.json({ result: data.choices[0].message.content });
    } catch (error) {
      console.error('API /generate error:', error);
      res.status(500).json({ error: 'Internal server error while processing the request.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
