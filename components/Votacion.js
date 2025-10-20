'use client'; 

import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa'; 
import { BsArrowRepeat } from 'react-icons/bs'; 

// Recibe 'totalStars' como 10
export default function Votacion({ cursoId, initialVotos, initialEstrellas, nombreCurso, totalStars = 10 }) {
  const [voto, setVoto] = useState(0); 
  const [votadoLocal, setVotadoLocal] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [totalVotos, setTotalVotos] = useState(initialVotos);
  const [totalEstrellas, setTotalEstrellas] = useState(initialEstrellas);

  // NO USAMOS PROMEDIO, SOLO LA SUMA TOTAL
  // const promedio = totalVotos > 0 ? (totalEstrellas / totalVotos).toFixed(1) : 0;
  
  const LOCAL_KEY = `voto_${cursoId}`;

  // ... (useEffect para verificar localStorage, el código sigue igual)

  // 1. Verificar el localStorage al cargar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const yaVoto = localStorage.getItem(LOCAL_KEY);
      if (yaVoto) {
        setVotadoLocal(true);
        setMensaje(`⭐ Ya votaste por ${nombreCurso}. ¡Gracias!`);
      }
    }
  }, [cursoId, LOCAL_KEY, nombreCurso]);


  // 2. Función de envío del voto (manda hasta 10 estrellas)
  const handleSubmitVoto = async () => {
    if (votadoLocal || voto === 0) return;

    setLoading(true);
    setMensaje('');

    try {
      // LLAMADA AL API ROUTE
      const response = await fetch('/api/votar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursoId, estrellas: voto }), // 'voto' será un número del 1 al 10
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('✅ ¡Voto registrado con éxito!');
        localStorage.setItem(LOCAL_KEY, 'true');
        setVotadoLocal(true);
        
        // Actualizar contadores localmente
        setTotalVotos(data.nuevoTotalVotos);
        setTotalEstrellas(data.nuevoTotalEstrellas);
      } else {
        setMensaje(`❌ Error: ${data.error || 'Algo salió mal.'}`);
      }
    } catch (error) {
      console.error('Error al votar:', error);
      setMensaje('❌ Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl">
      
      {/* Contador Actual: Muestra la SUMA TOTAL de Estrellas */}
      <div className="flex justify-center items-center mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
        <div className="text-center">
            <span className="text-6xl font-extrabold text-green-700">{totalEstrellas}</span>
            <span className="text-xl text-green-500"> Estrellas</span>
            <p className="text-sm text-gray-500 mt-1">Sumatoria total de {totalVotos} votos</p>
        </div>
      </div>
      
      {/* Componente de Estrellas (10 estrellas) */}
      <div className="flex justify-center mb-6 gap-2">
        {[...Array(totalStars)].map((_, index) => { // Renderiza 10 estrellas
            const starValue = index + 1;
            return (
                <FaStar
                    key={starValue}
                    size={30} // Más pequeñas para caber 10 en móvil
                    className={`
                      cursor-pointer transition duration-150 ease-in-out
                      ${starValue <= voto ? 'text-yellow-400' : 'text-gray-300'}
                      ${votadoLocal ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                    `}
                    onClick={() => !votadoLocal && setVoto(starValue)}
                    onMouseEnter={() => !votadoLocal && setVoto(starValue)}
                    onMouseLeave={() => !votadoLocal && setVoto(voto)} 
                />
            );
        })}
      </div>
      
      {/* Botón de Votar */}
      <button
        onClick={handleSubmitVoto}
        disabled={votadoLocal || voto === 0 || loading}
        className={`
          w-full py-4 rounded-xl text-lg font-bold transition duration-300 shadow-md 
          ${votadoLocal || voto === 0 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 text-white shadow-green-400/50 hover:shadow-lg'
          }
          flex items-center justify-center
        `}
      >
        {loading ? (
          <>
            <BsArrowRepeat className="animate-spin mr-2" />
            Enviando voto...
          </>
        ) : (
          votadoLocal ? 'VOTO YA REGISTRADO' : `Votar con ${voto} Estrellas`
        )}
      </button>

      {/* Mensajes */}
      <p className={`mt-4 text-center text-sm font-semibold ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
        {mensaje}
      </p>
    </div>
  );
}