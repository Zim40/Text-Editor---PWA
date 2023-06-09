import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  try {
    const jateDB = await openDB('jate', 1);
    const tx = jateDB.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');
    const request = store.add({content: content});
    const result = request;
    console.log('🚀 Text Saved!');
  } catch (err) {
    console.error("putDb not implemented");
  }
};
// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  try {
    const jateDB = await openDB('jate', 1);
    const tx = jateDB.transaction('jate', 'readonly');
    const store = tx.objectStore('jate');
    const request = store.getAll();
    const result = await request;
    console.log('Data Retrieved!');
  } catch (err) {
    console.error('getDb not implemented');
  }
}

initdb();
