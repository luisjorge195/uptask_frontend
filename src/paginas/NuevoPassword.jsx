import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'

const NuevoPassword = () => {
  const [tokenValido, setTokenValido] = useState(false)
    const [alerta, setAlerta] = useState({})
    const [password, setPassword] = useState('')
  const params = useParams();
  const {token}= params
  const handleSubmit = async(e) => {
    e.preventDefault();
      if (password.length < 6) {
        setAlerta({
          msg:'el password debe ser minimo de seis caracteres',
          error: true
        })
        return
      }
      try{
        const url =`/usuarios/olvide-password/${token}`
        const { data } = await clienteAxios.post(url,{password});
        setAlerta({
          msg: data.msg,
          error: false
        })
      }catch(error){
        setAlerta({
          msg:error.response.data.msg,
          error: true
        })
      }

  }
  useEffect(()=>{
    const comprobarToken = async ()=>{
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`)
        setTokenValido(true)
      } catch (error) {
        setAlerta({
          msg:error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken()
  },[])
  const {msg} = alerta;
  return (
    <div>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Restablece tu password y no pierdas acceso a tus <span className="text-slate-700">proyectos</span></h1>
      {msg && <Alerta alerta = {alerta}/>}
      {tokenValido && (
        <form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>
          <div className="my-5">
          <label
          htmlFor='password'
          className="uppercase text-gray-600 block text-xl font-bold"
          >Nuevo Password</label>
          <input
          id="password"
          type="Password"
          placeholder='Escribe tu nuevo Password'
          className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          />
        </div>
      
        <input
        className="bg-sky-700 w-full mb-5 py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        type="submit"
        value="Guardar nuevo password"
        />
      </form>
      )}
    </div>
  )
}

export default NuevoPassword
