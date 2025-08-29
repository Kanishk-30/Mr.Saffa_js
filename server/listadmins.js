const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://mrsaffa01:Saffabase2330@cluster0.crmo7r1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const admins = await client.db('<dbName>').collection('admins').find({}).toArray();
  console.log('Existing admins:', admins);
  await client.close();
})();