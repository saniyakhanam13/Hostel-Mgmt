import React, { useState, useEffect, useContext } from 'react';
import noteContext from '../context/noteContext';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

export const Adminfeedback = () => {
  const { state, dispatch } = useContext(noteContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('admintoken')) {
      navigate('/adminsignin');
      return;
    }
    dispatch({ type: 'UPDATE_VALUE', payload: false });
    dispatch({ type: 'UPDATE_AVALUE', payload: true });
    fetchFeedbacks();
  }, [selectedCategory]);

  const fetchFeedbacks = async () => {
    try {
      const url = `http://${state.backend}:${state.port}/api/f/feedback?category=${selectedCategory}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('admintoken'),
        },
      });
      const json = await response.json();
      if (json.response) {
        setFeedbacks(json.feedbacks);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const downloadReport = () => {
    if (feedbacks.length === 0) return;
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Student Name,Email,Category,Subject,Message,Date\n';
    
    feedbacks.forEach((f) => {
      const row = [
        `"${f.name || 'Anonymous'}"`,
        `"${f.email || 'N/A'}"`,
        `"${f.category || 'General'}"`,
        `"${(f.title || '').replace(/"/g, '""')}"`,
        `"${(f.message || '').replace(/"/g, '""')}"`,
        `"${new Date(f.date).toLocaleString('en-IN')}"`,
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Feedback_Report_${selectedCategory}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-fluid py-4" style={{ minHeight: '90vh' }}>
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="font-extrabold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent inline-block">
            Student Feedback Review
          </h3>
          <p className="text-sm text-gray-500">Review feedback submissions categorized by system feature</p>
        </div>
        <button
          onClick={downloadReport}
          disabled={feedbacks.length === 0}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
        >
          <CloudDownloadIcon fontSize="small" /> Export CSV Report
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6 gap-2">
        {['All', 'Hostel', 'Food', 'Maintenance', 'Event'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${
              selectedCategory === category
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Feedbacks Grid */}
      <div className="bg-white rounded-2xl shadow-soft-xl p-6">
        <h5 className="font-bold text-gray-800 mb-4 flex items-center">
          <CalendarMonthIcon className="text-purple-600 mr-2" />
          Feedback Submissions ({feedbacks.length})
        </h5>

        {feedbacks.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No feedback submissions found in this category.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {feedbacks.map((f) => (
              <div key={f._id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all flex flex-col justify-between bg-gray-50">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-purple-100 text-purple-800 rounded-full uppercase">
                      {f.category || 'General'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(f.date).toLocaleDateString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-base mb-1">{f.title}</h4>
                  <p className="text-sm text-gray-600 italic mb-4">"{f.message}"</p>
                </div>
                <div className="border-t pt-3 flex flex-col">
                  <span className="text-xs text-gray-700 font-bold">{f.name}</span>
                  <span className="text-[10px] text-gray-400">{f.email}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
