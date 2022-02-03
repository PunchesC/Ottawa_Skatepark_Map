import { MongoClient } from 'mongodb';

const uri =
  'mongodb+srv://admin:r@jkq6a-NckabEb@mapcluster.frt9m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

if (!uri) {
  console.error('ERROR: Missing environment variable mongodb.uri.');
}

let client;

async function getClient() {
  if (!client || !client.isConnected()) {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((e) => {
      console.log('HI');
    });
    console.debug('DB CLIENT RECONNECTED');
  }

  return client;
}

export default getClient;
