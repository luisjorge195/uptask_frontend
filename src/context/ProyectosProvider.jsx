import {createContext, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../config/clienteAxios';

const ProyectosContext = createContext();

const ProyectosProvider = ({children})=>{
    const [proyectos, setProyectos] = useState([])
    const [proyecto, setProyecto] = useState({})
    const[alerta, setAlerta] = useState({});
    const [cargando, setCargando] = useState(false);
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [tarea, setTarea] = useState({})

    const navigate = useNavigate();

    useEffect(()=>{

        let isActive = true;
        const obtenerProyectos = async ()=>{
            
            try {
                if(isActive){
                    const token = localStorage.getItem('token');
                    if(!token) return;
    
                    const config = {
                        headers:{
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
    
                    const { data }= await clienteAxios('/proyectos', config);
                    setProyectos(data)
                }
                
            } catch (error) {
                console.log(error)
            }
        }
        obtenerProyectos()

        return ()=>{
            isActive = false;
        }
    },[])

    const mostrarAlerta = alerta=>{
        setAlerta(alerta);
        setTimeout(()=>{
            setAlerta({})
        },5000)
    }

    const submitProyecto = async(proyecto)=>{
        if(proyecto.id){
            await editarProyecto(proyecto);
        }
        else{
            await nuevoProyecto(proyecto);
        }
        
    }

    const editarProyecto = async proyecto =>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data }= await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            console.log('data', data)
            //sincronizar el state
            const proyectosActualizados = proyectos.map(proyectoState =>
                proyectoState._id === data._id ? data : proyectoState    
            )
            setProyectos(proyectosActualizados)
            setAlerta({
                msg:'Proyecto actualizado correctamente',
                error: false
            })
            setTimeout(()=>{
                setAlerta('')
                navigate('/proyectos');
            },3000)
            
        } catch (error) {
            console.log(error)
        }
    }
    const nuevoProyecto = async proyecto =>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/proyectos', proyecto, config);
            setProyectos([...proyectos, data]);
            setAlerta({
                msg:'Proyecto creado correctamente',
                error: false
            })
            setTimeout(()=>{
                setAlerta('')
                navigate('/proyectos');
            },3000)
        }   
         catch (error) {
            console.log(error)
        }
    }

    const obtenerProyecto = async (id)=>{
        setCargando(true)
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios(`/proyectos/${id}`, config);
            setProyecto(data)
        }
         catch (error) {
            console.log(error)
        }
        finally{
            setCargando(false)
        }
    }

    const eliminarProyecto = async (id)=>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);

            //sincronizar el strategy
            const proyectosActualizados = proyectos.filter(proyectoState=>
                proyectoState._id!==id);
            setProyectos(proyectosActualizados)
            setAlerta({
                msg:data.msg,
                true:false
            })
            setTimeout(()=>{
                setAlerta('')
                navigate('/proyectos');
            },3000)

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalTarea =()=>{
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})//cadea vez qu7e se crea una tarea dejar el modal vacio
    }

    const submitTarea = async (tarea) => {
        if(tarea?.id){
            await editarTarea(tarea)
        }
        else{
            await crearTarea(tarea)
        }
        
    }

    const crearTarea = async tarea=>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post('/tareas', tarea, config);

            //agrega la tarea al state
            const proyectoActualizado ={...proyecto }
            proyectoActualizado.tareas = [...proyecto.tareas, data]
            setProyecto(proyectoActualizado)
            setAlerta({});
            setModalFormularioTarea(false)
        } catch (error) {
            console.log(error)
        }
    }

    const editarTarea = async tarea=>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState=>
                tareaState._id== data._id ? data : tareaState  
                //si el id de la tareaState es igual a la de data._id  actualizo el estado, si no deja la tarea que esta actualmente
            )
            setProyecto(proyectoActualizado)
            setAlerta({});
            setModalFormularioTarea(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalEditarTarea = (tarea) => {
        setTarea(tarea);
        setModalFormularioTarea(true)
    }

    return(
        <ProyectosContext.Provider
            value={{
                mostrarAlerta,
                alerta,
                proyectos,
                setProyectos,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                handleModalTarea,
                modalFormularioTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}
export {ProyectosProvider}
export default ProyectosContext