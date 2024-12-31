import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { IoNotificationsOutline } from "react-icons/io5"
const ShowNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/notifications');
        setNotifications(response.data.notifications);
      } catch (err) {
        setError('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleToggle = (id) => {
    setExpandedNotification(expandedNotification === id ? null : id);
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
        
      <p onClick={()=>setOpen(!open)} style={{position:"absolute",cursor:"pointer", top:"5px",}}>Notifications</p>
      {open && 
      <ul style={{ listStyleType: 'none', padding: "10px",border: '2px solid cadetblue',scrollbarWidth: 'thin',position:"fixed", background:"cadetblue", height:"455px", left:"0px",overflow:"auto", width:"30%", overflow:"auto" }}>
        {notifications.length === 0 ? (
          <li>No notifications</li>
        ) : (
          
          notifications.map((notification) => (
            <div > 
            <li key={notification.id} style={{ marginBottom: '10px', }}>
              <div
                onClick={() => handleToggle(notification.id)}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  color: "black",
                 
                 width:"100%",
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <p style={{ margin: '0' }}><strong>{notification.title}</strong></p>
                <small style={{color:"red"}}>{new Date(notification.created_at).toLocaleString()}</small>
              </div>
              {expandedNotification === notification.id && (
                <div
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderTop: 'none',
                    borderRadius: '0 0 4px 4px',
                    backgroundColor: '#f1f1f1',
                    marginTop: '5px',
                   
                    color:"green",
                    margin:"auto"
                  }}
                >
                  <p>{notification.message}</p>
                </div>
              )}
            </li>
            </div>
          ))
        )}
      </ul>
}
    </div>
  );
};

export default ShowNotification;
