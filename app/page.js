// /app/page.js


import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      
      {/* 1. Logo */}
      <Image 
          src="/logo.png" 
          alt="Logo del Colegio" 
          width={80} 
          height={80} 
          className="rounded-lg shadow-md mb-6"
      />
      
      {/* 2. Título de Bienvenida */}
      <h1 className="text-4xl font-black text-green-700 mb-4">
        ¡Bienvenido a la Expoferia! 🗳️
      </h1>
      
      {/* 3. Instrucción Principal */}
      <p className="text-xl text-gray-600 mb-8 max-w-lg">
        Para votar por un proyecto, por favor **escanea el Código QR** que se encuentra en el stand del curso o usa su enlace único.
      </p>
      
      {/* 4. Mensaje de Restricción/Alerta */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md max-w-lg">
        <p className="font-bold mb-1">⚠️ Acceso a Votación Restringido</p>
        <p className="text-sm">La votación individual para cada proyecto solo es accesible a través de su Código QR (URL única). La lista completa no está disponible para votar.</p>
      </div>

      {/* 5. Pie de página o enlace de soporte (Opcional) */}
      <footer className="mt-10 text-gray-400 text-sm">
          U. E. JOSÉ BALLIVIÁN - A • Expoferia Multidisciplinaria 2025
      </footer>

    </div>
  );
}