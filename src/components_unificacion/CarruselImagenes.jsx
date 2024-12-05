import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Briefcase, Home, Tag } from 'lucide-react';

// Enhanced image data with descriptions and titles
const sliderImages = [
  {
    id: 'practica-1',
    title: 'Impulsa tu Carrera Profesional',
    description: 'Descubre prácticas profesionales que transformarán tu futuro académico y laboral',
    alt: 'Plataforma de Prácticas Profesionales'
  },
  {
    id: 'practica-2',
    title: 'Comunidad de Prácticas',
    description: 'Conecta con estudiantes, comparte experiencias y amplía tu red profesional',
    alt: 'Foro de Experiencias de Prácticas'
  },
  {
    id: 'descuento-1',
    title: 'Descuentos Cerca de Ti',
    description: 'Explora increíbles ofertas y promociones exclusivas en tu zona',
    alt: 'Mapa de Descuentos Locales'
  },
  {
    id: 'descuento-2',
    title: 'Personaliza tus Beneficios',
    description: 'Filtra y encuentra descuentos perfectamente adaptados a tus intereses y estilo de vida',
    alt: 'Sistema de Filtrado de Descuentos'
  },
  {
    id: 'roomies-1',
    title: 'Crea tu Perfil Ideal',
    description: 'Construye un perfil único que te ayude a encontrar el compañero de vivienda perfecto',
    alt: 'Creación de Perfil de Roomies'
  },
  {
    id: 'roomies-2',
    title: 'Conecta con tu Futuro Roomie',
    description: 'Navega, conoce y conéctate con potenciales compañeros que comparten tus intereses',
    alt: 'Búsqueda Inteligente de Roomies'
  }
];

const DynamicImageSlider = () => {
  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-4">
          <Carousel className="w-full">
            <CarouselContent>
              {sliderImages.map((image) => (
                <CarouselItem key={image.id}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <img
                          src={`${image.id}.png`}
                          alt={image.alt}
                          className="max-w-full h-auto rounded-lg mb-4"
                        />
                        <div className="text-center">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{image.title}</h3>
                          <p className="text-sm text-gray-600">
                            {image.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>

      <div className="w-full gap-4 flex flex-col md:flex-row items-center justify-around">
        <a href="https://practicas.tssw.info" rel="noreferrer" className="w-full md:w-fit">
          <div className='px-4 w-full md:w-fit justify-center flex-col items-center flex py-2 rounded-md hover:cursor-pointer hover:shadow-md hover:scale-105 bg-[#0092BC] text-white transition duration-500'>
            <div className="flex items-center gap-2">
              <Briefcase size={32} />
              <h5 className="text-xl font-bold">Prácticas</h5>
            </div>
            <p className="text-sm text-center">Descubre oportunidades de prácticas profesionales que impulsarán tu carrera. Conecta con empresas que buscan el talento fresco de estudiantes como tú.</p>
          </div>
        </a>

        <a href="https://roomies.tssw.info" rel="noreferrer" className="w-full md:w-fit">
          <div className='px-4 w-full md:w-fit justify-center flex-col items-center flex py-2 rounded-md hover:cursor-pointer hover:shadow-md hover:scale-105 bg-[#0092BC] text-white transition duration-500'>
            <div className="flex items-center gap-2">
              <Home size={32} />
              <h5 className="text-xl font-bold">Roomies</h5>
            </div>
            <p className="text-sm text-center">Encuentra el compañero de cuarto perfecto para tu experiencia universitaria. Conecta con estudiantes que comparten tus intereses y estilo de vida</p>
          </div>
        </a>

        <a href="https://descuentos.tssw.info" rel="noreferrer" className="w-full md:w-fit">
          <div className='px-4 w-full md:w-fit justify-center flex-col items-center flex py-2 rounded-md hover:cursor-pointer hover:shadow-md hover:scale-105 bg-[#0092BC] text-white transition duration-500'>
            <div className="flex items-center gap-2">
              <Tag size={32} />
              <h5 className="text-xl font-bold">Descuentos</h5>
            </div>
            <p className="text-sm text-center">Ahorra en tus comidas favoritas con descuentos eclusivos para estudiantes. Encuentra ofertas en restaurantes y cafeterías cerca de tu campus</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default DynamicImageSlider;