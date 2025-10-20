import Link from 'next/link';
import { cursosData } from '@/data/cursos'; // Importa tus datos

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white p-4">
      <header className="py-6 mb-6 border-b-2 border-green-100">
        <h1 className="text-3xl font-extrabold text-green-700 text-center">
          🗳️ Expoferia - Votación Individual
        </h1>
        <p className="text-center text-gray-500 mt-1">Selecciona un curso para evaluar.</p>
      </header>
      
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cursosData.map((curso) => (
          <Link 
            key={curso.id} 
            href={`/curso/${curso.id}`}
            className="block p-5 bg-green-50 hover:bg-green-100 transition duration-300 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border-l-4 border-green-600"
          >
            <h2 className="text-xl font-bold text-green-800 mb-1">{curso.nombre}</h2>
            <p className="text-sm text-gray-600 font-medium">{curso.curso}</p>
            <p className="text-xs text-gray-400 mt-2">Tap para evaluar &rarr;</p>
          </Link>
        ))}
      </div>
    </div>
  );
}