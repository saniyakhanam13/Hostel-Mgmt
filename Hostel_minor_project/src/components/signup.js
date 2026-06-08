import React,{useEffect,useContext,useState} from 'react'
import { Link, useNavigate } from "react-router-dom";
import noteContext from '../context/noteContext'
export const Signup = () => {
    const { state, dispatch } = useContext(noteContext);
    const [alertstate, setalertstate] = useState("secondary");
    const [alertdisplay, setalertdisplay] = useState("displaynone");
    const [alertText, setalertText] = useState("secondary");
    const [email_input, setemail_input] = useState("");
    const [name_input, setname_input] = useState("");
    const [password_input, setpassword_input] = useState("");
    const [mobile_input, setmobile_input] = useState("");
    const [username_input, setusername_input] = useState("");
    const [usn_input, setusn_input] = useState("");
    const [hostel_input, sethostel_input] = useState("MBH F");
    const [branch_input, setbranch_input] = useState("");
    const [semester_input, setsemester_input] = useState("");
    const [parent_mobile_input, setparent_mobile_input] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
  
  if(localStorage.getItem('token')){navigate("/home")}
  
});

const handlesubmit =async (e)=>{
    setalertdisplay('displaynone')
    const email=email_input
    const name=name_input
    const password=password_input
    const mobile=mobile_input
    e.preventDefault();
    const response=await fetch(`http://${state.backend}:${state.port}/api/auth/createuser`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            email:email,
            password:password,
            mobile:mobile,
            name:name,
            username: username_input,
            usn: usn_input,
            hostelName: hostel_input,
            branch: branch_input,
            semester: semester_input,
            parentMobile: parent_mobile_input
        })
});
    const json=await response.json();
    if(json.response){
        setalertstate('success')
        setalertText(json.message)
        setalertdisplay("")
        setTimeout(() => navigate("/signin"), 1500);
    }else{
        setalertstate('danger')
        setalertText(json.message)
        setalertdisplay("")
    }
}


  return (
   <>
   <div className="container signinbox" style={{height:"auto", minHeight:"100vh", padding:"20px 0"}}>
   <section className="bg-gray-50 dark:bg-gray-900" style={{backgroundColor:"transparent"}}>
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto sectonexdiv" style={{height:"auto", minHeight:"100vh"}}>
      <a href="#" className="flex flex-col items-center mb-6 text-gray-900 dark:text-white">
          <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Campus Stay</span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Smart Hostel Management for Modern Campuses</span>
      </a>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
              </h1>

              <div className={`${alertdisplay} alert alert-${alertstate}`} id='loginalert' style={{ outline:'none',border:'none',borderRadius:'10px',}} role="alert">
                {alertText}
                </div>

              <form className="space-y-4" action="#" onSubmit={handlesubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white dlabel">Full Name</label>
                          <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={name_input} onChange={(e)=>{ setname_input(e.target.value) }} placeholder="John Doe" required />
                      </div>
                      <div>
                          <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white dlabel">Username</label>
                          <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={username_input} onChange={(e)=>{ setusername_input(e.target.value) }} placeholder="johndoe12" required />
                      </div>
                      <div>
                          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white dlabel">Your email</label>
                          <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={email_input} onChange={(e)=>{ setemail_input(e.target.value) }}  placeholder="name@company.com" required />
                      </div>
                      <div>
                          <label htmlFor="mobile" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white dlabel">Mobile</label>
                          <input type="text" name="mobile" id="mobile" placeholder="9876543210" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={mobile_input} onChange={(e)=>{ setmobile_input(e.target.value) }}  required />
                      </div>
                      <div>
                          <label htmlFor="usn" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white dlabel">USN / Reg No</label>
                          <input type="text" name="usn" id="usn" placeholder="1XX22CS001" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={usn_input} onChange={(e)=>{ setusn_input(e.target.value) }}  required />
                      </div>
                      <div>
                          <label htmlFor="hostel" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white dlabel">Hostel Name</label>
                          <input type="text" name="hostel" id="hostel" placeholder="MBH F" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={hostel_input} onChange={(e)=>{ sethostel_input(e.target.value) }}  required />
                      </div>
                      <div>
                          <label htmlFor="branch" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white dlabel">Branch</label>
                          <input type="text" name="branch" id="branch" placeholder="CSE" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={branch_input} onChange={(e)=>{ setbranch_input(e.target.value) }}  required />
                      </div>
                      <div>
                          <label htmlFor="semester" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white dlabel">Year / Semester</label>
                          <input type="text" name="semester" id="semester" placeholder="3rd Year / 6th Sem" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={semester_input} onChange={(e)=>{ setsemester_input(e.target.value) }}  required />
                      </div>
                      <div>
                          <label htmlFor="parentMobile" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white dlabel">Parent Mobile</label>
                          <input type="text" name="parentMobile" id="parentMobile" placeholder="9876543211" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={parent_mobile_input} onChange={(e)=>{ setparent_mobile_input(e.target.value) }}  required />
                      </div>
                      <div>
                          <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white dlabel">Password</label>
                          <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={password_input} onChange={(e)=>{ setpassword_input(e.target.value) }}  required min={6}/>
                      </div>
                  </div>
                
                 
                  <button onClick={handlesubmit} type="submit" id='signup_submit' className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" style={{marginTop:"20px"}}>Create an account</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                      Already have an account? <Link to="/signin" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
   </div>
   </>
  )
}
