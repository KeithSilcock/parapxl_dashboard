import React from "react";
import db from "./firebase";

class DatabaseTest extends React.Component {
  render() {
    const testDispRef = db.ref("/displays");
    const testLocRef = db.ref("/locations");
    const testLocListRef = db.ref("/location_list");

    testDispRef.on("value", snapshot => {
      console.log(snapshot.val());
    });

    testLocRef.on("value", snapshot => {
      console.log(snapshot.val());
    });

    //get the name of the location you want to view
    testLocListRef.on("value", snapshot => {
      console.log(snapshot.val());
    });

    return (
      <div>
        <h1>database test! </h1>
      </div>
    );
  }
}

export default DatabaseTest;
