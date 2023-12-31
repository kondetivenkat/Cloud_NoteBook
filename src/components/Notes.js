import Noteitem from './Noteitem';
import Addnotes from './Addnotes';
import noteContext from '../context/notes/noteContext'
import React,{useContext, useEffect,useRef,useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Notes=(props)=>{
  let history = useNavigate();
  const context=useContext(noteContext);
  const {notes,getNotes,editNotes}=context;
  useEffect(()=>{
    if(localStorage.getItem('token')){
      getNotes();
    }
    else{
      history('/login')
    }
    //eslint-disable-next-line
  },[])
  const ref = useRef(null);
  const refClose = useRef(null);
  const [note,setNote]=useState({id:"",etitle:"",edescription:"",etag:""})
  const onChange=(e)=>{
      setNote({...note,[e.target.name]: e.target.value})
  }
  const handleClick=(e)=>{
    editNotes(note.id,note.etitle,note.edescription,note.etag)
    refClose.current.click();
    props.showAlert("Updated successfully","success")
  }
  const updateNote=(currentNote)=>{
    ref.current.click();
    setNote({ id:currentNote._id,etitle:currentNote.title,edescription:currentNote.description,etag:currentNote.tag});
  }
  return (
    <>
      <Addnotes showAlert={props.showAlert}/>
      <button  type="button" ref={ref} className="btn btn-primary d-none" data-toggle="modal" data-target="#exampleModal">
        Launch demo modal
      </button>


      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
                  <form className="my-3">
                  <div className="mb-3">
                      <label htmlFor="etitle" className="form-label">Title</label>
                      <input type="text" className="form-control" id="etitle" name='etitle' value={note.etitle} aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
                  </div>
                  <div className="mb-3">
                      <label htmlFor="edescription" className="form-label">Description</label>
                      <input type="text" className="form-control" id="edescription" name='edescription' value={note.edescription} onChange={onChange} minLength={5} required/>
                  </div>
                  <div className="mb-3">
                      <label htmlFor="etag" className="form-label">Tag</label>
                      <input type="text" className="form-control" id="etag" name='etag' value={note.etag} onChange={onChange} minLength={5} required/>
                  </div>
              </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button disabled={note.etitle.length<5 || note.edescription.length <5} type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div className='row ml-5 my-3'>
        <h2>Your Note</h2>
        <div className='container'>
          {notes.length===0 && 'NO NOTE TO DISPLAY'}
        </div>
        
        {notes.map((note)=>{
          return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note}/>; 
        })}    
      </div> 
    </>
    
  )
}

export default Notes
