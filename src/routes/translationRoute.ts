import { IncomingMessage, ServerResponse } from 'http';
import { translateRoute } from '../controllers/translationController';


export const translateRoutes = (req: IncomingMessage, res: ServerResponse): void => {
  if (req.url === '/translate' && req.method === 'POST') {
    translateRoute(req, res);
  } else if (req.url === '/translateFile' && req.method === 'POST') {
    translateRoute(req, res);
  } else if (req.url === '/translateToFile' && req.method === 'POST') {
    translateRoute(req, res);
  }
};
