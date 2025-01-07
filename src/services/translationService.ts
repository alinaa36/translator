import fetch from 'node-fetch'; 
import 'dotenv/config'; 

console.log(process.env.GOOGLE_API_KEY);

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  const API_KEY = process.env.GOOGLE_API_KEY;
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;  

  const postData = {
    q: text,
    target: targetLanguage,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const translatedText = json.data.translations[0].translatedText;
    return translatedText;
  } catch (error) {
    console.error(error);
    throw new Error('Translation failed');
  }
};
