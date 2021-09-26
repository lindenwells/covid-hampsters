import { db } from "../firebase";
import { data } from "./bedNumbers";
import { Button } from "@material-ui/core";
import { arrayUnion } from "@firebase/firestore";

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
export const DataPopulator = () => {
  return (
    <Button
      onClick={() => {
        data.forEach((hospital) => {
          delete hospital["Occupied Beds"]
          db.collection("hospitals")
            .doc(hospital._id.toString())
            .set(hospital)
            .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            })
        })
      }}
    >
      Click to add hospital data to firestore
    </Button>
  );
};

export const OccupancyPopulator = () => {
  return (
    <Button
      onClick={() => {
        db.collection("occupancy_data")
          .add(arrayUnion(data))
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          })
      }}
    >
      Click to add occupancy data to firestore
    </Button>
  );
};