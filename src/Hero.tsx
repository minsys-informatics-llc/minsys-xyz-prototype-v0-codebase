import { useEffect, useRef, useState } from 'react';
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
        <div
          className="absolute inset-0 backdrop-blur-md -m-10 p-6 rounded-2xl -z-12 pointer-events-none"
          style={{ backgroundColor: 'rgba(13, 16, 1, 0.1)' }}
        ></div>
        <h3 className="text-solarAmber font-bold tracking-[0.3em] uppercase text-xs mb-8">A Venture Building Micro-PE Group</h3>
        <h1 className="display-serif text-4xl md:text-4xl lg:text-5xl text-white font-black leading-tight mb-6">Ultimately, We Bootstrap Ventures<br /><span className="text-solarAmber italic"> for Main Street</span></h1>
        <h2 className="text-[#F8F9FA] max-w-xl mx-auto mb-10 leading-tight font-light text-xl md:text-2xl">
          <strong>Unlocking Main Street's hidden Value<br />by spinning-off<span className="text-solarAmber font-bold"> Digital &amp; AI Ventures</span></strong>
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#model" className="bg-solarAmber text-darkGraphite px-10 py-4 text-base font-bold rounded-lg hover:scale-105 transition-transform text-center">Our Model</a>
          <a href="#capabilities" className="border border-white/20 text-white px-10 py-4 text-base font-bold rounded-lg hover:bg-white/5 transition-colors text-center">Digital &amp; AI Capabilities</a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-solarAmber/50 to-transparent z-10"></div>
    </section>
  );
};
