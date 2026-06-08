import { useReducer } from "react";
import noteContext from "./noteContext";

const initialState = {
    value: false,
    adminsidebar:false,
    user_name:"User",
    user_room:"0",
    user_mobile:"9876543210",
    user_email:"user@example.com",
    user_photo_url:"vec2.jpg",
    user_username: "",
    user_usn: "",
    user_hostelName: "",
    user_branch: "",
    user_semester: "",
    user_parentMobile: "",
    backend: window.location.hostname,
    port:"5000"
  };
  function reducer(state, action) {
    switch (action.type) {
      case 'UPDATE_VALUE':
        return { ...state, value: action.payload };
      case 'UPDATE_AVALUE':
        return { ...state, adminsidebar: action.payload };
      case 'UPDATE_NAME':
        return { ...state, user_name: action.payload };
      case 'UPDATE_EMAIL':
        return { ...state, user_email: action.payload };
      case 'UPDATE_MOBILE':
        return { ...state, user_mobile: action.payload };
      case 'UPDATE_room':
        return { ...state, user_room: action.payload };
      case 'UPDATE_photo_url':
        return { ...state, user_photo_url: action.payload };
      case 'UPDATE_USERNAME':
        return { ...state, user_username: action.payload };
      case 'UPDATE_USN':
        return { ...state, user_usn: action.payload };
      case 'UPDATE_HOSTEL':
        return { ...state, user_hostelName: action.payload };
      case 'UPDATE_BRANCH':
        return { ...state, user_branch: action.payload };
      case 'UPDATE_SEMESTER':
        return { ...state, user_semester: action.payload };
      case 'UPDATE_PARENT_MOBILE':
        return { ...state, user_parentMobile: action.payload };
      
      default:
        return state;
    }
  }

const NoteState =(props)=>{
 
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <noteContext.Provider value={{state,dispatch}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;

