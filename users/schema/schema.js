import {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInt, 
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';

import axios from 'axios';

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    // When two objects are related to each other, we need to use a function to define the fields. 
    //This will tell graphql to wait until all fo the file is loaded.
    fields: () => ({
        id: {type: GraphQLString},
        name:{type: GraphQLString} ,
        description:{type: GraphQLString},
        users:{
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(res => res.data);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString},
        firstName:{type: GraphQLString} ,
        age:{type: GraphQLInt},
        // company connects the user to the companies object type
        company:{
            type: CompanyType,
            // reolve function is used to find the specific information that we want to return, in this case the id. 
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(res => res.data);
            }
        }
    }),

});




// create new instance of GraphQLObjectType called RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        // user is the name of the query
        user: {
            //type is the defintion of the query
            type: UserType,
            // args is the arguments that the query accepts
            args:{
                // these are the parameters that I need in order to give you a user
                id: {type: GraphQLString}
            },
            // resolve is the function that will be called when the query is executed to get the result that you want
            resolve(parentValue, args){
                // returns a raw Javascript object
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(res => res.data);
            } 
        },
        company:{
            type: CompanyType,
            args:{
                id: {type: GraphQLString}
            },
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(res => res.data);
            }
        } 
    }
});

const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addUser:{
            type: UserType,
            args:{
                firstName: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                companyId: {type: GraphQLString}
            },
            resolve(parentValue, {firstName, age}){
                return axios.post('http://localhost:3000/users', {firstName, age}).then(res => res.data);
            }
        },
        deleteUser:{
            type: UserType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentVlaue, {id}){
                return axios.delete(`http://localhost:3000/users/${id}`).then(res => res.data);
            }
        },
        editUser:{
            type: UserType,
            args:{
                firstName: {type: GraphQLString},
                companyId: {type: GraphQLString},
                age: {type: GraphQLInt},
                id: {type: new GraphQLNonNull(GraphQLString)} 
            },
            // You can pass in the entire args object above into the resolver if all fields are needed
            resolve(parentValue, args){
                return axios.patch(`http://localhost:3000/users/${id}`, args).then(res => res.data);
            }
        }
    }
})
// we will export the schema 
export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation
});