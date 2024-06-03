import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import Swal from 'sweetalert2';


function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true)

  useEffect(() => {

    let todoString = localStorage.getItem('todos');
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem('todos'));
      setTodos(todos)
    }

  }, []);


  const toggleFinished = () => {
    setShowFinished(!showFinished)
  }

  const saveToLS = (params) => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id;
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos)
    saveToLS();
  }

  const handleEdit = (e, id) => {

    let t = todos.filter(i => i.id === id)
    setTodo(t[0].todo);

    let newTodos = todos.filter(item => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS()
  }



  const handleDelete = (e, id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let newTodos = todos.filter(item => {
          return item.id !== id;
        });
        setTodos(newTodos);
        saveToLS();

        Swal.fire(
          'Deleted!',
          'Your item has been deleted.',
          'success'
        );
      }
    });
  };


  const handleAdd = () => {
    Swal.fire({
      title: "Save Successfully!",
      text: "You clicked the button!",
      icon: "success"
    })
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
    setTodo("");
    saveToLS()
  }

  const handleChange = (e) => {
    setTodo(e.target.value)

  }
  return (
    <>
      <Navbar />
      <div className="md:container md:mx-auto mx-3 my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-1/2">
        <h1 className='font-bold text-center text-3xl'>iTask - Manage your todos at one place</h1>
        <div className='addTodo my-5 flex flex-col gap-4'>
          <h2 className='text-2xl font-bold' >Add a todo</h2>
          <div className='flex'>
            <input onChange={handleChange} value={todo} type="text" className='w-full rounded-full px-5 py-1' />
            <button onClick={handleAdd} disabled={todo.length < 3} className='bg-violet-800 disabled:bg-violet-700  mx-3 rounded-full  hover:bg-violet-950 p-4 py-2 text-sm font-bold text-white'>Save</button>
          </div>
        </div>
        <input className='my-4' id="show" onChange={toggleFinished} type="checkbox" checked={showFinished} />
        <label className='mx-2'>Show Finished</label>

        <div className='h-[1px] bg-black opacity-15 w-3/4 mx-auto my-2'>

        </div>

        <h2 className='text-2xl font-bold'>Your Tasks!</h2>

        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Todos to display </div>}
          {
            todos.map((item) => {

              return ((showFinished || !item.isCompleted) && <div key={item.id} className="todo flex my-3 justify-between">

                <div className='flex gap-5'>
                  <input type="checkbox" onChange={handleCheckbox} checked={item.isCompleted} name={item.id} id="" />
                  <div className={item.isCompleted ? "line-through" : ""}>
                    {item.todo}
                  </div>
                </div>



                <div className="buttons flex h-full" >
                  <button onClick={(e) => { handleEdit(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaEdit /></button>
                  <button onClick={(e) => { handleDelete(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><AiFillDelete /></button>
                </div>
              </div>
              )
            })}
        </div>

      </div>
    </>
  )
}

export default App
