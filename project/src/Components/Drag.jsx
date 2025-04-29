import React, { useState, useRef, useEffect } from 'react';
import './Drag.css'; // Assuming you add some CSS for styling
import { FaTrash } from 'react-icons/fa'; // Import trash icon
import { FaTimes } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa'; // Add this import
import { FaUpload } from 'react-icons/fa'; // Add upload icon import
import { FaFile } from 'react-icons/fa'; // Add file icon import
import { useNavigate, useParams, useLocation } from "react-router-dom";



// DraggableItem component
const DraggableItem = ({ item, onDragStart, dragImageRef, onItemClick, isDraggable = true, onDragEnd, onPointClick, showPoints, scale }) => {
  const pointRadius = 5;
  const itemRef = useRef(null);

  const handlePointClick = (e, side, option = null) => {
    e.stopPropagation();
    onPointClick(item.id, side, option);
  };


  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', item.id.toString());
    e.dataTransfer.effectAllowed = item.container_id === 1 ? 'copy' : 'move';

    // Create drag preview from the current item
    if (itemRef.current) {
      const dragImage = itemRef.current.cloneNode(true);
      dragImage.style.width = '220px';
      dragImage.style.transform = 'translate(-50%, -50%)';
      dragImage.style.opacity = '0.8';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, dragImage.offsetWidth / 2, dragImage.offsetHeight / 2);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };



  const isMessageFromFirstItem = item.box_Id === 1;
  const isConfirmationItem = item.box_Id === 3;

  return (
    <div
      className="draggable-item"
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      id={`item-${item.id}`}
      onClick={() => onItemClick && onItemClick(item.id)}
      data-type={item.title === 'Message' ? "message" : "default"}
      ref={itemRef}
      style={{
        position: item.container_id === 2 ? 'absolute' : 'relative',
        top: item.container_id === 2 ? item.y : 'auto',
        left: item.container_id === 2 ? item.x : 'auto',
        cursor: 'move',
        width: '220px',
        marginBottom: item.container_id === 1 ? '16px' : '0',
        minHeight: '100px',
        transform: item.container_id === 2 ? `scale(${scale})` : 'none',
        transformOrigin: 'top left'
      }}
    >
      <div className="card">
        <h3>{item.title}</h3>
        <p>{item.description}</p>

        {/* Display variable name for Message, Entity, and Confirmation items */}
        {item.container_id === 2 && item.variableName && (
          <div className="item-property">
            <strong>Variable:</strong> {item.variableName}
          </div>
        )}

        {/* Display type for Entity items */}
        {item.title === "Entity" && item.type && (
          <div className="item-property">
            <strong>Type:</strong> {item.type}
          </div>
        )}

        {/* Display message to print for Message and Confirmation items */}
        {item.container_id === 2 && item.messageToPrint && (
          <div className="item-property">
            <strong>Message:</strong> {item.messageToPrint}
          </div>
        )}

        {/* Display message type for Message items */}
        {item.container_id === 2 && item.title === 'Message' && item.messageType && (
          <div className="item-property">
            <strong>Type:</strong> {item.messageType}
          </div>
        )}

        {/* Display conditions for Confirmation items */}
        {item.box_Id === 3 && item.container_id === 2 && (
          <>
            {/* Display conditions for Confirmation items */}
            {/* If Conditions */}
            {item?.ifConditions?.length > 0 && (
              <div>
                <h4 style={{ color: "#4CAF50", marginBottom: "5px", marginTop: "0" }}>If Conditions:</h4>
                <ul style={{ margin: 0, padding: 0 }}>
                  {item.ifConditions.map((condition, index) => (
                    <li
                      key={index}
                      style={{
                        fontWeight: "bold",
                        color: "#4CAF50",
                        position: "relative",
                        marginBottom: "5px",
                      }}
                    >
                      <button className="if-condition-button" style={{ margin: 0 }}>
                        if : {condition.value}
                      </button>
                      {showPoints && (
                        <div
                          className={`point if-point`}
                          style={{
                            position: "absolute",
                            right: -10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "#4CAF50",
                            cursor: "crosshair",
                            zIndex: 10,
                          }}
                          onClick={(e) => handlePointClick(e, `if-${index}`)}
                        ></div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Else If Conditions */}
            {item?.elseIfConditions?.length > 0 && (
              <div>
                <h4 style={{ color: "#ff9800", marginBottom: "5px", marginTop: "0" }}>Else If Conditions:</h4>
                <ul style={{ margin: 0, padding: 0 }}>
                  {item.elseIfConditions.map((condition, index) => (
                    <li
                      key={index}
                      style={{
                        fontWeight: "bold",
                        color: "#ff9800",
                        position: "relative",
                        marginBottom: "5px",
                      }}
                    >
                      <button className="elseif-button" style={{ margin: 0 }}>
                        else if : {condition.value}
                      </button>
                      {showPoints && (
                        <div
                          className={`point else-if-point`}
                          style={{
                            position: "absolute",
                            right: -10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "#ff9800",
                            cursor: "crosshair",
                            zIndex: 10,
                          }}
                          onClick={(e) => handlePointClick(e, `elseif-${index}`)}
                        ></div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Else Conditions */}
            {item?.elseConditions?.length > 0 && (
              <div>
                <h4 style={{ color: "#f44336", marginBottom: "5px", marginTop: "0" }}>Else Conditions:</h4>
                <ul style={{ margin: 0, padding: 0 }}>
                  {item.elseConditions.map((condition, index) => (
                    <li
                      key={index}
                      style={{
                        fontWeight: "bold",
                        color: "#f44336",
                        position: "relative",
                        marginBottom: "5px",
                      }}
                    >
                      <button className="else-condition-button" style={{ margin: 0 }}
                      >
                        else : {condition.value}
                      </button>
                      {showPoints && (
                        <div
                          className={`point else-point`}
                          style={{
                            position: "absolute",
                            right: -10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "#f44336",
                            cursor: "crosshair",
                            zIndex: 10,
                          }}
                          onClick={(e) => handlePointClick(e, `else-${index}`)}
                        ></div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {/* Points for connections */}
      {showPoints && (
        <>
          {item.box_Id !== 0 && item.box_Id !== 6 && (
            <>
              <div
                className="point top"
                style={{
                  position: 'absolute',
                  top: -pointRadius,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: pointRadius * 2,
                  height: pointRadius * 2,
                  borderRadius: '50%',
                  backgroundColor: 'blue',
                  cursor: 'crosshair',
                }}
                onClick={(e) => handlePointClick(e, 'top')}
              ></div>
              <div
                className="point bottom"
                style={{
                  position: 'absolute',
                  bottom: -pointRadius,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: pointRadius * 2,
                  height: pointRadius * 2,
                  borderRadius: '50%',
                  backgroundColor: 'blue',
                  cursor: 'crosshair',
                }}
                onClick={(e) => handlePointClick(e, 'bottom')}
              ></div>
            </>
          )}
          {item.box_Id === 0 && (
            <div
              className="point right"
              style={{
                position: 'absolute',
                right: -pointRadius,
                top: '50%',
                transform: 'translateY(-50%)',
                width: pointRadius * 2,
                height: pointRadius * 2,
                borderRadius: '50%',
                backgroundColor: 'blue',
                cursor: 'crosshair',
              }}
              onClick={(e) => handlePointClick(e, 'right')}
            ></div>
          )}
          {item.box_Id === 6 && (
            <div
              className="point left"
              style={{
                position: 'absolute',
                left: -pointRadius,
                top: '50%',
                transform: 'translateY(-50%)',
                width: pointRadius * 2,
                height: pointRadius * 2,
                borderRadius: '50%',
                backgroundColor: 'blue',
                cursor: 'crosshair',
              }}
              onClick={(e) => handlePointClick(e, 'left')}
            ></div>
          )}
        </>
      )}
    </div>
  );
};

// ConnectionLine component to draw a line between two items
const ConnectionLine = ({ startItem, endItem, startSide, endSide, items, scale, option }) => {
  const getPointPosition = (itemId, side) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return null;

    const width = 220; // Unscaled width
    const height = 100; // Unscaled height
    const x = item.x; // Unscaled position
    const y = item.y; // Unscaled position

    // Handle condition points
    if (side.startsWith('if-') || side.startsWith('elseif-') || side.startsWith('else-')) {
      const buttonHeight = 30; // Height of condition button
      const buttonSpacing = 5; // Spacing between buttons
      const buttonMargin = 5; // Margin between sections
      const headerHeight = 25; // Height of section header

      let index = parseInt(side.split('-')[1]);
      let offsetY = height; // Start after the main item height

      // Add header heights and determine correct Y position based on condition type
      if (side.startsWith('if-')) {
        offsetY += headerHeight; // Add "If Conditions:" header height
        offsetY += (buttonHeight + buttonSpacing) * index;
      } else if (side.startsWith('elseif-')) {
        // Account for if conditions section
        const ifConditionsCount = item.ifConditions?.length || 0;
        offsetY += headerHeight * 2; // Add both headers height
        offsetY += (buttonHeight + buttonSpacing) * ifConditionsCount;
        offsetY += buttonMargin; // Add margin between sections
        offsetY += (buttonHeight + buttonSpacing) * index;
      } else if (side.startsWith('else-')) {
        const ifConditionsCount = item.ifConditions?.length || 0;
        const elseIfConditionsCount = item.elseIfConditions?.length || 0;
        offsetY += headerHeight * 3; // If, Else If, Else headers
        offsetY += (buttonHeight + buttonSpacing) * ifConditionsCount;
        offsetY += buttonMargin; // Margin after if section
        offsetY += (buttonHeight + buttonSpacing) * elseIfConditionsCount;
        offsetY += buttonMargin; // Margin after else-if section
        offsetY += (buttonHeight + buttonSpacing) * index;
      }

      return {
        x: x + width, // Points on the right side
        y: y + offsetY + buttonHeight / 2 // Center of the button
      };
    }

    // Handle regular points
    switch (side) {
      case "top":
        return { x: x + width / 2, y };
      case "bottom":
        return { x: x + width / 2, y: y + height };
      case "left":
        return { x, y: y + height / 2 };
      case "right":
        return { x: x + width, y: y + height / 2 };
      default:
        return null;
    }
  };

  const startPos = getPointPosition(startItem.id, startSide);
  const endPos = getPointPosition(endItem.id, endSide);

  if (!startPos || !endPos) return null;

  const generatePath = () => {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const controlPointDistance = Math.min(distance / 2, 150);

    let cp1x = startPos.x;
    let cp1y = startPos.y;
    let cp2x = endPos.x;
    let cp2y = endPos.y;

    // Handle condition points (if, else if, else)
    if (startSide.startsWith('if-') || startSide.startsWith('elseif-') || startSide.startsWith('else-')) {
      // For condition points, create a smooth horizontal curve first
      cp1x = startPos.x + controlPointDistance;
      cp1y = startPos.y;

      // Then adjust the second control point based on the target position
      if (endPos.x > startPos.x) {
        cp2x = endPos.x - controlPointDistance;
      } else {
        cp2x = endPos.x + controlPointDistance;
      }
      cp2y = endPos.y;
    } else {
      // For regular points, use the existing logic
      switch (startSide) {
        case "right":
          cp1x = startPos.x + controlPointDistance;
          break;
        case "left":
          cp1x = startPos.x - controlPointDistance;
          break;
        case "bottom":
          cp1y = startPos.y + controlPointDistance;
          break;
        case "top":
          cp1y = startPos.y - controlPointDistance;
          break;
      }

      // Adjust end control point
      switch (endSide) {
        case "right":
          cp2x = endPos.x + controlPointDistance;
          break;
        case "left":
          cp2x = endPos.x - controlPointDistance;
          break;
        case "bottom":
          cp2y = endPos.y + controlPointDistance;
          break;
        case "top":
          cp2y = endPos.y - controlPointDistance;
          break;
      }
    }

    return `M ${startPos.x},${startPos.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endPos.x},${endPos.y}`;
  };

  // Determine line color based on condition type
  let lineColor = "#3b82f6"; // Default color
  if (startSide.startsWith('if-')) {
    lineColor = "#4CAF50"; // Green for "if"
  } else if (startSide.startsWith('elseif-')) {
    lineColor = "#ff9800"; // Orange for "else if"
  } else if (startSide.startsWith('else-')) {
    lineColor = "#f44336"; // Red for "else"
  }

  return (
    <path
      d={generatePath()}
      stroke={lineColor}
      strokeWidth="2"
      fill="none"
      markerEnd={`url(#arrowhead-${startItem.id}-${endItem.id}${option ? "-" + option : ""})`}
      style={{
        transition: "all 0.3s ease",
        pointerEvents: "none",
      }}
    />
  );
};

// DropContainer component

const DropContainer = ({ id, title, mouseX, mouseY, children, onDrop, onDragOver, scale, onWheel, handleSave, handleText, handleBack }) => {

  return (
    <div
      className="drop-container"
      id={`container-${id}`}
      onDrop={(e) => onDrop(e, id)}
      onDragOver={onDragOver}
      onWheel={id === 2 ? onWheel : null}
      style={{
        position: 'relative',
        width: id === 1 ? '280px' : '1200px',
        overflow: 'auto',
        border: '1px solid #e2e8f0',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Workflow Title Centered & Save Button Left */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 0' }}>
        {/* Left: Save Button */}
        {id === 2 && (
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        )}
        {id === 2 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="text-button" onClick={handleText}>Test</button>
            <span className="coordinates">X: {mouseX}, Y: {mouseY}</span>
          </div>
        )}

        {id === 1 && (
          <div>
            <button className="back-button" onClick={handleBack}>Back</button>

          </div>
        )}



        {/* Center: Workflow Title */}
        <h2 style={{ textAlign: 'center', flexGrow: 1, margin: 0 }}>{title}</h2>
      </div>



      <div style={{
        paddingTop: id === 1 ? '70px' : '0',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: id === 1 ? 'center' : 'flex-start',
        minHeight: id === 2 ? 'calc(100vh - 120px)' : 'auto',
        transform: id === 2 ? `scale(${scale})` : 'none',
        transformOrigin: 'top left',
        width: id === 2 ? `${100 / scale}%` : '100%',
        height: id === 2 ? `${100 / scale}%` : '100%',
      }}>
        {children}
      </div>
    </div>
  );
};

// Main page component with 3 parts
const DragAndDropPage = () => {
  const navigate = useNavigate();
  const { dtId } = useParams();
  const location = useLocation();
  const [editableDtId, setEditableDtId] = useState(dtId || '');
  const [editableIssueName, setEditableIssueName] = useState(location.state?.issueName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState(() => {
    const defaultItems = [
      { id: 0, box_Id: 0, title: 'Start', description: '', container_id: 1, x: 0, y: 0, isDraggable: true },
      { id: 1, box_Id: 1, title: 'Message', description: 'Create and configure message flows', container_id: 1, x: 0, y: 0, isDraggable: true },
      { id: 2, box_Id: 2, title: 'Entity', description: 'Define data structure and relationships', container_id: 1, x: 0, y: 0, isDraggable: true },
      { id: 3, box_Id: 3, title: 'Confirmation', description: 'Add validation and confirmation steps', container_id: 1, x: 0, y: 0, isDraggable: true },
      { id: 4, box_Id: 4, title: 'Source API', description: 'Connect and integrate external APIs', container_id: 1, x: 0, y: 0, isDraggable: true },
      { id: 5, box_Id: 5, title: 'Media Files', description: '', container_id: 1, x: 0, y: 0, isDraggable: true },
      { id: 6, box_Id: 6, title: 'End', description: '', container_id: 1, x: 0, y: 0, isDraggable: true }
    ];
    return defaultItems;
  });

  // Add useEffect to fetch saved workflow data
  useEffect(() => {
    const fetchWorkflowData = async () => {
      if (dtId) {
        try {
          const response = await fetch(`http://192.168.10.127:2000/api/workflow/${dtId}`);
          if (response.ok) {
            const data = await response.json();
            // Update items and connections with saved data
            setItems(prevItems => {
              // Keep default items in container 1
              const container1Items = prevItems.filter(item => item.container_id === 1);
              // Add saved items to container 2, ensuring container_id is properly set
              const savedItems = data.items.map(item => ({
                ...item,
                container_id: item.container_id || item.box_id, // Use container_id or fall back to box_id
                box_Id: item.box_Id || item.box_id  // Set box_Id to match for backwards compatibility
              }));
              return [...container1Items, ...savedItems];
            });
            setConnections(data.connections || []);
            // Update mouse coordinates if available
            if (data.mouseX !== undefined) setMouseX(data.mouseX);
            if (data.mouseY !== undefined) setMouseY(data.mouseY);
          }
        } catch (error) {
          console.error('Error fetching workflow data:', error);
        }
      }
    };

    fetchWorkflowData();
  }, [dtId]);

  const [connections, setConnections] = useState(() => {
    const sessionData = JSON.parse(sessionStorage.getItem("workflowSessionData"));
    return sessionData?.connections || [];
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedVariableName, setEditedVariableName] = useState('');
  const [editedMessageToPrint, setEditedMessageToPrint] = useState('');
  const [messageType, setMessageType] = useState(''); // Change initial state to empty string
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [centerContainerHeight, setCenterContainerHeight] = useState(500);
  const [typesContainerHeight, setTypesContainerHeight] = useState(500);
  const [editedType, setEditedType] = useState(selectedItem?.type || '');
  const [scale, setScale] = useState(1);
  const [apiUrl, setApiUrl] = useState('');
  const [apiMethod, setApiMethod] = useState('GET');
  const [showTable, setShowTable] = useState(false);
  const [headers, setHeaders] = useState([{ key: "", value: "", description: "" }]);
  const [showBody, setShowBody] = useState(false);
  const [bodyContent, setBodyContent] = useState("");
  const [activeSection, setActiveSection] = useState(null); // Track open section
  const [additionalText, setAdditionalText] = useState(""); // New textarea state\\
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [ifConditions, setIfConditions] = useState([]);
  const [elseIfConditions, setElseIfConditions] = useState([]);
  const [elseConditions, setElseConditions] = useState([]);
  const [mouseX, setMouseX] = useState(() => {
    const sessionData = JSON.parse(sessionStorage.getItem("workflowSessionData"));
    return sessionData?.mouseX || 0;
  });
  const [mouseY, setMouseY] = useState(() => {
    const sessionData = JSON.parse(sessionStorage.getItem("workflowSessionData"));
    return sessionData?.mouseY || 0;
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    dtId: "",
    issueName: "",
    createdAt: "",
    owner: ""
  });
  const [showUploadPopup, setShowUploadPopup] = useState(false); // Add this state
  const [mediaFiles, setMediaFiles] = useState([]); // Add state for media files
  const [selectedFile, setSelectedFile] = useState(null); // Add state for selected file


  useEffect(() => {
    const handlePageRefresh = () => {
      sessionStorage.removeItem("workflowSessionData"); // Clear sessionStorage on refresh
    };

    window.addEventListener("beforeunload", handlePageRefresh);
    return () => window.removeEventListener("beforeunload", handlePageRefresh);
  }, []);




  // Add new state for node positions
  const [nodePositions, setNodePositions] = useState({});

  const containerPadding = 20;
  const itemHeight = 100;
  const itemMargin = 20;

  const handleSendRequest = () => {
    console.log(`Sending ${apiMethod} request to ${apiUrl}`);
  };


  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      setScale(prevScale => {
        const newScale = Math.max(0.5, Math.min(prevScale + delta, 2));
        return newScale;
      });
    }
  };

  // Function to add a new header row
  const addRow = () => {
    setHeaders([...headers, { id: Date.now(), key: "", value: "", description: "", saved: false }]);
  };

  // Function to delete a row
  const deleteRow = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  // Function to handle input change for headers
  const handleChange = (index, field, value) => {
    setHeaders((prevHeaders) =>
      prevHeaders.map((header, i) => (i === index ? { ...header, [field]: value } : header))
    );
  };

  // Function to save header row (disable editing)
  const saveRow = (index) => {
    setHeaders((prevHeaders) =>
      prevHeaders.map((header, i) => (i === index ? { ...header, saved: true } : header))
    );
  };





  const handleSave = () => {
    if (dtId) {
      // First check if DT ID has changed
      if (editableDtId !== dtId) {
        // If DT ID has changed, we need to:
        // 1. Delete the old workflow
        // 2. Create a new workflow with the new DT ID
        fetch(`http://192.168.10.127:2000/api/data/${dtId}`, {
          method: 'DELETE',
        })
          .then(() => {
            // Create new data entry
            return fetch('http://192.168.10.127:2000/api/data', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                dtId: editableDtId,
                issueName: editableIssueName,
                createdAt: new Date().toISOString().split('T')[0],
                owner: location.state?.owner || ''
              }),
            });
          })
          .then(() => {
            // Save workflow data with new DT ID
            return fetch(`http://192.168.10.127:2000/api/workflow/${editableDtId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                dt_id: editableDtId,
                issueName: editableIssueName,
                createdAt: new Date().toISOString().split('T')[0],
                owner: location.state?.owner || '',
                items: items.filter(item => item.container_id === 2).map(item => {
                  const connectedTo = connections
                    .filter(conn => conn.startItemId === item.id)
                    .map(conn => conn.endItemId);

                  const connectedBy = connections
                    .filter(conn => conn.endItemId === item.id)
                    .map(conn => conn.startItemId);

                  const itemData = {
                    id: item.id,
                    box_Id: item.box_Id,
                    container_id: item.container_id,
                    title: item.title,
                    description: item.description,
                    x: item.x,
                    y: item.y,
                    isDraggable: item.isDraggable,
                    variableName: item.variableName || '',
                    messageToPrint: item.messageToPrint || '',
                    type: item.title === 'Entity' ? (item.type || '') : '',
                    messageType: item.title === 'Message' ? (item.messageType || '') : '',
                    connectedTo,
                    connectedBy
                  };

                  if (item.box_Id === 3) {
                    itemData.ifConditions = item.ifConditions || [];
                    itemData.elseIfConditions = item.elseIfConditions || [];
                    itemData.elseConditions = item.elseConditions || [];
                  }

                  if (item.box_Id === 4) {
                    itemData.apiUrl = item.apiUrl || '';
                    itemData.apiMethod = item.apiMethod || 'GET';
                    itemData.headers = item.headers || [];
                    itemData.bodyContent = item.bodyContent || '';
                  }

                  return itemData;
                }),
                connections: connections.map(conn => ({
                  startItemId: conn.startItemId,
                  endItemId: conn.endItemId,
                  startSide: conn.startSide,
                  endSide: conn.endSide,
                  option: conn.option
                })),
                mouseX,
                mouseY
              }),
            });
          })
          .then(response => {
            if (response.ok) {
              alert("Workflow saved successfully!");
              navigate(`/drag/${editableDtId}`, { state: { issueName: editableIssueName, owner: location.state?.owner } });
            } else {
              throw new Error('Failed to save workflow');
            }
          })
          .catch(error => {
            console.error('Error saving workflow:', error);
            alert("Error saving workflow. Please try again.");
          });
      } else {
        // If DT ID hasn't changed, just update the existing workflow
        fetch(`http://192.168.10.127:2000/api/data/${dtId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dtId: editableDtId,
            issueName: editableIssueName,
            createdAt: new Date().toISOString().split('T')[0],
            owner: location.state?.owner || ''
          }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to update data table');
            }
            return fetch(`http://192.168.10.127:2000/api/workflow/${dtId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                dt_id: dtId,
                issueName: editableIssueName,
                createdAt: new Date().toISOString().split('T')[0],
                owner: location.state?.owner || '',
                items: items.filter(item => item.container_id === 2).map(item => {
                  const connectedTo = connections
                    .filter(conn => conn.startItemId === item.id)
                    .map(conn => conn.endItemId);

                  const connectedBy = connections
                    .filter(conn => conn.endItemId === item.id)
                    .map(conn => conn.startItemId);

                  const itemData = {
                    id: item.id,
                    box_Id: item.box_Id,
                    container_id: item.container_id,
                    title: item.title,
                    description: item.description,
                    x: item.x,
                    y: item.y,
                    isDraggable: item.isDraggable,
                    variableName: item.variableName || '',
                    messageToPrint: item.messageToPrint || '',
                    type: item.title === 'Entity' ? (item.type || '') : '',
                    messageType: item.title === 'Message' ? (item.messageType || '') : '',
                    connectedTo,
                    connectedBy
                  };

                  if (item.box_Id === 3) {
                    itemData.ifConditions = item.ifConditions || [];
                    itemData.elseIfConditions = item.elseIfConditions || [];
                    itemData.elseConditions = item.elseConditions || [];
                  }

                  if (item.box_Id === 4) {
                    itemData.apiUrl = item.apiUrl || '';
                    itemData.apiMethod = item.apiMethod || 'GET';
                    itemData.headers = item.headers || [];
                    itemData.bodyContent = item.bodyContent || '';
                  }

                  return itemData;
                }),
                connections: connections.map(conn => ({
                  startItemId: conn.startItemId,
                  endItemId: conn.endItemId,
                  startSide: conn.startSide,
                  endSide: conn.endSide,
                  option: conn.option
                })),
                mouseX,
                mouseY
              }),
            });
          })
          .then(response => {
            if (response.ok) {
              alert("Workflow saved successfully!");
            } else {
              throw new Error('Failed to save workflow');
            }
          })
          .catch(error => {
            console.error('Error saving workflow:', error);
            alert("Error saving workflow. Please try again.");
          });
      }
    } else {
      setIsPopupOpen(true);
    }
  };

  // Add a new function to handle the form submission
  const handleFormSubmit = async () => {
    if (!formData.dtId || !formData.issueName || !formData.createdAt || !formData.owner) {
      alert("Please fill all fields before saving!");
      return;
    }

    try { 
      // First check if DT ID already exists
      const checkResponse = await fetch(`http://192.168.10.127:2000/api/data/${formData.dtId}`);

      if (checkResponse.ok) {
        // DT ID exists, show alert and return
        alert("A workflow with this DT ID already exists. Please use a different DT ID.");
        return;
      }

      // DT ID doesn't exist, create new data
      const createResponse = await fetch('http://192.168.10.127:2000/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (createResponse.status === 409) {
        alert("A workflow with this DT ID already exists. Please use a different DT ID.");
        return;
      }

      if (!createResponse.ok) {
        throw new Error('Failed to create new DT data');
      }

      // Save workflow data
      const workflowData = {
        dtId: formData.dtId,
        issueName: formData.issueName,
        createdAt: formData.createdAt,
        owner: formData.owner,
        items: items.filter(item => item.container_id === 2).map(item => {
          // Find all connections for this item
          const connectedTo = connections
            .filter(conn => conn.startItemId === item.id)
            .map(conn => conn.endItemId);

          const connectedBy = connections
            .filter(conn => conn.endItemId === item.id)
            .map(conn => conn.startItemId);

          return {
            ...item,
            container_id: item.container_id, // Ensure container_id is explicitly included
            box_Id: item.box_Id,
            connectedTo,
            connectedBy
          };
        }),
        connections,
        mouseX,
        mouseY
      };

      const workflowResponse = await fetch(`http://192.168.10.127:2000/api/workflow/${formData.dtId}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData),
      });

      if (workflowResponse.ok) {
        setIsPopupOpen(false);
        alert("Data saved successfully!");
        // Reset form data
        setFormData({
          dtId: "",
          issueName: "",
          createdAt: "",
          owner: ""
        });
      } else {
        throw new Error('Failed to save workflow data');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert("Error saving data. Please check if the server is running.");
    }
  };





  const handleText = () => {
    setIsChatOpen(!isChatOpen); // Toggle chat box visibility
  };


  const addIfCondition = () => {
    setIfConditions(prev => [...prev, { id: Date.now(), value: "" }]);
  };


  const addElseIfCondition = () => {
    setElseIfConditions([...elseIfConditions, { id: Date.now(), value: "" }]);
  };

  const addElseCondition = () => {
    setElseConditions([...elseConditions, {}]); // Else doesn't need a value
  };


  const deleteIfCondition = (index) => {
    setIfConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteElseIfCondition = (id) => {
    setElseIfConditions((prev) => prev.filter((condition) => condition.id !== id));
  };

  const deleteElseCondition = (index) => {
    setElseConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    navigate("/dt")
  }



  // Toggle function: Only one section remains open
  const toggleSection = (section) => {
    setActiveSection((prevSection) => (prevSection === section ? null : section));
  };


  // Update handleDragEnd to store positions
  const handleDragEnd = (e) => {
    const draggedItem = items.find((item) => item.id === parseInt(e.target.id.split('-')[1]));
    if (!draggedItem || draggedItem.container_id !== 2) return;

    const container = document.getElementById('container-2');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    const scrollLeft = container.scrollLeft;
    const headerHeight = 60;
    const containerPadding = 20;

    // Calculate actual position without scale
    const newX = (e.clientX - containerRect.left + scrollLeft - containerPadding) / scale;
    const newY = (e.clientY - containerRect.top + scrollTop - headerHeight - containerPadding) / scale;

    // Update item positions
    setItems(items.map((item) =>
      item.id === draggedItem.id ? { ...item, x: newX, y: newY } : item
    ));

    // Update axes
    setMouseX(Math.round(newX));
    setMouseY(Math.round(newY));
  };





  // Update handleDrop to store positions for new items
  const handleDrop = (e, container_id) => {
    e.preventDefault();
    const itemId = parseInt(e.dataTransfer.getData('text/plain'));
    const draggedItem = items.find((item) => item.id === itemId);

    if (!draggedItem) return;

    const container = document.getElementById(`container-${container_id}`);
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    const scrollLeft = container.scrollLeft;

    const headerHeight = 60;
    const containerPadding = 20;

    if (draggedItem.container_id === 1 && container_id === 2) {
      const newX = (e.clientX - containerRect.left + scrollLeft - containerPadding) / scale;
      const newY = (e.clientY - containerRect.top + scrollTop - headerHeight - containerPadding) / scale;

      const newItem = {
        ...draggedItem,
        id: Date.now(),
        container_id: 2,
        box_Id: draggedItem.box_Id, // Preserve box_Id
        x: newX,
        y: newY,
        variableName: '',
        messageToPrint: '',
        type: '',
        ifConditions: [],
        elseIfConditions: [],
        elseConditions: []
      };

      // Store position in nodePositions
      setNodePositions(prev => ({
        ...prev,
        [newItem.id]: { x: newX, y: newY }
      }));

      setItems([...items, newItem]);
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    const target = e.target.closest('.drop-container');
    if (target && target.id === 'container-2') {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  // Handle delete connection
  const handleDeleteConnection = (connectionId) => {
    try {
      const connData = JSON.parse(connectionId);

      setConnections((prevConnections) => {
        return prevConnections.filter((conn) => {
          // Check if this is the connection we want to delete
          const shouldKeep = !(
            conn.startItemId === connData.startItemId &&
            conn.endItemId === connData.endItemId &&
            conn.startSide === connData.startSide &&
            conn.endSide === connData.endSide &&
            conn.option === connData.option
          );

          return shouldKeep;
        });
      });
    } catch (error) {
      console.error('Error parsing connection ID:', error);
    }
  };

  // Find connected items for the selected item
  const findConnectedItems = (itemId) => {
    return connections
      .filter((conn) => conn.startItemId === itemId || conn.endItemId === itemId)
      .map((conn) => {
        const isOutgoing = conn.startItemId === itemId;
        const connectedItem = items.find((item) =>
          item.id === (isOutgoing ? conn.endItemId : conn.startItemId)
        );

        // Create a unique connection identifier that includes all necessary information
        const connectionId = JSON.stringify({
          startItemId: conn.startItemId,
          endItemId: conn.endItemId,
          startSide: conn.startSide,
          endSide: conn.endSide,
          option: conn.option
        });

        return {
          id: connectedItem?.id,
          title: connectedItem?.title,
          connection: isOutgoing ? "connected to" : "connected by",
          connectedItemName: connectedItem?.title || "Unknown",
          condition: conn.startSide.startsWith("if-") || conn.startSide.startsWith("elseif-") || conn.startSide.startsWith("else-")
            ? conn.startSide.split('-')[0]
            : null,
          connectionId: connectionId,
          startSide: conn.startSide,
          endSide: conn.endSide,
          option: conn.option
        };
      });
  };

  // Handle item click (edit the clicked item from the Center container only)
  const handleItemClick = (itemId) => {
    const itemToEdit = items.find((item) => item.id === itemId && item.container_id === 2);
    if (itemToEdit) {
      setSelectedItem(itemToEdit);
      setEditedDescription(itemToEdit.description);
      setMessageType(itemToEdit.messageType || ''); // Initialize to empty string if no messageType

      // Include Source API (box_Id === 4) in the editable items
      if (itemToEdit.box_Id === 1 || itemToEdit.box_Id === 2 || itemToEdit.box_Id === 3 || itemToEdit.box_Id === 4) {
        setEditedVariableName(itemToEdit.variableName || '');
        setEditedMessageToPrint(itemToEdit.messageToPrint || '');
      }

      if (itemToEdit.title === 'Entity') {
        setEditedType(itemToEdit.type || '');
      }

      // Load conditions from the selected item if it's a confirmation item
      if (itemToEdit.box_Id === 3) {
        setIfConditions(itemToEdit.ifConditions || [{ id: Date.now(), value: "" }]);
        setElseIfConditions(itemToEdit.elseIfConditions || [{ id: Date.now(), value: "" }]);
        setElseConditions(itemToEdit.elseConditions || [{}]);
      }

      setIsSidebarOpen(true);
    }
  };


  // Handle editing the description in the Right Container
  const handleDescriptionChange = (e) => {
    setEditedDescription(e.target.value);
  };

  const handleVariableNameChange = (e) => {
    setEditedVariableName(e.target.value);  // Update variableName
  };

  const handleMessageToPrintChange = (e) => {
    setEditedMessageToPrint(e.target.value);  // Update messageToPrint
  };

  // Save the edited description and other properties
  const handleSaveEdit = () => {
    if (selectedItem) {
      // Filter out empty else-if conditions
      const filteredElseIfConditions = elseIfConditions.filter(condition => condition.value.trim() !== '');

      const updatedItems = items.map((item) =>
        item.id === selectedItem.id
          ? {
            ...item,
            description: editedDescription,
            variableName: editedVariableName,
            messageToPrint: editedMessageToPrint,
            messageType: item.title === 'Message' ? messageType : item.messageType, // Updated this line to only set for Message items
            ...(item.title === 'Entity' ? { type: editedType } : {}),
            // Only update conditions for confirmation items
            ...(item.box_Id === 3 ? {
              ifConditions: ifConditions,
              elseIfConditions: filteredElseIfConditions,
              elseConditions: elseConditions
            } : {}),
            // Only update API properties for Source API items
            ...(item.box_Id === 4 ? {
              apiUrl: apiUrl,
              apiMethod: apiMethod,
              headers: headers,
              bodyContent: bodyContent
            } : {})
          }
          : item
      );

      setItems(updatedItems);
      setSelectedItem(null);
      setIsSidebarOpen(false);
    }
  };


  // Handle delete the selected item only from the Center container
  const handleDelete = () => {
    if (selectedItem && selectedItem.container_id === 2) {
      // Remove connections related to the deleted item
      setConnections((prevConnections) =>
        prevConnections.filter(
          (conn) =>
            conn.startItemId !== selectedItem.id && conn.endItemId !== selectedItem.id
        )
      );
      setItems((prevItems) => prevItems.filter((item) => item.id !== selectedItem.id));
      setSelectedItem(null);
      setIsSidebarOpen(false);
    }
  };

  // Close sidebar handler
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Connection Logic ------------------------------------------------------
  const handlePointClick = (itemId, side, option = null) => {
    // Prevent event from bubbling up
    event.stopPropagation();

    if (selectedPoint && selectedPoint.itemId !== itemId) {
      // Create a connection between the selected point and the clicked point
      const startItemId = selectedPoint.itemId;
      const startSide = selectedPoint.side;
      const startOption = selectedPoint.option;
      const endItemId = itemId;
      const endSide = side;

      // Check if the connection already exists
      const connectionExists = connections.some(
        (conn) =>
          conn.startItemId === startItemId &&
          conn.endItemId === endItemId &&
          conn.startSide === startSide &&
          conn.endSide === endSide &&
          conn.option === startOption
      );

      if (!connectionExists) {
        // Validate connection based on condition types
        if (startSide.startsWith('if-') || startSide.startsWith('elseif-') || startSide.startsWith('else-')) {
          // Only allow connections from condition points to other items
          setConnections((prevConnections) => [
            ...prevConnections,
            {
              startItemId,
              endItemId,
              startSide,
              endSide,
              option: startOption,
            },
          ]);
        } else {
          // Regular point connections
          setConnections((prevConnections) => [
            ...prevConnections,
            {
              startItemId,
              endItemId,
              startSide,
              endSide,
              option: startOption,
            },
          ]);
        }
      }

      // Reset the selected point
      setSelectedPoint(null);
    } else {
      // Select the point
      setSelectedPoint({ itemId, side, option });
    }
  };

  useEffect(() => {
    const calculateMaxY = (container_id) => {
      const containerItems = items.filter((item) => item.container_id === container_id);
      let maxY = 0;
      containerItems.forEach((item) => {
        // Check if it's from the first item and has extra fields
        const itemActualHeight = item.container_id === 2 &&
          (item.box_Id === 1 || item.box_Id === 2 || item.box_Id === 3) &&
          (item.variableName || item.messageToPrint) ?
          150 : itemHeight;
        maxY = Math.max(maxY, item.y + itemActualHeight);
      });

      return maxY;
    };
    const newCenterHeight = Math.max(500, calculateMaxY(2) + containerPadding);
    const newTypesHeight = Math.max(500, calculateMaxY(1) + containerPadding);
    setCenterContainerHeight(newCenterHeight);
    setTypesContainerHeight(newTypesHeight);
  }, [items]);

  useEffect(() => {
    // Add event listener for mouse wheel with Ctrl key for zooming
    const preventDefaultZoom = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventDefaultZoom, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventDefaultZoom);
    };
  }, []);

  // Add zoom button handlers
  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveTitleEdit = () => {
    setIsEditing(false);
    // Save the changes
    handleSave();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to original values
    setEditableDtId(dtId || '');
    setEditableIssueName(location.state?.issueName || '');
  };

  // Add new function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFile = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        file: file
      };
      setMediaFiles(prev => [...prev, newFile]);
      setSelectedFile(newFile);
    }
  };

  // Add new function to handle file deletion
  const handleFileDelete = (fileId) => {
    setMediaFiles(prev => prev.filter(file => file.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>



      <div className="container-wrapper">
        <DropContainer
          id={1}
          title="Types"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          handleBack={handleBack}
        >
          {items
            .filter((item) => item.container_id === 1)
            .map((item) => (
              <DraggableItem
                key={item.id}
                item={item}
                onDragEnd={handleDragEnd}
                onItemClick={handleItemClick}
                showPoints={false}
                scale={1}
              />
            ))}
        </DropContainer>

        <DropContainer
          id={2}
          title={
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              justifyContent: dtId ? 'flex-start' : 'center',
              width: '100%'
            }}>
              {dtId ? (
                <>
                  {isEditing ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>DT ID:</span>
                        <input
                          type="text"
                          value={editableDtId}
                          onChange={(e) => setEditableDtId(e.target.value)}
                          style={{ width: '100px', padding: '5px' }}
                          placeholder="DT ID"
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>Issue Name:</span>
                        <input
                          type="text"
                          value={editableIssueName}
                          onChange={(e) => setEditableIssueName(e.target.value)}
                          style={{ width: '200px', padding: '5px' }}
                          placeholder="Issue Name"
                        />
                      </div>
                      <button onClick={handleSaveTitleEdit} style={{ padding: '5px 10px', margin: '0 5px' }}>Save</button>
                      <button onClick={handleCancelEdit} style={{ padding: '5px 10px' }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span>DT ID: {editableDtId}</span>
                      <span>Issue Name: {editableIssueName}</span>
                      <button onClick={handleEditClick} style={{ padding: '5px 10px' }}>Edit</button>
                    </>
                  )}
                  <span>-</span>
                </>
              ) : null}
              <span style={{ textAlign: 'center' }}>Workflow</span>
            </div>
          }
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          isCenterContainer={true}
          scale={scale}
          onWheel={handleWheel}
          handleSave={handleSave}
          handleText={handleText}
          handleBack={handleBack}
          mouseX={mouseX}
          mouseY={mouseY}
        >
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            transition: 'transform 0.1s ease-out'
          }}>
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                overflow: 'visible'
              }}
            >
              <defs>
                {connections.map((connection) => {
                  const markerId = `arrowhead-${connection.startItemId}-${connection.endItemId}${connection.option ? '-' + connection.option : ''}`;
                  let arrowColor = "#3b82f6"; // Default color

                  if (connection.startSide.startsWith('if-')) {
                    arrowColor = "#4CAF50"; // Green for "if"
                  } else if (connection.startSide.startsWith('elseif-')) {
                    arrowColor = "#ff9800"; // Orange for "else if"
                  } else if (connection.startSide.startsWith('else-')) {
                    arrowColor = "#f44336"; // Red for "else"
                  }

                  return (
                    <marker
                      key={markerId}
                      id={markerId}
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill={arrowColor} />
                    </marker>
                  );
                })}
              </defs>
              {connections.map((connection, index) => (
                <ConnectionLine
                  key={index}
                  startItem={items.find(item => item.id === connection.startItemId)}
                  endItem={items.find(item => item.id === connection.endItemId)}
                  startSide={connection.startSide}
                  endSide={connection.endSide}
                  items={items}
                  scale={scale}
                  option={connection.option}
                />
              ))}
            </svg>
            {items
              .filter((item) => item.container_id === 2)
              .map((item) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  onDragEnd={handleDragEnd}
                  onItemClick={handleItemClick}
                  showPoints={true}
                  onPointClick={handlePointClick}
                  scale={1} // Remove individual item scaling
                />
              ))}

          </div>

        </DropContainer>
      </div>

      {/* Update Zoom Controls position to bottom right */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 1000
      }}>
        <button
          onClick={handleZoomIn}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#4CAF50',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#f44336',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          -
        </button>
      </div>

      {/* Right Section (Sidebar) */}
      <div>
        <div
          className={`sidebar ${isSidebarOpen ? 'open' : ''} ${selectedItem?.title === 'Source API' ? 'source-api' : ''}`}
        >


          {/* Close Button (Crossmark) */}
          <FaTimes
            onClick={handleCloseSidebar}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              cursor: 'pointer',
              fontSize: '24px',
              color: '#555',
              transition: 'color 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => (e.target.style.color = 'red')}
            onMouseLeave={(e) => (e.target.style.color = '#555')}
          />


          {selectedItem ? (
            <div>
              {/* Display the item's title as a heading in the sidebar */}
              <h2>{selectedItem.title}</h2>

              {/* Show Variable Name field for Message, Entity, and Confirmation items */}
              {(selectedItem.box_Id === 1 || selectedItem.box_Id === 2 || selectedItem.title === 'Message') && (
                <>
                  <h4>Edit Variable Name</h4>
                  <input
                    type="text"
                    value={editedVariableName}
                    onChange={handleVariableNameChange}
                    placeholder="Enter variable name"
                  />

                  {/* Add Message Type dropdown for Message items */}
                  {selectedItem.title === 'Message' && (
                    <>
                      <h4>Message Type</h4>
                      <select
                        value={messageType}
                        onChange={(e) => setMessageType(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          marginBottom: '16px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <option value="">Select Message Type</option>
                        <option value="Question">Question</option>
                        <option value="Answer">Answer</option>
                      </select>
                    </>
                  )}
                </>
              )}

              {/* Show Variable Name field for Confirmation items */}
              {(selectedItem.box_Id === 3) && (
                <>
                  <h4>Edit Variable Name</h4>
                  <input
                    type="text"
                    value={editedVariableName}
                    onChange={handleVariableNameChange}
                    placeholder="Enter variable name"
                  />
                </>
              )}

              {/* Only show Edit Description field if it's not a Confirmation item */}
              {selectedItem.box_Id !== 3 && selectedItem.box_Id !== 5 && (
                <>
                  <h4>Edit Description</h4>
                  <input
                    type="text"
                    value={editedDescription}
                    onChange={handleDescriptionChange}
                    placeholder="Enter description"
                  />
                </>
              )}

              {/* Show Type dropdown for Entity items */}
              {selectedItem.title === 'Entity' && (
                <>
                  <h3>Types</h3>
                  <select
                    value={editedType}
                    onChange={(e) => setEditedType(e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="Number">Number</option>
                    <option value="Phone">Phone</option>
                    <option value="String">String</option>
                    <option value="Date">Date</option>
                  </select>

                  <p style={{ color: 'black' }}><strong>Selected Type:</strong> {selectedItem.type || 'None'}</p>
                </>
              )}

              {selectedItem.box_Id === 3 && ( // Only show for Confirmation items
                <>
                  {/* Single If Condition */}
                  <div style={{
                    border: "2px solid #4CAF50",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    marginBottom: "10px",
                    position: "relative"
                  }}>
                    <h3 style={{ marginBottom: "5px", color: "#4CAF50" }}>If</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="text"
                        value={ifConditions[0]?.value || ""}
                        onChange={(e) => {
                          setIfConditions([{ id: Date.now(), value: e.target.value }]);
                        }}
                        placeholder="Enter condition"
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc"
                        }}
                      />
                    </div>
                  </div>

                  {/* Else If Conditions */}
                  {elseIfConditions && elseIfConditions.length > 0 && elseIfConditions.map((condition, index) => (
                    <div key={`elseif-${index}`} style={{
                      border: "2px solid #ff9800",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(255, 152, 0, 0.1)",
                      marginBottom: "10px",
                      position: "relative"
                    }}>
                      {/* Delete button at the top right */}
                      <button onClick={() => deleteElseIfCondition(condition.id)} style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "gray",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        cursor: "pointer"
                      }}>
                        Delete
                      </button>

                      <h3 style={{ marginBottom: "5px", color: "#ff9800" }}>Else If</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                          type="text"
                          value={condition.value || ""}
                          onChange={(e) => {
                            const newConditions = [...elseIfConditions];
                            newConditions[index] = { ...condition, value: e.target.value };
                            setElseIfConditions(newConditions);
                          }}
                          placeholder="Enter condition"
                          style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                          }}
                        />
                      </div>
                    </div>
                  ))}


                  {/* Add Else If Button */}
                  <button
                    onClick={addElseIfCondition}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '8px',
                      marginTop: '10px',
                      marginBottom: '20px',
                      backgroundColor: '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    <span style={{ marginRight: '8px' }}>+</span> Add Else If Condition
                  </button>

                  {/* Single Else Condition */}
                  <div style={{
                    border: "2px solid #f44336",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    marginBottom: "10px",
                    position: "relative"
                  }}>
                    <h3 style={{ marginBottom: "5px", color: "#f44336" }}>Else</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="text"
                        value={elseConditions[0]?.value || ""}
                        onChange={(e) => {
                          setElseConditions([{ id: Date.now(), value: e.target.value }]);
                        }}
                        placeholder="Action for else condition"
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc"
                        }}
                      />
                    </div>
                  </div>


                </>
              )}






              {/* Show Type dropdown for Source-api items */}
              {selectedItem.title === 'Source API' && (
                <div className="api-request">
                  <select
                    value={apiMethod}
                    onChange={(e) => setApiMethod(e.target.value)}
                    className="api-method"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="Enter API URL"
                    className="api-url"
                  />
                  <button onClick={handleSendRequest} className="api-send">Send</button>
                </div>
              )}


              {selectedItem.title === 'Source API' && (
                <div className="source-api-sidebar">
                  {/* Headers & Body Titles Side by Side */}
                  <div className="title-wrapper">
                    <h3
                      onClick={() => toggleSection("headers")}
                      className={`header-title ${activeSection === "headers" ? "active" : ""}`}
                    >
                      Headers
                    </h3>
                    <h3
                      onClick={() => toggleSection("body")}
                      className={`body-title ${activeSection === "body" ? "active" : ""}`}
                    >
                      Body
                    </h3>
                  </div>

                  {/* Headers Table (Only opens when active) */}
                  {activeSection === "headers" && (
                    <div className="headers-container">
                      <table className="headers-table">
                        <thead>
                          <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th>Description</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {headers.map((header, index) => (
                            <tr key={header.id}>
                              <td>
                                <input
                                  type="text"
                                  value={header.key}
                                  onChange={(e) => handleChange(index, "key", e.target.value)}
                                  placeholder="Key"
                                  disabled={header.saved}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={header.value}
                                  onChange={(e) => handleChange(index, "value", e.target.value)}
                                  placeholder="Value"
                                  disabled={header.saved}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={header.description}
                                  onChange={(e) => handleChange(index, "description", e.target.value)}
                                  placeholder="Description"
                                  disabled={header.saved}
                                />
                              </td>
                              <td>
                                <button className="delete-btn" onClick={() => deleteRow(index)}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button onClick={addRow} className="add-row-btn">+ Add Row</button>
                    </div>
                  )}

                  {/* Body Content (Only opens when active) */}
                  {activeSection === "body" && (
                    <div className="body-container">
                      <textarea
                        className="body-textarea"
                        placeholder="Enter JSON..."
                        value={bodyContent}
                        onChange={(e) => setBodyContent(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Additional Textarea (Always Appears After Body Div) */}
                  <div className="additional-text-container">
                    <textarea
                      className="additional-textarea"
                      placeholder="Response..."
                      value={additionalText}
                      onChange={(e) => setAdditionalText(e.target.value)}
                    />
                  </div>
                </div>

              )
              }



              {/* Show Message to Print field for Message, Entity, and Confirmation items */}
              {(selectedItem.box_Id === 1 || selectedItem.box_Id === 2 || selectedItem.title === 'Message') && (
                <>
                  <h4>Edit Message to Print</h4>
                  <input
                    type="text"
                    value={editedMessageToPrint}
                    onChange={handleMessageToPrintChange}
                    placeholder="Enter message to print"
                  />
                </>
              )}

              {/* Show Message to Print field for Confirmation items */}
              {(selectedItem.box_Id === 3) && (
                <>
                  <h4>Edit Message to Print</h4>
                  <input
                    type="text"
                    value={editedMessageToPrint}
                    onChange={handleMessageToPrintChange}
                    placeholder="Enter message to print"
                  />
                </>
              )}

              {/* Media Files Section */}
              {selectedItem.title === 'Media Files' && (
                <div className="media-files-sidebar">
                  <h3>Media Files</h3>

                  {/* Upload Area */}
                  <div
                    className="upload-area"
                    style={{
                      border: '2px dashed #ccc',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                      marginBottom: '20px',
                      cursor: 'pointer',
                      backgroundColor: '#f8f9fa'
                    }}
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    <FaUpload style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }} />
                    <p style={{ margin: '0', color: '#666' }}>Click to upload or drag and drop</p>
                    <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#999' }}>
                      Supported formats: Images, Videos, PDFs
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                  </div>

                  {/* Files List */}
                  {mediaFiles.length > 0 && (
                    <div className="files-list">
                      <h4>Uploaded Files</h4>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {mediaFiles.map((file) => (
                          <li
                            key={file.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              marginBottom: '8px',
                              backgroundColor: 'white'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {file.type.startsWith('image/') ? (
                                <img
                                  src={URL.createObjectURL(file.file)}
                                  alt={file.name}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                              ) : (
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  backgroundColor: '#e2e8f0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '4px'
                                }}>
                                  <FaFile style={{ fontSize: '20px', color: '#666' }} />
                                </div>
                              )}
                              <div>
                                <p style={{ margin: '0', fontWeight: '500' }}>{file.name}</p>
                                <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#666' }}>
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileDelete(file.id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#f44336'
                              }}
                            >
                              <FaTrash />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <br />
              {/* Connected To Section */}
              <div className="connected-to-section" style={{ marginTop: '20px' }}>
                <h3>Connections</h3>
                {selectedItem && (() => {
                  const connectedItems = findConnectedItems(selectedItem.id);

                  if (connectedItems.length === 0) {
                    return <p style={{ color: 'gray' }}>No connections</p>;
                  }

                  // Separate connections by condition type
                  const itemConnections = connectedItems.filter((conn) => !conn.condition);
                  const conditionConnections = connectedItems.filter((conn) => conn.condition);

                  return (
                    <>
                      {/* Display Item Connections */}
                      {itemConnections.length > 0 && (
                        <div>
                          <h4 style={{ color: "#3b82f6" }}>Item Connections:</h4>
                          <ul style={{ padding: '0 0 0 20px', margin: '5px 0' }}>
                            {itemConnections.map((conn, index) => (
                              <li key={index} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>
                                  <strong>{selectedItem.title}</strong> {conn.connection} <strong>{conn.connectedItemName}</strong>
                                </span>
                                <button
                                  onClick={() => handleDeleteConnection(conn.connectionId)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#999',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '5px',
                                  }}
                                >
                                  <FaTimes />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Display Condition Connections */}
                      {conditionConnections.length > 0 && (
                        <div>
                          <h4 style={{ color: "#4CAF50" }}>Condition Connections:</h4>
                          <ul style={{ padding: '0 0 0 20px', margin: '5px 0' }}>
                            {conditionConnections.map((conn, index) => (
                              <li key={index} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>
                                  <strong>{conn.condition}</strong> is {conn.connection} <strong>{conn.connectedItemName}</strong>
                                </span>
                                <button
                                  onClick={() => handleDeleteConnection(conn.connectionId)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#999',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '5px',
                                  }}
                                >
                                  <FaTimes />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <div style={{ marginTop: '20px' }}>
                <button onClick={handleSaveEdit}>Save</button>
                <button
                  onClick={handleDelete}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',

                    alignItems: 'center',
                    gap: '5px',
                  }}
                >

                  <FaTrash style={{ color: 'red' }} /> {/* Trash icon */}
                </button>


              </div>
            </div>
          ) : (
            <p>Select an item to edit</p>
          )}
        </div>




        {/* Chat Box - Opens when "Text" button is clicked */}
        <div className={`chat-box ${isChatOpen ? 'open' : ''}`}>
          <div className="chat-header">
            <h3>Live Chat</h3>
            <button className="close-chat" onClick={() => setIsChatOpen(false)}>X</button>
          </div>
          <div className="chat-content">
            <div className="chat-message bot">Hello! How can I assist you?</div>
            <div className="chat-message user">I need help with my workflow.</div>
          </div>
          <div className="chat-footer">
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px', position: 'relative' }}>
              <FaPlus
                style={{ color: '#666', cursor: 'pointer', fontSize: '16px' }}
                onClick={() => setShowUploadPopup(!showUploadPopup)}
              />
              {showUploadPopup && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '0',
                  marginBottom: '10px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  zIndex: 1000,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                  }}>
                    <FaUpload style={{ color: '#666', fontSize: '16px' }} />
                    <span>Upload File</span>
                  </div>
                  <input
                    type="file"
                    style={{
                      fontSize: '14px',
                      width: '100%'
                    }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Handle file upload here
                        console.log('File selected:', file.name);
                        setShowUploadPopup(false);
                      }
                    }}
                  />
                </div>
              )}
              <input type="text" placeholder="Type a message..." className="chat-input" style={{ flex: 1 }} />
              <button className="send-button">Send</button>
            </div>
          </div>
        </div>





        {isPopupOpen && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>Enter Details</h3>
              <input
                type="text"
                placeholder="Dt id"
                value={formData.dtId}
                onChange={(e) => setFormData({ ...formData, dtId: e.target.value })}
              />
              <input
                type="text"
                placeholder="Issue Name"
                value={formData.issueName}
                onChange={(e) => setFormData({ ...formData, issueName: e.target.value })}
              />
              <input
                type="date"
                placeholder="Created At"
                value={formData.createdAt}
                onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
              />
              <input
                type="text"
                placeholder="Owner"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              />
              <button onClick={handleFormSubmit}>Save</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};


export default DragAndDropPage;






