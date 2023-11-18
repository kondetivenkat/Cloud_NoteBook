import React, { useState } from 'react'
import noteContext from './noteContext'

const NoteState=(props)=>{
  const host = 'http://localhost:5000';
    const noteIntial=[]
    const [notes,setNotes] =useState(noteIntial);

    const getNotes=async ()=>{
     const response = await fetch(`${host}/api/notes/getnotes`,{
       method:"GET",
       headers:{
         'content-type':"application/json",
         "auth-token":localStorage.getItem('token')
       },
     })
     const json = await response.json();
     setNotes(json)
     }
    const addNote=async (title,description,tag)=>{  
     // add a note api call
    const response = await fetch(`${host}/api/notes/addnotes`,{
      method:"POST",
      headers:{
        'content-type':"application/json",
        "auth-token":localStorage.getItem('token')
      },
      body:JSON.stringify({title,description,tag})
    });
    const note = await response.json();
    setNotes(notes.concat(note))
    }
    // delete a note
    const deleteNote=async (id)=>{

       const response = await fetch(`${host}/api/notes/deletenote/${id}`,{
        method:"DELETE",
        headers:{
          'content-type':"application/json",
          "auth-token":localStorage.getItem('token')
        },
      })
      const json= await response.json();
      const newNote = notes.filter((note)=>{return note._id!==id})
      setNotes(newNote)
    }
    
    //edit notes
    const editNotes=async (id,title,description,tag)=>{
      
      const response = await fetch(`${host}/api/notes/updatenote/${id}`,{
        method:"PUT",
        headers:{
          'content-type':"application/json",
          "auth-token":localStorage.getItem('token')
        },
        body:JSON.stringify({title,description,tag})
      })
      const json= await response.json();
      let newNotes = JSON.parse(JSON.stringify(notes));
      for(let i=0;i<notes.length;i++){
        const element = newNotes[i];
        if(element._id===id){
          newNotes[i].title=title;
          newNotes[i].description=description;
          newNotes[i].tag=tag
        }
        break;
      }
      setNotes(newNotes);
    }

  return (
    <noteContext.Provider value={{notes,addNote,deleteNote,editNotes,getNotes}}>
        {props.children}
    </noteContext.Provider>
  )
}

export default NoteState;

