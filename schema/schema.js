const graphql = require('graphql');
const Song = require('../models/song');
const Artist = require('../models/artist');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const SongType = new GraphQLObjectType({
    name: 'Song',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        kudos: { type: GraphQLInt },
        artist: {
            type: ArtistType,
            resolve(parent, args){
                return Artist.findById(parent.artistId);
            }
        }
    })
});

const ArtistType = new GraphQLObjectType({
    name: 'Artist',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        songs: {
            type: new GraphQLList(SongType),
            resolve(parent, args){
                return Song.find({ artistId: parent.id });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        song: {
            type: SongType,
            description: "Returns the song requested (via ID)",
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Song.findById(args.id);
            }
        },
        artist: {
            type: ArtistType,
            description: "Returns the artist requested (via ID)",
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Artist.findById(args.id);
            }
        },
        songs: {
            type: new GraphQLList(SongType),
            description: "Returns all the songs in the DB",
            resolve(parent, args){
                return Song.find({});
            }
        },
        artists: {
            type: new GraphQLList(ArtistType),
            description: "Returns all the artists in the DB",
            resolve(parent, args){
                return Artist.find({}).sort('name');
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addArtist: {
            type: ArtistType,
            description: "Add the artist",
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args){
                let artist = new Artist({
                    name: args.name,
                    age: args.age
                });
                return artist.save();
            }
        },
        addSong: {
            type: SongType,
            description: "Add a song",
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                artistId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let song = new Song({
                    name: args.name,
                    genre: args.genre,
                    artistId: args.artistId,
                    kudos: 0
                });
                return song.save();
            }
        },
        increaseKudos: {
            type: SongType,
            description: "Give kudos (increase them by one) for a song",
            args: {
                songId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                Song.findById(args.songId, (err, song) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        song.kudos = song.kudos + 1;
                        return song.save()
                    }
                })
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
