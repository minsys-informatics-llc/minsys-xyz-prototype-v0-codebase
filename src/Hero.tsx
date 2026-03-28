import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// @ts-ignore
import NET from 'vanta/dist/vanta.net.min';

export const Hero = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vantaEffect && myRef.current) {
      setVantaEffect(
        NET({
          el: myRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 500.00,
          minWidth: 500.00,
          scale: 2.00,
          scaleMobile: 1.00,
          color: 0xfd5e53,
          backgroundColor: 0x181610,
          points: 13.00,
          maxDistance: 22.00,
          spacing: 16.00
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <section ref={myRef} id="hero" className="relative flex items-center justify-center overflow-hidden min-h-[70vh] pt-12 pb-32">
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center w-full">
        {/* Glassmorphism Overlay for text block only */}
        <div
          className="absolute inset-0 backdrop-blur-md -m-6 p-6 rounded-2xl -z-10 pointer-events-none"
          style={{ backgroundColor: 'rgba(24, 22, 16, 0.1)' }}
        ></div>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-black leading-tight mb-6">We Bootstrap Ventures</h1>
        <p className="text-[#F8F9FA] max-w-4xl mx-auto mb-10 leading-tight font-light text-2xl md:text-3xl">
          <strong>We don't deliver projects.<br />Together, we engineer <span style={{ color: '#FD5E53', fontWeight: 'bold' }}>Your</span> next revenue stream as a <span style={{ color: '#FD5E53', fontWeight: 'bold' }}>Venture</span></strong>
        </p>
        <p className="text-[#F8F9FA] text-base md:text-lg max-w-3xl mx-auto mb-10 leading-relaxed font-light italic opacity-90">
          Augmenting Human Ingenuity via Technology, Rather than Automating People Away.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#vaas" className="bg-[#FD5E53] text-[#181610] px-10 py-4 text-base font-bold rounded-lg hover:scale-105 transition-transform text-center">Venture-as-a-Service</a>
          <a href="#portfolio" className="border border-white/20 text-white px-10 py-4 text-base font-bold rounded-lg hover:bg-white/5 transition-colors text-center">Minsys Ventures</a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FD5E53]/50 to-transparent z-10"></div>
    </section>
  );
};
