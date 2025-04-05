import { useEffect, useState } from 'react';
import React  from 'react';
import {Table,TabContainer,Row,Col,Button,ButtonGroup,Form,Navbar, Container} from 'react-bootstrap';
import './App.css';
import axios from "axios";
import {toast,ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api="http://localhost:5000/users"

const initialState={
  name:"",
  email:"",
  contact:"",
  sity:""
};

function App(){
  const [state,setState]=useState(initialState);
  const [data,setData] =useState([]);
  const[userId,setUserId] =useState(null);
  const[editMode,setEditMod]=useState(false);

  const {name,email,contact,sity}=state;

  const loadUsers = async ()=>{
    const response = await axios.get(api);
    setData(response.data);
  };
  useEffect(()=>{
    loadUsers();
  },[]);

const handleChange =(e)=>{
  let {name,value}=e.target;
  setState({...state,[name]:value});
};
const handleDelete =async(id)=>{
  if(window.confirm("Are Yiu Wanted To Delete User ?")){
    axios.delete(`${api}/${id}`);
    toast.success("User Deleted successfully");
    setTimeout(()=>
      loadUsers(),500);
  }
}
const handleUpdate =(id)=>{
  const singleUser =data.find((item)=> item.id == id);
  setState({...singleUser});
  setUserId(id);
  setEditMod(true);
}

  const handleSubmit =(e) => {
    e.preventDefault();
    if(!name || !email || !contact || !sity){
      toast.error("Please fill all the fields");
    }
    else{
      if(!editMode){
        axios.post(api,state);
        setState({name:"",email:"",contact:"",sity:""});
        toast.success("User added successfully");
        setTimeout(()=>
          loadUsers(),500);
      }
      else{
        axios.put(`${api}/${userId}`,state);
        setState({name:"",email:"",contact:"",sity:""});
        toast.success("Updated successfully");
        setTimeout(()=>
          loadUsers(),500);
        setUserId(null);
        setEditMod(false);
      }
  }
}
  return(
    <>
    <ToastContainer/>
    <Navbar bg='primary' variant='dark' className='justify-content-center' >
      <Navbar.Brand>
        STUDENT DETAIL COLLECTING
      </Navbar.Brand>
    </Navbar>
    <Container style={{marginTop:"70px"}}>
      <Row>
        <Col md={4}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Name" name='name' value={name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name='email' value={email} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Contact</Form.Label>
              <Form.Control type="text" placeholder="Enter Contact Number" name='contact' value={contact} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" placeholder="Enter sity" name='sity' value={sity} onChange={handleChange} />
            </Form.Group>

            <Button variant="primary" type="submit">
              {editMode ? "Update": "Submit"}
            </Button>
          </Form>
        </Col>
        <Col md={8}>
        <Table bordered hover>
          <thead>
            <tr>
              <td>No.</td>
              <td>Name</td>
              <td>Email</td>
              <td>Contact</td>
              <td>Sity</td>
              <td>Action</td>
            </tr>
          </thead>
          { data && data.map((item,index)=>(
            <tbody key={index}>
              <tr>
                <td>{index+1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.contact}</td>
                <td>{item.sity}</td>
                <td>
                  <ButtonGroup>
                    <Button variant='success' style={{marginRight:"5px"}} onClick={()=>handleUpdate(item.id)} >Update</Button>
                    <Button variant='danger' style={{marginRight:"5px"}} onClick={()=>handleDelete(item.id)}>Delete</Button>
                  </ButtonGroup>
                </td>
              </tr>
            </tbody>
          ))}
        </Table>
        </Col>
      </Row>

    </Container>
    </>
  )
}
export default App;
