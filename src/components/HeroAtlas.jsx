import React from 'react';

export const HeroAtlas = () => {
  return (
    <section id="inicio" className="relative bg-[#07080c] overflow-hidden min-h-[480px] sm:min-h-[520px] flex items-center">
      
      {/* Background Digital Global Map Overlay from official asset */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden pointer-events-none">
        <img
          src="/hero-map.jpg"
          alt="Atlas Global Logistics Network"
          className="w-full h-full object-cover object-center lg:object-right scale-105"
        />
        {/* Gradients: Left contrast for text + Bottom progressive degradation to merge seamlessly with below */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080c] via-[#07080c]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080c]/30 via-transparent to-[#0d0f17]" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#07080c]/20 to-[#07080c]/70" />
      </div>

      {/* Hero Foreground Content */}
      <div className="relative max-w-5xl mx-auto px-6 sm:px-10 lg:px-14 py-16 sm:py-20 z-10 w-full">
        <div className="max-w-2xl space-y-6">
          
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white tracking-tight leading-[1.12] drop-shadow-md">
            El camino más<br />
            rápido y seguro<br />
            para tu vehículo
          </h1>

          {/* Subtitle / Paragraph */}
          <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-xl drop-shadow">
            Transformamos la logística automotriz en una experiencia 100% digital y transparente. Con Atlas, seleccionas tu modelo, sigues el trayecto en tiempo real y recibes tu vehículo listo para rodar en Venezuela de la manera más sencilla posible.
          </p>

        </div>
      </div>
    </section>
  );
};
