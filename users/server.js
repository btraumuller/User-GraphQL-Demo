import express from 'express';

import { createHandler } from 'graphql-http/lib/use/express';
import expressPlayground from 'graphql-playground-middleware-express';

// NOTE: schema needs to be lowecase in order for graphql-http to read it correctly. 
import { schema } from './schema/schema.js';

const app = express();
const graphQLPlayground = expressPlayground.default

app.use('/graphql', createHandler({
    schema
}));

app.get('/playground', graphQLPlayground({ endpoint: '/graphql' }));

app.listen(4000, () => {
    console.log('Server is running');
});