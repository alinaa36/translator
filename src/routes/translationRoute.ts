import { IncomingMessage, ServerResponse } from 'http';
import { translate, translateFile, translateToFile } from '../controllers/translationController';

const postRoutes = {
  '/translate': (req:IncomingMessage, res:ServerResponse) => translate(req, res),
  '/translateFile': (req:IncomingMessage, res:ServerResponse) => translateFile(req, res),
  '/translateToFile': (req:IncomingMessage, res:ServerResponse) => translateToFile(req, res),
};

export const translateRoutes = (req: IncomingMessage, res: ServerResponse): void => {

  if (req.method === 'POST') {
    const route = postRoutes[req.url as keyof typeof postRoutes]; 

    if (route) {
      route(req, res); 
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Маршрут не знайдено' }));
    }
  }
};

