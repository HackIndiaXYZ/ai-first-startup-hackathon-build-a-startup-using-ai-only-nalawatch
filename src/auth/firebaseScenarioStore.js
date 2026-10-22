import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

export function createFirebaseScenarioStore(app) {
  const database = getFirestore(app);

  return {
    listUserScenarios: async (userId) => {
      const snapshot = await getDocs(
        query(collection(database, 'users', userId, 'scenarios'), orderBy('createdAt', 'desc')),
      );
      return snapshot.docs.map((scenarioDocument) => ({
        id: scenarioDocument.id,
        ...scenarioDocument.data(),
      }));
    },
    saveUserScenario: async (userId, title, inputs) =>
      addDoc(collection(database, 'users', userId, 'scenarios'), {
        title: title.slice(0, 60),
        inputs,
        createdAt: serverTimestamp(),
      }),
    deleteUserScenario: (userId, scenarioId) =>
      deleteDoc(doc(database, 'users', userId, 'scenarios', scenarioId)),
  };
}
