import React, { useState, useEffect, useContext } from 'react';
import noteContext from '../context/noteContext';
import { useNavigate } from 'react-router-dom';
import CrisisAlertRoundedIcon from '@mui/icons-material/CrisisAlertRounded';

export const Admincomplains = () => {
  const { state, dispatch } = useContext(noteContext);
  const [complaints, setComplaints] = useState([]);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('admintoken')) {
      navigate('/adminsignin');
      return;
    }
    dispatch({ type: 'UPDATE_VALUE', payload: false });
    dispatch({ type: 'UPDATE_AVALUE', payload: true });
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`http://${state.backend}:${state.port}/api/c/allcomplains`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('admintoken'),
        },
      });
      const json = await response.json();
      if (json.response) {
        setComplaints(json.allcomps);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssign = async (id, staffName) => {
    if (!staffName.trim()) return;
    try {
      const response = await fetch(`http://${state.backend}:${state.port}/api/c/assigncomplain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('admintoken'),
        },
        body: JSON.stringify({ id, assignedTo: staffName }),
      });
      const json = await response.json();
      if (json.response) {
        setAlert({ type: 'success', message: json.message });
        fetchComplaints();
      } else {
        setAlert({ type: 'danger', message: json.message });
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: 'danger', message: 'Failed to assign complaint' });
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://${state.backend}:${state.port}/api/c/updatecomplainstatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('admintoken'),
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await response.json();
      if (json.response) {
        setAlert({ type: 'success', message: json.message });
        fetchComplaints();
      } else {
        setAlert({ type: 'danger', message: json.message });
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: 'danger', message: 'Failed to update status' });
    }
  };

  return (
    <div className="container-fluid py-4" style={{ minHeight: '90vh' }}>
      {/* Title */}
      <div className="mb-4">
        <h3 className="font-extrabold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent inline-block">
          Complaint Management
        </h3>
        <p className="text-sm text-gray-500">Monitor and assign student complaints</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show mb-4`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(null)} aria-label="Close"></button>
        </div>
      )}

      {/* Complaints List */}
      <div className="bg-white rounded-2xl shadow-soft-xl p-6">
        <h5 className="font-bold text-gray-800 mb-4 flex items-center">
          <CrisisAlertRoundedIcon className="text-purple-600 mr-2" />
          Active Student Complaints ({complaints.length})
        </h5>

        {complaints.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No complaints logged in the system.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Student / Room</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Complaint Details</th>
                  <th className="px-4 py-3">Assigned Staff</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((comp) => {
                  let statusBadge = 'bg-yellow-100 text-yellow-800';
                  if (comp.status === 'In Progress') statusBadge = 'bg-blue-100 text-blue-800';
                  else if (comp.status === 'Resolved') statusBadge = 'bg-green-100 text-green-800';

                  return (
                    <tr key={comp._id} className="bg-white border-b hover:bg-gray-50 align-top">
                      <td className="px-4 py-4">
                        <p className="font-bold text-gray-800 m-0">{comp.name}</p>
                        <p className="text-xs text-gray-500 m-0">Room: {comp.room_no}</p>
                        <p className="text-[10px] text-gray-400 m-0">
                          {new Date(comp.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 text-xs font-bold bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                          {comp.catagory}
                        </span>
                      </td>
                      <td className="px-4 py-4 max-w-xs">
                        <p className="text-sm text-gray-700 break-words m-0">{comp.description}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs text-gray-600 font-semibold">
                            Currently: <strong className="text-gray-800">{comp.assignedTo || 'Unassigned'}</strong>
                          </span>
                          <div className="flex gap-1">
                            <input
                              type="text"
                              placeholder="Staff name"
                              id={`staff-${comp._id}`}
                              className="text-xs p-1 border rounded w-28 bg-gray-50 focus:bg-white"
                              defaultValue={comp.assignedTo !== 'Unassigned' ? comp.assignedTo : ''}
                            />
                            <button
                              onClick={() => {
                                const inputVal = document.getElementById(`staff-${comp._id}`).value;
                                handleAssign(comp._id, inputVal);
                              }}
                              className="bg-purple-600 text-white text-[10px] px-2 py-1 rounded hover:bg-purple-700"
                            >
                              Assign
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusBadge}`}>
                          {comp.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={comp.status}
                          onChange={(e) => handleStatusUpdate(comp._id, e.target.value)}
                          className="text-xs p-1 border rounded bg-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
