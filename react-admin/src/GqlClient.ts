import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";

class GqlClient extends ApolloClient<NormalizedCacheObject>
{
    private static _instance: GqlClient;

    private constructor(options) {
        super(options)
    }

    public static get Instance() {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this({
            uri: 'http://localhost:3000/graphql',
            cache: new InMemoryCache()
        }));
    }
}
export const gqlClient = GqlClient.Instance as ApolloClient<NormalizedCacheObject>;



// class GqlClient extends ApolloClient<NormalizedCacheObject> {
//     private static _instance: ApolloClient<NormalizedCacheObject> = new GqlClient({
//         uri: 'http://localhost:3000/graphql',
//         cache: new InMemoryCache()
//     });

//       constructor(options) {
//           super(options)
//           if(GqlClient._instance) {
//               throw new Error('Error: Instantiation failed: Use GqlClient.getInstance() instead of new.');
//           }

        //   this._instance = new GqlClient({
        //     uri: 'http://localhost:3000/graphql',
        //     cache: new InMemoryCache()
        // });    

//           GqlClient._instance = this;
//       }

//       public static getInstance()
//       {
//         return GqlClient._instance;
//       }
//   }

//   export default GqlClient.getInstance();