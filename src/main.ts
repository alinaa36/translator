import { createServer, IncomingMessage, ServerResponse } from 'http';
import { translateRoutes } from './routes/translationRoute';

const PORT = 3000;

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  translateRoutes(req, res);
};

const server = createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
