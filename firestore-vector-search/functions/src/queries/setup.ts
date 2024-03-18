import {firestoreAdminClient} from '../config';

interface CreateIndexOptions {
  collectionName: string;
  dimension: number;
  projectId: string;
  fieldPath: string;
}

const getParent = (options: CreateIndexOptions) =>
  `projects/${options.projectId}/databases/(default)/collectionGroups/${options.collectionName}`;

const getIndex = (options: CreateIndexOptions) => ({
  queryScope: 'COLLECTION' as const,
  fields: [
    {
      fieldPath: options.fieldPath,
      vectorConfig: {
        dimension: options.dimension,
        flat: {},
      },
    },
  ],
});

export async function createIndex(options: CreateIndexOptions) {
  const result = await firestoreAdminClient.createIndex({
    parent: getParent(options),
    index: getIndex(options),
  });

  console.log(`Index created: ${JSON.stringify(result)}`);
}

export async function checkCreateIndexProgress(indexName: string) {
  const result = await firestoreAdminClient.getIndex({name: indexName});
  console.log(`Index status: ${JSON.stringify(result)}`);
  return result;
}
