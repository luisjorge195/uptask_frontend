import {useParams, Link} from 'react-router-dom'
import { useEffect, useState } from 'react'
import useProyectos from '../hooks/useProyectos'
import ModalFormularioTarea from '../components/ModalFormularioTarea'
import Tarea from '../components/Tarea'
const Proyecto = () => {
    const { obtenerProyecto, proyecto, cargando, handleModalTarea } = useProyectos()
  const params = useParams();
  const [modal, setModal] = useState(false)
  useEffect(()=>{
    obtenerProyecto(params.id)
  },[])
  const {nombre} = proyecto;
  return (
    <>
      {
        cargando ? 'cargando...' : (
        <div>
          <div className="flex justify-between">
            <h1 className="font-black text-4xl">{nombre}</h1>
            <div className="flex items-center gap-2 text-gray-400 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
              <Link
                to={`/proyectos/editar/${params.id}`}
                className="uppercase font-bold"
              >
                Editar
              </Link>
            </div>
          </div>
          <button
            onClick={handleModalTarea}
            type="button"
            className="text-sm flex gap-2 items-center justify-center px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 mt-5 text-white text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nueva Tarea
          </button>
          <p className="font-bold text-xl mt-10">Tareas del proyecto</p>
          <div className="bg-white shadow mt-10 rounded-lg">
                          {proyecto.tareas?.length ? proyecto.tareas?.map(tarea => <Tarea key={tarea._id} tarea={tarea} />): <p className="text-center my-5 p-10">No hay tareas en el proyecto</p>}
          </div>
          <ModalFormularioTarea
            modal={modal}
            setModal={setModal}
          />
        </div>  
    
      )}
    </>
  )
}

export default Proyecto