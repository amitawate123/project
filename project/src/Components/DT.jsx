import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dt.css'; // Import the CSS file

function DataTable() {
  const [rows, setRows] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editedData, setEditedData] = useState({ dtId: '', issueName: '', createdAt: '', owner: '' });
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.10.127:2000/api/data');
        const data = await response.json();
        // Sort data by DT ID in ascending order
        const sortedData = data.sort((a, b) => {
          // Convert DT IDs to numbers for proper numerical sorting
          const idA = parseInt(a.dtId);
          const idB = parseInt(b.dtId);
          return idA - idB;
        });
        setRows(sortedData.map((item, index) => ({
          id: index + 1,
          ...item
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const editRow = (row) => {
    navigate(`/drag/${row.dtId}`, { state: { issueName: row.issueName, owner: row.owner } });
  };


  const saveEdit = async (id) => {
    try {
      const rowToUpdate = rows.find(row => row.id === id);
      const response = await fetch(`http://192.168.10.127:2000/api/data/${rowToUpdate.dtId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setRows(rows.map((row) =>
          row.id === id ? { ...row, ...updatedData.data } : row
        ));
        setEditRowId(null);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const goToNextPage = () => {
    navigate('/drag');
    sessionStorage.removeItem("workflowSessionData"); // Clear sessionStorage on refresh
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  const deleteRow = async (id) => {
    try {
      const rowToDelete = rows.find(row => row.id === id);
      const response = await fetch(`http://192.168.10.127:2000/api/data/${rowToDelete.dtId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRows(rows.filter((row) => row.id !== id));
        setDeletingId(null);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleLogout = () => {
    navigate('/')
  }

  const handleBack = () =>{
    navigate('/about')
  }



  return (
    <div>
      <div className='about-button-container'>
        <button className='about-back' onClick={handleBack}>Back</button>
        <button className='about-logout' onClick={handleLogout}>Logout</button>
      </div>
      <h2 className="h2">Data Table</h2>



      <div>
        <button className="button newPageButton" onClick={goToNextPage}>Add DT</button>
        <button className='Add-Flow'>Add Flow</button>
        <button className='End-Flow'>End Flow</button>
      </div>
      <br />

      <table className="table">
        <thead>
          <tr>
            <th>DT ID</th>
            <th>Issue Name</th>
            <th>Created At</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>

        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr key={index} style={{ height: "50px", fontSize: "18px" }}>
                {editRowId === row.id ? (
                  <>
                    <td><input type="text" name="dtId" value={editedData.dtId} onChange={handleEditChange} /></td>
                    <td><input type="text" name="issueName" value={editedData.issueName} onChange={handleEditChange} /></td>
                    <td><input type="text" name="createdAt" value={editedData.createdAt} onChange={handleEditChange} /></td>
                    <td><input type="text" name="owner" value={editedData.owner} onChange={handleEditChange} /></td>
                  </>
                ) : (
                  <>
                    <td>{row.dtId}</td>
                    <td>{row.issueName}</td>
                    <td>{row.createdAt}</td>
                    <td>{row.owner}</td>
                  </>
                )}
                <td>
                  {editRowId === row.id ? (
                    <button className="button save" onClick={() => saveEdit(row.id)}>Save</button>
                  ) : (
                    <>
                      <button className="button edit" onClick={() => editRow(row)}>Edit</button>
                      {deletingId === row.id ? (
                        <div style={{ display: "flex", gap: "10px" }}>
                          <p style={{ color: "black" }}>Are you sure?</p>
                          <button className="button confirm" onClick={() => deleteRow(row.id)}>Yes</button>
                          <button className="button cancel" onClick={cancelDelete}>No</button>
                        </div>
                      ) : (
                        <button className="button delete" onClick={() => confirmDelete(row.id)}>Delete</button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", color: "gray" }}>
                No Data Available
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}

export default DataTable;
