require('dotenv').config();
const graphql = require('graphql');

// Read values from the environment
const connectionString = process.env.DATABASE_URL;

const pgp = require('pg-promise')();
const db = {}
db.conn = pgp(connectionString);

const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLSchema
} = graphql;

// Define the data type
const TodoType = new GraphQLObjectType({
    name: 'Todo',
    fields: {
       id: {type: GraphQLInt},
       todo: {type: GraphQLString}
    }
})

// Define queries
const RootQuery = new GraphQLObjectType({
    name: 'getTodos',
    fields: {
        getOneTodo: {
            type: TodoType,
            args: { id: { type: GraphQLInt } },
            resolve(parentValue, args) {
                const query = `SELECT * FROM "todos" WHERE id=${args.id}`;
                return db.conn.one(query)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return 'The error is', err;
                });
            },
        },
        getLatestTodo: {
            type: TodoType,
            //args: { id: { type: GraphQLInt } },
            resolve(parentValue) {
                const query = `SELECT id, todo FROM todos ORDER BY id DESC LIMIT 1`;
                return db.conn.one(query)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return 'The error is', err;
                });
            }
        },
        getAllTodos: {
            type: new GraphQLList(TodoType),
            resolve(parentValue) {
                const query = `SELECT * FROM todos`;
                return db.conn.many(query)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return 'The error is', err;
                });
            }
        },
    }
})

const RootMutation = new GraphQLObjectType({
    name: 'addTodo',
    fields: {
        todos: {
        type: TodoType,
        args: { 
            id: {type: GraphQLInt},
            todo: {type: GraphQLString}
        },
        resolve(parentValue, args) {
            const query = `INSERT INTO todos VALUES (DEFAULT, '${args.todo}') RETURNING *`;
            return db.conn.one(query)
             .then(data => {
                return data;
             })
             .catch(err => {
                return 'The error is', err;
             });
            }
       }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})