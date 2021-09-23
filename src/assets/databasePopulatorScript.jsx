import { db } from "../firebase";
import { data } from "./hospitals";
import { Button } from "@material-ui/core";

// Function to print all documents in the firestore "hospital" collection
// This may serve as an example query too
const printHospitals = () => {
  db.collection("hospital")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((docRef) => {
        console.log(docRef.data());
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
};

// Add this component and click it to add documents to firestore
export const Populator = () => {
  return (
    <Button
      onClick={() => {
        data.forEach((hospital) => {
          db.collection("hospitals")
            .add(hospital)
            .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
          console.log(data);
        });
      }}
    >
      Click to add data to firestore
    </Button>
  );
};
