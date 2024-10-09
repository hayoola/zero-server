
import http from 'http';
import { createClient } from 'redis';

const PORT = 3000;


try {
  const server = await bootstrap();
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });

} catch( err ) {

  console.error( `A Fatal error occured: ${err}`);
}







async function bootstrap() {

  let server = null;

  const redisClient = await connectToRedisServer();
  await prepopulatePrompts(redisClient);
  server = setupHTTPServer( redisClient);

  return server;
}




async function connectToRedisServer() {

  let redisClient = createClient({
    url: 'redis://redis:6379'
  });

  try {
    
    await redisClient.connect();
    console.log('Connected to Redis at host: redis');
  
  } catch (err) {
    throw new Error(`Redis connection error: ${err}`)
  }

  return redisClient;
}



async function prepopulatePrompts(redisClient) {
  
  const prompts = [
    'Welcome to the About Zero!', 
    'Dev Containers are cool!', 
    'Here is a new prompt for you!'
  ];
  
  try {
    
    const exists = await redisClient.exists('prompts');

    if( !exists ) {
      
      console.log('Populating prompts list for the first time...');
      
      for (let prompt of prompts) {
        await redisClient.rPush('prompts', prompt);
      }

      console.log('Prompts list populated.');
    
    } else {

      console.log('Prompts list already exists. Skipping population.');
    }
    
   
  } catch (error) {
    
    console.error('Error prepopulating prompts:', error);
  }
}



function setupHTTPServer( redisClient ) {

  return http.createServer(async (req, res) => {
  
    res.setHeader('Content-Type', 'text/plain');
  
    if (req.method === 'GET' && req.url === '/') {
      
      res.statusCode = 200;
      res.end('Hello, World!');
    } else if (req.method === 'GET' && req.url === '/about') {
      
      try {
        const listLength = await redisClient.lLen('prompts');
        if (listLength > 0) {
          const randomIndex = Math.floor(Math.random() * listLength);
          const prompt = await redisClient.lIndex('prompts', randomIndex); 
          res.statusCode = 200;
          res.end(prompt || 'No prompt available!');
        } else {
          res.statusCode = 200;
          res.end('No prompts available!');
        }
      
      } catch (error) {
        console.log(`Redis Error: ${error}`)
        res.statusCode = 500;
        res.end('Error fetching prompt from Redis');
      }
    } else {
      
      res.statusCode = 404;
      res.end('404 Not Found');
    }
  });
}