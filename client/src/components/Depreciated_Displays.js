// import React from "react";
// import db from "../firebase";

// class Displays extends React.Component {
//   //TODO Break these up into smaller components

//   constructor(props) {
//     super(props);

//     this.state = {
//       display_list: {}
//     };
//   }

//   createNewTemplate() {
//     console.log("here");
//   }

//   addCurrentTemplateToBoard(templateType, templateContents) {
//     const { currentData, selectNewTemplate } = this.props;

//     const displayPath = `/displays/${templateType}`;
//     const newTemplateRef = db
//       .ref(displayPath)
//       .push({ ...templateContents }, e => {
//         const post_id = newTemplateRef.key;

//         //add data to coresponding board
//         const boardPath = `/boards/${currentData.currentLocation}/${
//           currentData.currentBoard
//         }/`;

//         const dataToSet = {
//           display_id: post_id,
//           type: templateType,
//           name: templateType
//         };
//         db.ref(boardPath).push(dataToSet, () => {
//           selectNewTemplate(currentData.currentBoard, templateType, post_id);
//         });
//       });
//   }

//   formatDisplaysTemplates(data) {
//     const { toggleModal } = this.props;
//     const renderObjects = Object.keys(data).map((displayType, index) => {
//       const displayTemplate = data[displayType];

//       const templateItems = Object.keys(displayTemplate).map((temp, index) => {
//         return (
//           <li key={index} className={"display-item"}>
//             {temp}
//           </li>
//         );
//       });

//       const selectedTemplateClass = index === 0 ? "selected-template" : "";

//       return (
//         <div
//           className={`display-template ${selectedTemplateClass}`}
//           onClick={e => {
//             this.addCurrentTemplateToBoard(displayType, displayTemplate);
//             toggleModal();
//           }}
//           key={index}
//         >
//           <h4>{displayType}</h4>
//           <ul>{templateItems}</ul>
//         </div>
//       );
//     });

//     return (
//       <div className="modal-container">
//         <div className="modal-header">
//           <div className="empty" />
//           <div className="modal-header-text">
//             <h2>Display Templates</h2>
//           </div>
//           <div className="modal-button">
//             <button>+</button>
//           </div>
//         </div>
//         <div className="modal-content">{renderObjects}</div>
//       </div>
//     );
//   }

//   openCreateNewDisplayModal() {
//     const { toggleModal } = this.props;

//     const path = `display_list`;
//     db.ref(path).on("value", snapshot => {
//       const display_list = snapshot.val();
//       this.setState({
//         display_list
//       });

//       const display = this.formatDisplaysTemplates(display_list);

//       toggleModal(display);
//     });
//   }

//   render() {
//     const { displays, getDisplayData, currentData } = this.props;
//     const listOfDisplayTypes = Object.keys(displays).map((dbKey, index) => {
//       const selectedClassName =
//         currentData.currentDisplay_id === displays[dbKey].display_id
//           ? "selectedItem"
//           : "";
//       return (
//         <li
//           key={index}
//           className={selectedClassName}
//           onClick={getDisplayData.bind(
//             null,
//             displays[dbKey].type,
//             displays[dbKey].display_id
//           )}
//         >
//           {displays[dbKey].name}
//         </li>
//       );
//     });

//     const displayAddNew = currentData.currentBoard ? (
//       <button onClick={this.openCreateNewDisplayModal.bind(this)}>
//         New Display
//       </button>
//     ) : null;

//     return (
//       <div>
//         <h3>Displays</h3>
//         {displayAddNew}
//         <ul>{listOfDisplayTypes}</ul>
//       </div>
//     );
//   }
// }

// export default Displays;
