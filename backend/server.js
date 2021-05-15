var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
 
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(3001);
console.log('Running a GraphQL API server at http://localhost:3001/graphql');