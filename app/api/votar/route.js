import { db } from '@/lib/firebase';
import { collection, doc, runTransaction, getDoc, setDoc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { cursoId, estrellas } = await request.json();

    if (!cursoId || typeof estrellas !== 'number' || estrellas < 1 || estrellas > 10) {
      return new Response(JSON.stringify({ error: 'Datos de voto inválidos.' }), { status: 400 });
    }

    // --- 1. Obtener IP del Dispositivo (Restricción de Voto Único) ---
    // En Vercel, la IP se pasa típicamente en este header
    const userIP = request.headers.get('x-forwarded-for') || 'local-ip'; 

    const votacionRef = doc(collection(db, 'votaciones'), `${cursoId}_${userIP}`);
    const votacionSnap = await getDoc(votacionRef);

    // Si ya existe un documento para esta IP y curso, rechazar
    if (votacionSnap.exists()) {
      return new Response(
        JSON.stringify({ error: 'Ya has votado por este curso desde este dispositivo.' }),
        { status: 403 }
      );
    }
    
    // --- 2. Transacción de Firestore (Restricción de 10 Votos) ---
    const contadorRef = doc(db, 'contadores', cursoId);
    let nuevoTotalVotos = 0;
    let nuevoTotalEstrellas = 0;

    await runTransaction(db, async (transaction) => {
      const contadorDoc = await transaction.get(contadorRef);
      
      let currentTotalVotos = 0;
      let currentTotalEstrellas = 0;

      if (contadorDoc.exists()) {
        currentTotalVotos = contadorDoc.data().totalVotos || 0;
        currentTotalEstrellas = contadorDoc.data().totalEstrellas || 0;
      }

      // Restricción: Límite de 10 votos
      if (currentTotalVotos >= 10) {
        throw new Error('El límite de 10 votos para este curso ha sido alcanzado.');
      }

      // Actualizar contadores
      nuevoTotalVotos = currentTotalVotos + 1;
      nuevoTotalEstrellas = currentTotalEstrellas + estrellas;
      
      // Escribir la actualización
      transaction.set(contadorRef, {
        totalVotos: nuevoTotalVotos,
        totalEstrellas: nuevoTotalEstrellas,
      });

      // Escribir el registro del voto (para la restricción de IP)
      transaction.set(votacionRef, {
          cursoId: cursoId,
          ip: userIP,
          estrellas: estrellas,
          timestamp: new Date().toISOString()
      });
    });
    
    // Si la transacción fue exitosa
    return new Response(
      JSON.stringify({ 
        message: 'Voto registrado', 
        nuevoTotalVotos, 
        nuevoTotalEstrellas 
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Fallo en el servidor de votación:', error);
    
    // Manejar el error de límite de 10 votos
    if (error.message.includes('límite de 10 votos')) {
         return new Response(
            JSON.stringify({ error: error.message }),
            { status: 403 }
        );
    }

    return new Response(JSON.stringify({ error: 'Fallo interno del servidor.' }), { status: 500 });
  }
}