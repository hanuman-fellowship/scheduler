import 'dotenv/config';
import routes from './routes';

const PORT = Number(process.env.PORT) || 3000;

routes.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API listening on port ${PORT}`);
});