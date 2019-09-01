import React, { useContext, useEffect } from 'react';
import { AnnotationCalloutCircle } from 'react-annotation';
import TypesUI  from '../components/annotations/Types';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { muiTheme } from "../components/annotations/Theme";

var ExtensionContext = window.TableauExtension['contexts']['ExtensionContext'];
const CheckItem = window.TableauExtension['components']['CheckItem'];

const options = {
  ignoreAliases: false,
  ignoreSelection: true,
  maxRows: 0
};

const Viz = (props) => {
  const contextValue = useContext(ExtensionContext);

  const extensionName = window.name;
  const extensionParent = window.parent;
  const extensionZoneId = window.name.substring(window.name.lastIndexOf("_")+1)
  console.log('window', window.TableauExtension['components'], window, extensionName, extensionParent, extensionZoneId, contextValue.config);
  // this goes across iframe to parent and triggers a CORS error
  // extensionParent.document.getElementById("tabZoneId" + extensionZoneId).style.pointerEvents = 'none');


  // annotation callbacks from hierarchy example
  /*
  editAnnotationCallBack = () => {
    console.log('edit annotations enabled');
    if ((this.state.tableauSettings || {}).clickAnnotations) {
      const newAnnotations = JSON.parse(this.state.tableauSettings.clickAnnotations);
      newAnnotations.map(d => {
        d.editMode = !d.editMode
      })

      console.log('editable annotations', newAnnotations);

      if (TableauSettings.ShouldUse) {
        TableauSettings.updateAndSave({
          // ['is' + field]: true,
          clickAnnotations: JSON.stringify(newAnnotations),
        }, settings => {
          this.setState({
            tableauSettings: settings,
          });
        });
    
      } else {
        tableauExt.settings.set('clickAnnotations', JSON.stringify(newAnnotations));
        tableauExt.settings.saveAsync().then(() => {
          this.setState({
            tableauSettings: tableauExt.settings.getAll()
          });
        });
      }
    }
  }

  annotationDragCallBack = annotationInfo => {
    if ((this.state.tableauSettings || {}).clickAnnotations) {
      const newAnnotations = JSON.parse(this.state.tableauSettings.clickAnnotations);
      newAnnotations.map(d => {
        if (annotationInfo.originalSettings.annotationID === d.annotationID) {
          d.dx = annotationInfo.updatedSettings.dx;
          d.dy = annotationInfo.updatedSettings.dy;
          d.radius = annotationInfo.updatedSettings.radius;
          d.height = annotationInfo.updatedSettings.height;
          d.width = annotationInfo.updatedSettings.width;
        }
      })
      
      console.log('annotation drag ended', annotationInfo, newAnnotations);
      if (TableauSettings.ShouldUse) {
        TableauSettings.updateAndSave({
          clickAnnotations: JSON.stringify(newAnnotations),
        }, settings => {
          this.setState({
            tableauSettings: settings,
          });
        });
    
      } else {
        tableauExt.settings.set('clickAnnotations', JSON.stringify(newAnnotations));
        tableauExt.settings.saveAsync().then(() => {
          this.setState({
            tableauSettings: tableauExt.settings.getAll()
          });
        });
      }
    }
  }
  */

  const getSummaryData = () => {
    let sheetObject = contextValue.sheetNames.find(worksheet => worksheet.name === contextValue.tableauSettings.selectedSheet1);

    //working here on pulling out summmary data
    //may want to limit to a single row when getting column names
    sheetObject.getSummaryDataAsync(options).then(data => {
      // Use data
      console.log(data);
    })
  }

  useEffect(() => {
    // Get summary data when tableauSettings are available
    if (Object.keys(contextValue.tableauSettings).length > 0) {
      getSummaryData()
    }
  });

  return (
    <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
      <div>
        <ExtensionContext.Consumer>
          {
            ({tableauExt}) => {
              return (
                <React.Fragment>
                  {/* <TypesUI /> */}
                  <CheckItem
                    checked={false}
                    onChange={(e) => console.log({checked: e.target.checked})}
                  >
                    Toggle Add Annotations
                  </CheckItem>
                  <br/>
                  <svg
                    height={1000}
                    width={1000}
                    onClick={props.onConfig}
                  >
                    <AnnotationCalloutCircle
                      x={100}
                      y={100}
                      dy={117}
                      dx={162}
                      color={"#9610ff"}
                      editMode={true}
                      note={{"title":"Annotations :)",
                        "label":"Longer text to show text wrapping",
                        "lineType":"horizontal"}}
                      subject={{"radius":50,"radiusPadding":5}}
                      events={{
                        // we can use this event to handle when the annotation is clicked
                        // and then when clicked we can update the annotation vs create a new one
                        onClick: (props, state, event) => {
                          console.log('annotation onClick event', props, state, event)
                        }
                      }}
                      onDragStart={props.onConfigDisable}
                      onDragEnd={props.onConfigEnable}
                    />
                  </svg>
                  </React.Fragment>
                );
              }
            }              
        </ExtensionContext.Consumer>
      </div>
    </MuiThemeProvider>
  )
};

export default Viz;