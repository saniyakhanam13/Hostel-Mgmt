import React, { useState, useEffect, useContext } from 'react';
import noteContext from '../context/noteContext';
import { useNavigate } from 'react-router-dom';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SearchIcon from '@mui/icons-material/Search';

export const Events = () => {
  const { state, dispatch } = useContext(noteContext);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [participation, setParticipation] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/signin');
      return;
    }
    dispatch({ type: 'UPDATE_VALUE', payload: true });
    dispatch({ type: 'UPDATE_AVALUE', payload: false });
    fetchEvents();
    fetchParticipation();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://${state.backend}:${state.port}/api/events/getevents`);
      const json = await response.json();
      if (json.response) {
        setEvents(json.events);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchParticipation = async () => {
    try {
      const response = await fetch(`http://${state.backend}:${state.port}/api/events/participation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });
      const json = await response.json();
      if (json.response) {
        setParticipation(json.events);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const registerForEvent = async (eventId) => {
    setAlert(null);
    try {
      const response = await fetch(`http://${state.backend}:${state.port}/api/events/registerevent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ eventId }),
      });
      const json = await response.json();
      if (json.response) {
        setAlert({ type: 'success', message: json.message });
        fetchEvents();
        fetchParticipation();
      } else {
        setAlert({ type: 'danger', message: json.message });
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: 'danger', message: 'Failed to register. Server error.' });
    }
  };

  // Filter lists based on status
  const upcomingEvents = events.filter((e) => e.status.toLowerCase() === 'upcoming');
  const ongoingEvents = events.filter((e) => e.status.toLowerCase() === 'ongoing');
  const completedEvents = events.filter((e) => e.status.toLowerCase() === 'completed');

  // Archive searches
  const archivedEvents = events.filter((e) => {
    const query = searchQuery.toLowerCase();
    return (
      (e.status.toLowerCase() === 'completed' || e.status.toLowerCase() === 'archived') &&
      (e.name.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.venue.toLowerCase().includes(query))
    );
  });

  // Extract all photos for the Gallery
  const galleryPhotos = events.reduce((acc, current) => {
    if (current.galleryPhotos && current.galleryPhotos.length > 0) {
      current.galleryPhotos.forEach((photo) => {
        acc.push({
          url: photo,
          eventName: current.name,
          date: current.date,
        });
      });
    }
    return acc;
  }, []);

  const openCertificate = (event) => {
    setSelectedCert(event);
  };

  const printCertificate = () => {
    window.print();
  };

  return (
    <div className="container-fluid py-4" style={{ minHeight: '90vh' }}>
      {/* Page Title */}
      <div className="mb-4">
        <h3 className="font-extrabold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent inline-block">
          College Events & Activities
        </h3>
        <p className="text-sm text-gray-500">Discover, register, and check history of campus stay events</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show mb-4`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(null)} aria-label="Close"></button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6 gap-2">
        {[
          { id: 'upcoming', label: 'Upcoming Events' },
          { id: 'ongoing', label: 'Ongoing Events' },
          { id: 'completed', label: 'Completed Events' },
          { id: 'gallery', label: 'Event Gallery' },
          { id: 'participation', label: 'My Participation' },
          { id: 'archive', label: 'Event Archive' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl shadow-soft-xl p-6 min-h-[400px]">
        {/* UPCOMING EVENTS */}
        {activeTab === 'upcoming' && (
          <div>
            <h5 className="font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2.5 h-6 bg-purple-600 rounded-full mr-2"></span>
              Join Upcoming Events
            </h5>
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No upcoming events listed at this time.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <div key={event._id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all flex flex-col justify-between">
                    <div>
                      <span className="px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-800 rounded-full uppercase">
                        {event.venue}
                      </span>
                      <h4 className="font-bold text-gray-800 mt-2 text-lg">{event.name}</h4>
                      <p className="text-xs text-gray-400 font-semibold mb-2">
                        {new Date(event.date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>
                    </div>
                    <div className="mt-4 border-t pt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-semibold">
                        {event.participationCount || 0} Registered
                      </span>
                      <button
                        onClick={() => registerForEvent(event._id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ONGOING EVENTS */}
        {activeTab === 'ongoing' && (
          <div>
            <h5 className="font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2.5 h-6 bg-red-500 rounded-full mr-2"></span>
              Ongoing Live Events
            </h5>
            {ongoingEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-10">There are no events running live right now.</p>
            ) : (
              <div className="space-y-6">
                {ongoingEvents.map((event) => (
                  <div key={event._id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all">
                    <div className="flex flex-wrap justify-between items-start">
                      <div>
                        <span className="px-2.5 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full uppercase animate-pulse mr-2">
                          Live
                        </span>
                        <span className="px-2.5 py-1 text-xs font-bold bg-gray-100 text-gray-800 rounded-full uppercase">
                          {event.venue}
                        </span>
                        <h4 className="font-bold text-gray-800 mt-2 text-xl">{event.name}</h4>
                      </div>
                      <span className="text-sm text-gray-500 font-bold">
                        {event.participationCount || 0} Participants
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                    {event.liveUpdates && (
                      <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-xs text-red-700 font-bold uppercase tracking-wider mb-1">Live Updates</p>
                        <p className="text-sm text-gray-700 font-semibold">{event.liveUpdates}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMPLETED EVENTS */}
        {activeTab === 'completed' && (
          <div>
            <h5 className="font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2.5 h-6 bg-green-500 rounded-full mr-2"></span>
              Event Winners & Achievements
            </h5>
            {completedEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No completed events history found.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {completedEvents.map((event) => (
                  <div key={event._id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2.5 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full uppercase">
                        Completed
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">{event.name}</h4>
                    <p className="text-xs text-gray-600 mb-3">{event.description}</p>
                    
                    {event.winners && (
                      <div className="p-3.5 bg-yellow-50 rounded-xl border border-yellow-100 flex items-start mb-3">
                        <WorkspacePremiumIcon className="text-yellow-600 mr-2" />
                        <div>
                          <p className="text-xs text-yellow-800 font-bold uppercase">Winners</p>
                          <p className="text-sm text-gray-800 font-semibold">{event.winners}</p>
                        </div>
                      </div>
                    )}
                    {event.achievements && (
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500 font-bold uppercase">Highlights</p>
                        <p className="text-sm text-gray-700">{event.achievements}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EVENT GALLERY */}
        {activeTab === 'gallery' && (
          <div>
            <h5 className="font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2.5 h-6 bg-pink-500 rounded-full mr-2"></span>
              Campus Stay Gallery
            </h5>
            {galleryPhotos.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No event gallery photos available yet.</p>
            ) : (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {galleryPhotos.map((photo, index) => (
                  <div key={index} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all aspect-square border">
                    <img src={photo.url} alt={photo.eventName} className="w-full h-full object-cover transition-all group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all p-3 flex flex-col justify-end text-white">
                      <p className="font-bold text-sm leading-tight">{photo.eventName}</p>
                      <p className="text-[10px] text-gray-300">
                        {new Date(photo.date).toLocaleDateString('en-IN', { dateStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MY PARTICIPATION */}
        {activeTab === 'participation' && (
          <div>
            <h5 className="font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2.5 h-6 bg-blue-600 rounded-full mr-2"></span>
              Your Event Participation
            </h5>
            {participation.length === 0 ? (
              <p className="text-gray-500 text-center py-10">You have not registered for any events yet.</p>
            ) : (
              <div className="space-y-4">
                {participation.map((event) => (
                  <div key={event._id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all">
                    <div>
                      <h4 className="font-bold text-gray-800 text-base">{event.name}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                      </p>
                      <p className="text-xs text-purple-600 font-semibold mt-1">Status: {event.status}</p>
                    </div>
                    {event.status.toLowerCase() === 'completed' ? (
                      <button
                        onClick={() => openCertificate(event)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1 shadow-sm transition-all"
                        data-bs-toggle="modal"
                        data-bs-target="#certModal"
                      >
                        <WorkspacePremiumIcon fontSize="small" /> Certificate
                      </button>
                    ) : (
                      <span className="text-xs text-yellow-600 font-bold bg-yellow-50 px-2 py-1 rounded border">
                        Registered
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EVENT ARCHIVE */}
        {activeTab === 'archive' && (
          <div>
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
              <h5 className="font-bold text-gray-800 flex items-center m-0">
                <span className="w-2.5 h-6 bg-gray-500 rounded-full mr-2"></span>
                Event Archive
              </h5>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search previous events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none"
                />
                <SearchIcon className="absolute left-2.5 top-2 text-gray-400" fontSize="small" />
              </div>
            </div>

            {archivedEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No archived events match your search query.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Event Name</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Venue</th>
                      <th className="px-6 py-3">Winners</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivedEvents.map((event) => (
                      <tr key={event._id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-gray-800">{event.name}</td>
                        <td className="px-6 py-4">
                          {new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </td>
                        <td className="px-6 py-4">{event.venue}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-yellow-700">
                          {event.winners || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      <div className="modal fade" id="certModal" tabIndex="-1" aria-labelledby="certModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title font-bold text-gray-800">Participation Certificate</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4 flex justify-center bg-gray-50">
              {selectedCert && (
                <div
                  id="certificate-print-area"
                  className="w-full max-w-[650px] aspect-[1.414] bg-white border-[16px] border-double border-purple-800 p-8 flex flex-col justify-between items-center text-center shadow-lg relative overflow-hidden"
                >
                  {/* Decorative Border Corner */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-purple-600"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-purple-600"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-purple-600"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-purple-600"></div>

                  <div className="mt-4">
                    <h2 className="font-serif text-3xl font-bold text-purple-900 tracking-wider">CAMPUS STAY</h2>
                    <p className="text-xs uppercase font-sans font-bold tracking-widest text-purple-600 mt-1">
                      Certificate of Participation
                    </p>
                  </div>

                  <div className="my-4">
                    <p className="font-serif italic text-sm text-gray-500">This is proudly presented to</p>
                    <h3 className="font-serif font-bold text-2xl text-purple-800 border-b border-gray-300 pb-1 mt-2 mx-auto inline-block min-w-[250px]">
                      {state.user_name}
                    </h3>
                    <p className="font-sans text-xs text-gray-500 mt-3 max-w-[420px] mx-auto leading-relaxed">
                      for successfully participating in the campus staying event{' '}
                      <span className="font-bold text-gray-700">"{selectedCert.name}"</span> held at{' '}
                      <span className="font-bold text-gray-700">{selectedCert.venue}</span> on{' '}
                      {new Date(selectedCert.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}.
                    </p>
                  </div>

                  <div className="w-full flex justify-around mt-4 pb-4 border-t pt-4">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-[1px] bg-gray-400 mt-6"></div>
                      <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">Hostel Warden</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <WorkspacePremiumIcon className="text-purple-800 mb-1" fontSize="medium" />
                      <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Verified Stay</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-[1px] bg-gray-400 mt-6"></div>
                      <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">Event Coordinator</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary text-xs" data-bs-dismiss="modal">
                Close
              </button>
              <button onClick={printCertificate} className="btn btn-primary bg-purple-600 border-none text-xs text-white hover:bg-purple-700">
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
