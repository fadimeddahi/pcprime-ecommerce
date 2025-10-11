import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#181818] to-black overflow-hidden">
      <Image
        src="/hero.png"
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
        className="opacity-80"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
        <h1 className="text-3xl md:text-6xl font-extrabold text-[#fe8002] drop-shadow-lg mb-4 font-mono">
          Prime Computer
        </h1>
        <p className="text-lg md:text-2xl text-[#00d4ff] font-medium mb-6 max-w-xl font-mono drop-shadow-md">
          Découvrez la puissance, la fiabilité et le style pour tous vos besoins informatiques.
        </p>
        <a href="/pc-builder" className="bg-gradient-to-r from-[#fe8002] to-[#00d4ff] text-black font-bold px-8 py-3 rounded-full shadow-lg hover:from-[#00d4ff] hover:to-[#fe8002] transition-all duration-300">
          Commencer
        </a>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0" />
    </section>
  );
};

export default Hero;
