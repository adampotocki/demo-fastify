
const { ObjectId } = require('mongodb');

class ProductService {
  constructor(app) {
    if (!app.ready) throw new Error(`can't get .ready from fastify app.`);
    this.app = app;
    const { mongo } = this.app;
    
    if (!mongo) {
      throw new Error('cant get .mongo from fastify app.');
    }

    const db = mongo.db();
    const collection = db.collection('Product');
    this.collection = collection;
  }

  async create({ product }) {   
    const { insertedId } = (await this.collection.insertOne(product));

    const created = await this.getOne({ id: insertedId });

    return created;
  }

  async getAll({ filter = {} }) {
    const products = await this.collection.find(filter).toArray();

    return products;
  }

  async getOne({ id }) {
    const err = new Error();

    if (!id)  {
      err.statusCode = 400;
      err.message = 'id is needed.';
      throw err;
    }
    
    const product = await this.collection.findOne({ _id: ObjectId(id) });

    if (!product) {
      err.statusCode = 400;
      err.message = `can't get the product ${id}.`;
      throw err;
    }

    return product;
  }
}

module.exports = {
  ProductService
};