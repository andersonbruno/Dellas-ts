import {createConnection, getConnection} from 'typeorm';

const connection = {
  async create(){
    await createConnection();
  },

  async close(){
    await getConnection().close(); 
  },

  async clear(){
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    for (const entity of entities) {
      const repository = await connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName};`);
    }
    
  },
};
export default connection;