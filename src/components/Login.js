import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const [input,setInput]=useState({email:"",password:""})
    let history =useNavigate();
    const formSubmit=async (e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login",{
            method:"POST",
            headers:{
              'content-type':"application/json",
            },
            body:JSON.stringify({email:input.email,password:input.password})
          })
          const json = await response.json();
          if(json.success){
            localStorage.setItem('token',json.authtoken);
            props.showAlert("logged in successfully","success")
            history("/home");
            
          }
          else{
            props.showAlert("Invalid Credientials","danger")
          }
       }
      const onChange=(e)=>{
        setInput({...input,[e.target.name]: e.target.value})
     }
  return (
    <div className='container mt-3'>
      <h2>Login to iNotebook</h2>
        <form onSubmit={formSubmit}>
            <div className="mb-3">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" value={input.email} onChange={onChange} placeholder="Enter email"/>
            </div>
            <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" name='password' value={input.password} onChange={onChange} placeholder="Password"/>
            </div>
            <button type="submit" className="btn btn-primary" >Submit</button>
      </form>
    </div>
  )
}

export default Login