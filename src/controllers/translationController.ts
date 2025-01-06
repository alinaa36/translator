import { IncomingMessage, ServerResponse } from 'http';
import { translateText } from '../services/translationService';

const fs = require('fs');
const path = require('path');

export const translateRoute = (req: IncomingMessage, res: ServerResponse): void => {
  if (req.method === 'POST' && req.url === '/translate') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { text, targetLanguage } = JSON.parse(body);
        const translatedText = await translateText(text, targetLanguage);
        console.log(body); 

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(translatedText);
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(error);
      }
    });
  } else if (req.method === 'POST' && req.url === '/translateFile') {
    const boundary = req.headers['content-type']?.split('boundary=')[1];
    if (!boundary) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid Content-Type header' }));
      return;
    }

    let tempBuffer = Buffer.alloc(0);

    req.on('data', (chunk) => {
      tempBuffer = Buffer.concat([tempBuffer, chunk]);
    });

    req.on('end', async () => {
      const parts = tempBuffer.toString().split(`--${boundary}`).filter((part) => part.trim() !== '--');
      console.log(parts);

      let fileContent = '';
      let textLanguage = '';

      for (let part of parts) {
        if (part.includes('Content-Disposition')) {
          const isFile = part.match(/filename="(.+?)"/);
          if (isFile) {
            fileContent = part.split('\r\n\r\n')[1].split('\r\n--')[0].trim();
          } else {
            const fieldMatch = part.match(/name="(.+?)"/);
            if (fieldMatch) {
              const fieldName = fieldMatch[1];
              const fieldValue = part.split('\r\n\r\n')[1]?.split('\r\n')[0]?.trim();
              if (fieldName === 'textLanguage') {
                textLanguage = fieldValue;
                
              }
            }
          }
        }
      }

      if (!fileContent || !textLanguage) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing file or text language field' }));
        return;
      }

      try {
        const translatedText = await translateText(fileContent, textLanguage);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(translatedText);
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/translateToFile') {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
  
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
  
    req.on('end', async () => {
      try {
        const { text, targetLanguage } = JSON.parse(body);
        const translatedText = await translateText(text, targetLanguage);

        console.log(translatedText);
  
        const fileName = `translated-${Date.now()}.txt`;
        const filePath = path.join(uploadDir, fileName);
  
        // Запис перекладеного тексту у файл
        fs.writeFileSync(filePath, translatedText);
  
        // Відправляємо клієнту відповідь
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            message: 'File uploaded successfully!',
            fileName,
            filePath,
          }),
        );
      } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'An error occurred during translation' }));
      }
    });
  
    req.on('error', (err) => {
      console.error(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'An error occurred during file upload' }));
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
};


