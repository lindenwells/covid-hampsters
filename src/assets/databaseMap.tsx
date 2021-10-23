import firebase from "../firebase";
import { db } from "../firebase";

/* Gets the occupancy data from hospitals in Firebase */
export function mapQuery(): Promise<void | firebase.firestore.DocumentData> {
  /*
   * orderBy(firebase.firestore.FieldPath.documentId(), 'desc').limit(1), does not work on v8
   * maybe add date as a field as well?
   */ 
  return db.collection("occupancy_data").orderBy(firebase.firestore.FieldPath.documentId())
    .get()
    .then((querySnapshot) => { // Twice?
      console.log("getting map data");
      return querySnapshot.docs[querySnapshot.docs.length - 1].data();
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
  });
};

/* Gets the occupancy data from hospitals in Firebase */
export function graphQuery(): Promise<void | firebase.firestore.DocumentData> {
  /*
   * orderBy(firebase.firestore.FieldPath.documentId(), 'desc').limit(1), does not work on v8
   * maybe add date as a field as well?
   */ 
  return db.collection("occupancy_data")
    .orderBy(firebase.firestore.FieldPath.documentId())
    .get()
    .then((querySnapshot) => { // Twice?
      console.log("getting graph data");
      return querySnapshot.docs;
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
  });
};