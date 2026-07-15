import React, { useState, useEffect } from "react";

export interface ColorVariation {
  colorName: string;
  hex: string; // Used for UI swatch buttons
  mainImage: string; // The primary image for this color
  thumbnails: string[]; // Extra detail photos for this color
}

interface ProductGalleryProps {
  variations: ColorVariation[];
  productName: string;
  price: string;
}

export default function ProductGallery({ variations, productName, price }: ProductGalleryProps) {
  if (!variations || variations.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-[#ecece8] flex items-center justify-center rounded-2xl">
        <p className="text-[#8b8b83] text-sm">No hay imágenes disponibles</p>
      </div>
    );
  }

  // Active color variation index
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const activeVariation = variations[selectedColorIdx];

  // Active image within the current variation (can be main or one of the extra thumbnails)
  const [activeImage, setActiveImage] = useState(activeVariation.mainImage);

  // Sync active image when the selected color variation changes
  useEffect(() => {
    setActiveImage(activeVariation.mainImage);
  }, [selectedColorIdx, variations]);

  // Combined list of all images for the active variation (main image + thumbnails)
  const allImages = [activeVariation.mainImage, ...activeVariation.thumbnails];

  // Dynamic WhatsApp ordering URL builder
  const formattedMessage = `Hola Muebles M&O! Me interesa el producto "${productName}" en acabado "${activeVariation.colorName}" (${price}). ¿Me darían más información para realizar mi pedido?`;
  const whatsappUrl = `https://wa.me/51907242330?text=${encodeURIComponent(formattedMessage)}`;

  return (
    <div className="w-full flex flex-col gap-6 bg-white/65 backdrop-blur-md rounded-3xl p-6 border border-[#e5e5e0] shadow-xl">
      {/* Upper Area: Main Image View and Swatches */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Image View */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f5f2eb] rounded-2xl border border-[#ecece8] overflow-hidden relative min-h-[350px] md:min-h-[420px]">
          <img
            src={activeImage}
            alt={`Vista de ${activeVariation.colorName}`}
            className="max-w-full max-h-[400px] object-contain w-full h-auto aspect-[4/3] select-none transition-all duration-300"
          />
          <div className="absolute bottom-4 left-4 bg-white/85 backdrop-blur-sm border border-[#e5e5e0] px-3.5 py-1.5 rounded-full text-[10px] font-bold text-[#5c5c56] tracking-wider uppercase">
            Acabado Real en Stock
          </div>
        </div>

        {/* Color Selection Panel */}
        <div className="w-full md:w-[280px] flex flex-col justify-between">
          <div>
            <span className="text-[12px] font-bold text-[#cfa163] uppercase tracking-widest block mb-1">
              Catálogo de Hilados
            </span>
            <h2 className="text-2xl font-bold text-[#1f2022] tracking-tight">Selección de Color</h2>
            <p className="text-[#6b6b64] text-xs leading-relaxed mt-2.5 mb-6">
              Elige entre las telas premium disponibles en stock. Las imágenes muestran fotografías reales de cada
              tapizado tomadas bajo iluminación de estudio.
            </p>

            {/* Circular Color Swatches */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#1f2022] uppercase tracking-wider">Tapizados Disponibles</h3>
              <div className="flex flex-wrap gap-3.5">
                {variations.map((variation, idx) => (
                  <button
                    key={variation.colorName}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`w-10 h-10 rounded-full relative flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer shadow-md border ${variation.hex === "#ffffff" ? "border-[#ecece8]" : "border-transparent"}`}
                    style={{ backgroundColor: variation.hex }}
                    title={variation.colorName}
                    aria-label={`Seleccionar color ${variation.colorName}`}
                  >
                    {selectedColorIdx === idx && (
                      <span
                        className={`absolute inset-0 rounded-full border-2 ${variation.hex === "#ffffff" ? "border-[#1f2022]/30" : "border-white"} ring-2 ring-[#1f2022]`}
                      ></span>
                    )}
                  </button>
                ))}
              </div>
              <div className="text-xs font-semibold text-[#1f2022] tracking-wide pt-1">
                Tono: <span className="text-[#cfa163] font-bold">{activeVariation.colorName}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {/* Dynamic WhatsApp ordering button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center gap-2 justify-center text-xs font-bold uppercase tracking-wider text-white bg-[#25d366] hover:bg-[#20ba5a] py-4 px-6 rounded-full transition-all duration-300 shadow-md transform hover:-translate-y-[1px] cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.216 3.077.149.2 2.094 3.197 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pedir por WhatsApp
            </a>

            {/* Availability summary */}
            <div className="bg-[#fdfdfc] p-4 rounded-xl border border-[#ecece8] text-[11px] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6b6b64]">Estado del stock:</span>
                <span className="font-semibold text-green-700">Disponible</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b64]">Tipo de material:</span>
                <span className="font-semibold text-[#1f2022]">Tejido Premium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b64]">Fotografías:</span>
                <span className="font-semibold text-[#1f2022]">100% Reales</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Area: Thumbnails Strip for detail view */}
      {allImages.length > 1 && (
        <div className="border-t border-[#ecece8] pt-4 mt-2">
          <h4 className="text-[10px] font-bold text-[#8b8b83] uppercase tracking-wider mb-3">Galería de Detalles</h4>
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-thin">
            {allImages.map((imgSrc, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(imgSrc)}
                className={`w-20 h-20 rounded-xl overflow-hidden border bg-[#f5f2eb] flex-shrink-0 transition-all cursor-pointer ${activeImage === imgSrc ? "border-[#cfa163] ring-2 ring-[#cfa163]/20 scale-95 shadow-inner" : "border-[#ecece8] hover:border-[#8b8b83]"}`}
              >
                <img src={imgSrc} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover select-none" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
