import React from "react";
import { connect } from "react-redux";
import { getData, setDisplayData } from "../../actions";
import RenderDisplayComponent from "../RenderDisplayComponent";
import ChooseDisplays from "./ChooseDisplays";
import db from "../../firebase";
import DisplayListOfDisplays from "../DisplayComponents/DisplayListOfDisplays";
import { formatToMiliSeconds, capitalizeFirstLetters } from "../../helpers";

class EditTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      template: {},
      escapeRoomsListOpen: false,
      prev_ids: []
    };
  }

  componentDidMount() {
    if (!Object.keys(this.props.dbData).length) {
      this.props.getData();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      template: { ...nextProps.selectedTemplate }
    });
  }

  toggleEscapeRoomsList() {
    const { escapeRoomsListOpen } = this.state;
    this.setState({
      escapeRoomsListOpen: !escapeRoomsListOpen
    });
  }

  onInputChange(e) {
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      template: { ...this.state.template, [name]: value }
    });
  }
  onIntervalChange(e) {
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      template: { ...this.state.template, [name]: formatToMiliSeconds(value) }
    });
  }

  emptyInputOnFocus(e) {
    const { template } = this.state;
    const { name } = e.target;
    if (
      template[name] === "<template>" ||
      template[name] === "My New Template"
    ) {
      this.setState({
        ...this.state,
        template: { ...this.state.template, [name]: "" }
      });
    }
  }

  closeEdit(e) {
    const { slideAnim } = this.props;
    this.setState(
      {
        ...this.state,
        template: {},
        escapeRoomsListOpen: false,
        prev_ids: []
      },
      () => {
        slideAnim();
      }
    );
  }

  addDisplaysToTemplate(list_of_displays, list_of_ids) {
    if (!list_of_ids) {
      list_of_ids = this.state.prev_ids;
    }

    if (this.state.template.type === "escape-room-list") {
      this.setState({
        ...this.state,
        escapeRoomsListOpen: false,
        template: { ...this.state.template, list_of_displays },
        prev_ids: list_of_ids
      });
    } else if (this.state.template.type === "carousel") {
      this.setState({
        ...this.state,
        escapeRoomsListOpen: false,
        template: {
          ...this.state.template,
          carousel_displays: list_of_displays
        },
        prev_ids: list_of_ids
      });
    }
  }

  updateCurrentDisplay() {
    const { currentSelection, currentAvailDisplays } = this.state;
    const { location, board } = this.props.match.params;
    if (Object.keys(currentSelection).length) {
      const setAsAvailableDisplay = {
        ...currentAvailDisplays,
        [currentSelection.display_id]: true
      };
      const setAsCurrentDisplay = {
        display_id: currentSelection.display_id,
        name: currentSelection.displayData.name,
        type: currentSelection.displayData.type
      };
      const availPath = `/boards/${location}/${board}/available_displays`; //push
      const currPath = `/boards/${location}/${board}/current_display`; //set

      db.ref(availPath).update(setAsAvailableDisplay, () => {
        db.ref(currPath).set(setAsCurrentDisplay, () => {
          this.setState(
            {
              displayOnTV: setAsCurrentDisplay
            },
            () => {
              this.props.setDisplayData(currentSelection.displayData);
              this.goBackToPrevPage();
            }
          );
        });
      });
    }
  }

  submitTemplate(e) {
    //add template to options
    //take you back to /admin/home/Reno/lobby/add-new/display
    //and make sure the new template is displayed
    const { template } = this.state;
    const { dbData } = this.props;
    const { location, board } = this.props.match.params;

    const currentAvailDisplays = dbData[location][board].available_displays;

    const newDisplay = db.ref(`/displays`).push(template, snapshot => {
      const display_id = newDisplay.getKey();

      const setAsAvailableDisplay = {
        ...currentAvailDisplays,
        [display_id]: true
      };
      const setAsCurrentDisplay = {
        display_id: display_id,
        name: template.name,
        type: template.type
      };
      const availPath = `/boards/${location}/${board}/available_displays`; //push
      const currPath = `/boards/${location}/${board}/current_display`; //set

      db.ref(availPath).update(setAsAvailableDisplay, () => {
        db.ref(currPath).set(setAsCurrentDisplay, () => {
          this.props.setDisplayData(template);
          this.props.history.push(`/admin/home/${location}/${board}`);
        });
      });
    });
  }

  render() {
    const { template, escapeRoomsListOpen, prev_ids } = this.state;
    const { aCLS, aCRS, positionEnd, selectedTemplate } = this.props;

    if (Object.keys(selectedTemplate).length) {
      var renderTemplateEdit = Object.keys(selectedTemplate).map(
        (item, index) => {
          const value = template[item] !== "<template>" ? template[item] : "";

          const itemName = item === "background_img" ? "Backgound Image" : item;

          var inputCont = null;
          switch (item) {
            case "type":
              break;
            case "name":
              break;
            case "interval":
              inputCont = (
                <li className={`template-edit item ${item}`} key={index}>
                  <p>Timing Interval:</p>
                  <div className="template-edit input-container">
                    <input
                      className="template-edit interval"
                      onFocus={e => this.emptyInputOnFocus(e)}
                      onChange={e => this.onInputChange(e)}
                      type="text"
                      name={item}
                      value={value}
                      placeholder="#"
                    />
                    <span> Seconds</span>
                  </div>
                </li>
              );
              break;
            case "list_of_displays":
            case "carousel_displays":
              inputCont = (
                <li key={index} className={`template-edit item ${item}`}>
                  <DisplayListOfDisplays
                    {...this.props}
                    currentData={template}
                    currentDisplay={{}}
                    submitTemps={this.addDisplaysToTemplate.bind(this)}
                    isTemplate={true}
                  />
                  <button
                    onClick={e => this.toggleEscapeRoomsList(e)}
                    className="standard-button template-edit escape-room"
                  >
                    Add Escape Rooms
                  </button>
                </li>
              );
              break;
            case "content":
              inputCont = (
                <li key={index} className={`template-edit item ${item}`}>
                  <p>{capitalizeFirstLetters(item)}:</p>

                  <div className="text-area-wrap">
                    <div className="text-area-pull-tab" />
                    <textarea
                      onFocus={e => this.emptyInputOnFocus(e)}
                      rows="7"
                      cols="40"
                      onChange={e => this.onInputChange(e)}
                      type="text"
                      name={item}
                      placeholder="Describe the Escape Room"
                      value={value}
                    />
                  </div>
                </li>
              );
              break;

            default:
              const placeholderKey = {
                background_img: "Image URL",
                image: "Image URL",
                video: "Video URL"
              };

              const placeHolder = placeholderKey[item]
                ? placeholderKey[item]
                : `${capitalizeFirstLetters(itemName)}`;

              inputCont = (
                <li className={`template-edit item ${item}`} key={index}>
                  <p>{capitalizeFirstLetters(itemName)}:</p>
                  <input
                    onFocus={e => this.emptyInputOnFocus(e)}
                    onChange={e => this.onInputChange(e)}
                    type="text"
                    name={item}
                    value={value}
                    placeholder={`${placeHolder}`}
                  />
                </li>
              );
              break;
          }
          return inputCont;
        }
      );
    }

    const prevTemplate = prev_ids.length ? prev_ids : null;
    const renderEscapeRoomList = escapeRoomsListOpen ? (
      <ChooseDisplays
        toggleEscapeRoomsList={this.toggleEscapeRoomsList.bind(this)}
        prevDisplays={prevTemplate}
        submit={this.addDisplaysToTemplate.bind(this)}
      />
    ) : null;

    return (
      <div className={`template-edit container ${aCLS || aCRS} ${positionEnd}`}>
        <div className="template-edit top">
          <h1>Create a New Board</h1>
        </div>
        <div className="template-edit bottom">
          <div className="template-edit list-box">
            <div className="template-edit header">
              <h4>Please Add Your Content</h4>
            </div>
            <ul className="template-edit list">
              <li className={`template-edit item template-name`}>
                <p>Please enter a name for your new template:</p>
                <input
                  onFocus={e => this.emptyInputOnFocus(e)}
                  onChange={e => this.onInputChange(e)}
                  type="text"
                  name="name"
                  value={template.name}
                  placeholder="Enter a Name"
                />
              </li>
              {renderEscapeRoomList}
              {renderTemplateEdit}
            </ul>
            <div className="template-edit button-box">
              <button
                className="template-edit create-template standard-button"
                onClick={e => {
                  this.submitTemplate(e);
                }}
              >
                Add New Display
              </button>
              <button
                className="template-edit delete-button"
                onClick={e => {
                  this.closeEdit(e);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="template-edit live-display">
            <h4 className="template-edit header">Live Preview</h4>
            <RenderDisplayComponent currentDisplayData={template} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dbData: state.data.dbData
  };
}

export default connect(
  mapStateToProps,
  { getData, setDisplayData }
)(EditTemplate);
