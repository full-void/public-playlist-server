const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config()

const app = express();

// allow cross-origin requests
app.use(cors());

// connect with the db
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(connect => console.log('Connected to MongoDB'))
    .catch(e => console.log('The Database URL: ', process.env.DATABASE_URL, '\nCouldn\'t connect to the Database. Error: \n', e))

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(process.env.PORT, { callback: () =>
{
    console.log("Database URL: ", process.env.DATABASE_URL)
    console.log(`Now listening for requests on port ${process.env.PORT}`);
}
});
