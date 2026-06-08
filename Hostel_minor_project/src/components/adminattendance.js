import React, { useState, useEffect, useContext } from 'react';
import noteContext from '../context/noteContext';
import { useNavigate } from 'react-router-dom';
import MoveToInboxRoundedIcon from '@mui/icons-material/MoveToInboxRounded';
import SearchIcon from '@mui/icons-material/Search';

export const Adminattendance = () => {
  const { state, dispatch } = useContext(noteContext);
  const [attendance, setAttendance] = useState([]);
  
  // Set default date filter as today's date string (YYYY-MM-DD)
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    return `${year}-${month}-${day}`;
  };

  const [filterDate, setFilterDate] = useState(getTodayString());
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('admintoken')) {
      navigate('/adminsignin');
      return;
    }
    dispatch({ type: 'UPDATE_VALUE', payload: false });
    dispatch({ type: 'UPDATE_AVALUE', payload: true });
    fetchAttendance();
  }, [filterDate, searchQuery]);

  const fetchAttendance = async () => {
    try {
      const url = `http://${state.backend}:${state.port}/api/a/allattendance?date=${filterDate}&search=${searchQuery}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('admintoken'),
        },
      });
      const json = await response.json();
      if (json.response) {
        setAttendance(json.attendance);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://${state.backend}:${state.port}/api/a/editattendance`, {
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
        fetchAttendance();
      } else {
        setAlert({ type: 'danger', message: json.message });
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: 'danger', message: 'Failed to update attendance record' });
    }
  };

  return (
    <div className="container-fluid py-4" style={{ minHeight: '90vh' }}>
      {/* Title */}
      <div className="mb-4">
        <h3 className="font-extrabold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent inline-block">
          Attendance Administration
        </h3>
        <p className="text-sm text-gray-500">Monitor daily attendance and manually override student records</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show mb-4`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(null)} aria-label="Close"></button>
        </div>
      )}

      {/* Filter Options */}
      <div className="bg-white rounded-2xl shadow-soft-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Filter Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <button
              onClick={() => setFilterDate('')}
              className="text-xs text-purple-600 hover:text-purple-800 font-bold mt-5"
            >
              Clear Date Filter
            </button>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Search Student</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Name or room number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none"
            />
            <SearchIcon className="absolute left-2.5 top-2.5 text-gray-400" fontSize="small" />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-soft-xl p-6">
        <h5 className="font-bold text-gray-800 mb-4 flex items-center">
          <MoveToInboxRoundedIcon className="text-purple-600 mr-2" />
          Attendance History Records ({attendance.length})
        </h5>

        {attendance.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No attendance records found matching filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Room Number</th>
                  <th className="px-6 py-3">Date / Time</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => {
                  let statusBadge = 'bg-red-100 text-red-800';
                  if (record.status === 'Present') statusBadge = 'bg-green-100 text-green-800';

                  return (
                    <tr key={record._id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-800">{record.name}</td>
                      <td className="px-6 py-4">{record.room_no || 'Unallotted'}</td>
                      <td className="px-6 py-4">
                        {new Date(record.date).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusBadge}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={record.status}
                          onChange={(e) => handleStatusUpdate(record._id, e.target.value)}
                          className="text-xs p-1 border rounded bg-white"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
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
