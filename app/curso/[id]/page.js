import { notFound } from 'next/navigation';
import Image from 'next/image'; // Importar el componente Image de Next.js
import { cursosData } from '@/data/cursos';
import Votacion from '@/components/Votacion';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

// ... (Función getCourseData sigue igual)
async function getCourseData(id) {
    // ... (código para obtener datos estáticos y contadores de Firebase)
    const curso = cursosData.find(c => c.id === id);
    if (!curso) {
        return null;
    }

    const contadorRef = doc(db, 'contadores', id);
    const contadorSnap = await getDoc(contadorRef);
    const contadorInicial = contadorSnap.exists() 
        ? contadorSnap.data() 
        : { totalEstrellas: 0, totalVotos: 0 };
    
    return { ...curso, ...contadorInicial };
}


export default async function CursoPage({ params }) {
   
    const { id } = await params;
    const cursoData = await getCourseData(id);

    if (!cursoData) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center p-4">
            
            {/* 1. Encabezado con Títulos y Logo */}
           <header className="w-full max-w-lg pt-3 pb-1 mb-4 border-b-2 border-green-100 flex justify-between items-start">
                <div className="leading-tight">
                    <h1 className="text-base font-bold text-green-700">EXPOFERIA MULTIDISCIPLINARIA</h1>
                    <h2 className="text-xl font-extrabold text-green-900 mt-0.5">U. E. JOSÉ BALLIVIÁN - A</h2>
                </div>
                {/* Asumiendo que el logo está en /public/logo.png */}
               <Image 
                    src="/logo.png" 
                    alt="Logo del Colegio" 
                    width={50} 
                    height={50} 
                    // CAMBIO CLAVE: Agregamos w-[50px] y h-[50px]
                    className="rounded-lg shadow-md object-cover w-[50px] h-[50px]" 
                />
            </header>

            

          {/* 2. Información del Curso (MODIFICADO: Asesores en recuadro y Botón) */}
            <section className="w-full max-w-lg bg-green-50 p-6 rounded-xl shadow-xl border-t-4 border-green-600 mb-6">
                <p className="text-lg text-green-600 font-semibold uppercase">{cursoData.curso}</p>
                <h3 className="text-4xl font-black text-green-900 mt-1 mb-3">
                    {cursoData.nombre}
                </h3>
                <p className="text-gray-600 italic mt-3">{cursoData.descripcion}</p>

                {/* Recuadro de Asesores */}
                {/* Recuadro de Asesores MODIFICADO */}
                <div className="mt-4 pt-3 px-3 py-2 bg-green-100/50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-bold mb-2">Asesores:</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                        {/* Mapea y renderiza cada asesor como un 'chip' visualmente separado */}
                        {cursoData.asesores.map((asesor, index) => (
                            <span 
                                key={index} 
                                className="px-3 py-1 bg-white rounded-full font-medium text-gray-800 shadow-sm border border-green-300"
                            >
                                {asesor}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Botón Descargar Tríptico (sigue igual) */}
                {cursoData.tripticoUrl && cursoData.tripticoUrl !== '#' && (
                    <a 
                        href={cursoData.tripticoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 w-full flex justify-center items-center py-2 px-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-300 text-center text-sm"
                    >
                        asd⬇️ Descargar Tríptico
                    </a>
                )}

            </section>

            {/* 3. Componente de Votación (Cliente) */}
            <Votacion 
                cursoId={cursoData.id} 
                nombreCurso={cursoData.nombre}
                initialVotos={cursoData.totalVotos}
                initialEstrellas={cursoData.totalEstrellas}
                totalStars={10} // <-- Le pasamos el total de estrellas
            />

          
            {/* 4. Sección de Fotos */}
            <section className="w-full max-w-lg mt-8 p-4 bg-gray-50 rounded-xl shadow-inner border-t border-green-200">
                <h4 className="text-xl font-semibold text-green-700 mb-4 text-center">Galería del Proyecto</h4>
                <div className="grid grid-cols-3 gap-3">
                    
                    {/* FOTO 1 */}
                    <div className="aspect-square relative rounded-lg overflow-hidden shadow-md">
                        <Image
                            src="/img/acti.jpg" // <-- RUTA DE LA FOTO EN PUBLIC/IMG
                            alt={`Imagen del proyecto: ${cursoData.nombre} - 1`}
                            fill // <-- Hace que la imagen llene el contenedor
                            sizes="(max-width: 768px) 100vw, 33vw" // Optimización para diferentes pantallas
                            className="object-cover transition duration-300 hover:scale-105"
                            priority
                        />
                    </div>
                    
                    {/* FOTO 2 */}
                    <div className="aspect-square relative rounded-lg overflow-hidden shadow-md">
                        <Image
                            src="/img/banda.jpg" // <-- RUTA DE LA FOTO EN PUBLIC/IMG
                            alt={`Imagen del proyecto: ${cursoData.nombre} - 2`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition duration-300 hover:scale-105"
                        />
                    </div>
                    
                    {/* FOTO 3 */}
                    <div className="aspect-square relative rounded-lg overflow-hidden shadow-md">
                        <Image
                            src="/img/robotica.jpg" // <-- RUTA DE LA FOTO EN PUBLIC/IMG
                            alt={`Imagen del proyecto: ${cursoData.nombre} - 3`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition duration-300 hover:scale-105"
                        />
                    </div>
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">*(JBA - BALLIVIANITO)*</p>
            </section>
            
            

            {/* 5. Pie de Página */}
            <footer className="w-full max-w-4xl mt-10 py-3 border-t-2 border-green-200 text-center">
                <p className="text-sm text-gray-600">
                    **Unidad Educativa José Ballivián A** | Dedicados a la excelencia y la innovación educativa.
                </p>
                <p className="text-xs text-gray-400 mt-1">© 2025. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}