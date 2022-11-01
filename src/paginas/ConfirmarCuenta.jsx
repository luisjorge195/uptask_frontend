import {useEffect, useState} from 'react'
import {useParams, Link } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'

const ConfirmarCuenta = () => {

  const[alerta, setAlerta] = useState({});
  const[ cuentaConfirmada, setCuentaConfirmada ] =  useState(false);
  const params = useParams();
  const {id} = params;
  useEffect(()=>{
    const confirmarCuenta = async()=>{
      try {
          const url = `/usuarios/confirmar/${id}`;
          const { data } = await clienteAxios(url);
          setAlerta({
            msg:data.msg,
            error:false
          })
          setCuentaConfirmada(true);
      } catch (error) {
        setAlerta({
          msg:error.response.data.msg,
          error:true
        })
      }
    }
    confirmarCuenta();
  }, [])

  const { msg} = alerta;
  return (
    <div>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Confirma tu cuenta y crea tus <span className="text-slate-700">proyectos</span></h1>
      <div>
        {msg && <Alerta alerta = {alerta}/>}
        {cuentaConfirmada && (
          <Link
            to="/"
            className="block text-center my-5 text-slate-500 uppercase text-sm"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </div>
  )
}

export default ConfirmarCuenta