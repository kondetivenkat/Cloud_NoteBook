import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const Signup = (props) => {
  const [input,setInput]=useState({name:"",email:"",password:"",cpassword:""});
  let history =useNavigate();
  const formSubmit=async (e)=>{
    e.preventDefault();
    const {name,email,password}=input;
    const response = await fetch("http://localhost:5000/api/auth/createuser",{
        method:"POST",
        headers:{
          'content-type':"application/json",
        },
        body:JSON.stringify({name,email,password})
      })
      const json = await response.json();
      if(json.success){
        localStorage.setItem('token',json.authtoken);
        history("/home");
        props.showAlert("user successfully created","success")
      }
      else{
        props.showAlert("Invalid Cridentials","danger")
      }
   }
  const onChange=(e)=>{
    setInput({...input,[e.target.name]: e.target.value})
 }
  return (
    <div className='container mt-3'>
      <h2>Create account to iNotebook</h2>
        <form onSubmit={formSubmit}>
        <div className="my-3">
                <label htmlFor="name">Name</label>
                <input type="name" className="form-control" id="name" name='name' aria-describedby="name"  onChange={onChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" name='password'  onChange={onChange}  minLength={5} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="cpassword">Confirm Password</label>
                <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} minLength={5} required/>
            </div>
            <button type="submit" className="btn btn-primary" >Submit</button>
      </form>
    </div>
  )
}

export default Signup;