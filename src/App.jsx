import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Task  from './components/Task';
import './App.css'
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';


function App() {

const uri='http://localhost:8082';
const username = 'test';
const password = 'test';
const [tasks,setTasks]=useState([]);
const [reload,setReload]=useState(false);
const [modal,setModal]=useState(false);
const [taskData,setTaskData]=useState({
  title:'',
  description:''
})
const [error, setError] = useState('');

useEffect(()=>{
    getAllTaks()
   },[])  

useEffect(()=>{
    if(reload){
      getAllTaks();
    }
    setReload(false);
   },[reload])


const handleChange = (e) => {
    const { name, value } = e.target;
  
    setTaskData({
      ...taskData,
      [name]: value
    });
    setError('');
  };   


  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!taskData.title || !taskData.description){
      setError('Todos los campos son Obligatorios');
      return;
    }
    
    try {
      const response = await axios.post(`${uri}/task`, taskData, {
        auth: {
          username,
          password
        }
      });

      if (response.status === 201) {
        setReload(true);
        setModal(false);
        setTaskData({ title: '', description: '' }); 
      }
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  };
async function getAllTaks() {
  
  const response = await axios.get(`${uri}/task`,{
    auth: {
      username: username,
      password: password
    }
  });

  if(response.status==200 && response.data!=null){
    setTasks(response.data)
  }
}

async function deleteTask(task){
  console.log(`id ${task.id}`)
  const response = await axios.delete(`${uri}/task/${task.id}`,{
    auth: {
      username: username,
      password: password
    }
  });

  if(response.status==200){
    setReload(true);
  }
}



  return (
    <>
      <div>
      <button className="btn btn-primary mb-3" onClick={()=>setModal(true)} >
          Crear Tarea
        </button>
      </div>
      <main className="container-xl mt-5">
        <h2 className="text-center">Listas de Tareas</h2>

        <div className="row mt-5">
          {tasks.map((task) => (
            <Task key={task.id} 
            task={task}
            deleteTask={deleteTask} />
          ))}
        </div>
      </main>


      <Modal show={modal} onHide={() => setModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
            <>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Título de la tarea:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="description">Descripción:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={taskData.description}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <br></br>
            
            {error && <p className="text-danger">{error}</p>}
          </form>
          
            
            </>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" form="create-task" type="submit"  onClick={handleSubmit}>
            Crear
          </Button>
          
         
        </Modal.Footer>
      </Modal> 
    </>
    
  )
}

export default App
