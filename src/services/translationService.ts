import { request } from 'https';

const API_KEY = 'AIzaSyB1_ZkNIf7MhqDCetPE2bQMv764YTGw6Vs';

export const translateText = (text: string, targetLanguage: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!text || !targetLanguage) {
      reject('Text and targetLanguage are required');
    }

    const postData = JSON.stringify({
      q: text,
      target: targetLanguage,
    });

    const options = {
      hostname: 'translation.googleapis.com',
      path: `/language/translate/v2?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk.toString();
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          const translatedText = parsedData.data.translations[0].translatedText;
          resolve(translatedText);
        } catch (error) {
          reject('Error parsing response: ' + error);
        }
      });
    });

    req.on('error', (e) => {
      reject(`Request failed: ${e.message}`);
    });

    req.write(postData);
    req.end();
  });
};
