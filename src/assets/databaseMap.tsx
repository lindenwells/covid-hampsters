import firebase from "../firebase";
import { db } from "../firebase";

export function mapQuery(): Promise<void | firebase.firestore.DocumentData> {
  /*
   * orderBy(firebase.firestore.FieldPath.documentId(), 'desc').limit(1), does not work on v8
   * maybe add date as a field as well?
   */ 
  return db.collection("occupancy_data").orderBy(firebase.firestore.FieldPath.documentId())
    .get()
    .then((querySnapshot) => { // Twice?
      querySnapshot.forEach((docRef) => {
        console.log(docRef.id, " => ", docRef.data());
      });
      return querySnapshot.docs[querySnapshot.docs.length - 1].data();
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
  });
};