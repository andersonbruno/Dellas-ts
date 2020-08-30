import { getConnection, getRepository } from 'typeorm';

export default async () => {

    const entities = getConnection().entityMetadatas;

    return Promise.all(
        entities.map(entity => {
            const repository = getRepository(entity.name);
            return repository.clear();
        })
    )

}