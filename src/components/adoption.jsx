import React, { useState, useEffect } from "react";

export const Adoption = (props) => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadAnimals() {
      try {
        // Prefer the global client initialized in `public/js/supabase-init.js`.
        const client = (typeof window !== 'undefined' && window.supabase) ? window.supabase : null;
        if (!client) {
          // No Supabase client available in global scope — leave empty or implement a fallback if desired.
          setAnimals([]);
          return;
        }

        const { data, error } = await client
          .from('animals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to load animals:', error);
          if (mounted) setAnimals([]);
          return;
        }

        const mapped = (data || [])
          .filter(r => r.available !== false)
          .map(r => ({
            id: r.id,
            name: r.name,
            type: r.type,
            age: r.age,
            sex: r.sex,
            breed: r.breed,
            size: r.size,
            health: r.health,
            behavior: r.behavior,
            rescuerName: r.rescuer_name,
            rescuerContact: r.rescuer_contact,
            image: r.main_image || (r.gallery && r.gallery[0]) || 'img/sample_adopt/cat 1.jpg',
            galleryImages: r.gallery || []
          }));

        if (mounted) setAnimals(mapped);
      } catch (e) {
        console.error('Error loading animals from Supabase', e);
        if (mounted) setAnimals([]);
      }
    }

    loadAnimals();

    return () => { mounted = false; };
  }, []);

  const scrollContainer = (direction) => {
    const container = document.querySelector(".adoption-carousel");
    if (!container) return; // safety: no-op if DOM not present yet
    const scrollAmount = 300;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div id="adoption">
      <style>{`
        /* Animal details modal: responsive sizing and stacked layout on small screens */
        .animal-details-modal {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.6);
          z-index: 1050;
          padding: 20px;
          box-sizing: border-box;
        }

        .animal-details-panel {
          background: #fff;
          border-radius: 12px;
          width: 90%;
          max-width: 920px;
          max-height: 90vh;
          overflow: auto;
          box-shadow: 0 8px 30px rgba(0,0,0,0.18);
          position: relative;
          padding: 20px;
          box-sizing: border-box;
        }

        .modal-close-btn, .preview-close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #9c6644;
          color: #fff;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 20px;
          line-height: 36px;
          cursor: pointer;
        }

        .animal-details-content { display: flex; gap: 20px; align-items: flex-start; }
        .animal-details-left { flex: 1; min-width: 220px; }
        .animal-details-right { flex: 1; }
        .animal-details-image { width: 100%; height: auto; border-radius: 8px; display: block; }
        .animal-gallery { display: flex; gap: 8px; margin-top: 10px; justify-content: flex-start; }
        .gallery-thumbnail { width: 56px; height: 56px; object-fit: cover; border-radius: 6px; cursor: pointer; }

        @media (max-width: 720px) {
          .animal-details-panel { width: 96%; padding: 12px; max-width: 560px; }
          .animal-details-content { flex-direction: column; }
          .animal-details-left, .animal-details-right { width: 100%; }
          .gallery-thumbnail { width: 48px; height: 48px; }
          .modal-close-btn, .preview-close-btn { top: 8px; right: 8px; width: 32px; height: 32px; font-size: 18px; }
        }
      `}</style>
      <div className="container">
        <div className="section-title text-center">
          <h2>Available for Adoption</h2>
          <p>
            Meet the wonderful pets waiting for their forever homes. Choose a
            companion and make a difference in their lives today.
          </p>
        </div>

        <div className="adoption-container">
          {animals.length > 4 && (
            <button
              className="scroll-btn scroll-btn-left"
              onClick={() => scrollContainer("left")}
            >
              &#10094;
            </button>
          )}

          <div className="adoption-carousel">
            {animals.map((animal) => (
              <div key={animal.id} className="adoption-card">
                <div className="adoption-image-wrapper">
                  <img src={animal.image} alt={animal.name} />
                  <div className="adoption-overlay">
                    <button
                      className="adopt-btn"
                      onClick={() => setSelectedAnimal(animal)}
                    >
                      See Details
                    </button>
                  </div>
                </div>
                <div className="adoption-info">
                  <h3>{animal.name}</h3>
                  <p className="animal-breed">{animal.breed}</p>
                </div>
              </div>
            ))}
          </div>

          {animals.length > 4 && (
            <button
              className="scroll-btn scroll-btn-right"
              onClick={() => scrollContainer("right")}
            >
              &#10095;
            </button>
          )}
        </div>

        <div className="text-center adoption-footer">
          <a
            href="/adoption.html"
            className="btn btn-custom btn-lg view-more-btn"
          >
            View More
          </a>
        </div>
      </div>

      {selectedAnimal && (
        <div className="animal-details-modal" onClick={() => setSelectedAnimal(null)}>
          <div
            className="animal-details-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setSelectedAnimal(null)}
            >
              ×
            </button>

            <div className="animal-details-content">
              <div className="animal-details-left">
                <img
                  src={selectedAnimal.image}
                  alt={selectedAnimal.name}
                  className="animal-details-image"
                  onClick={() => setPreviewImage(selectedAnimal.image)}
                  style={{ cursor: "pointer" }}
                />
                <div className="animal-gallery">
                  {selectedAnimal.galleryImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${selectedAnimal.name} gallery ${index + 1}`}
                      className="gallery-thumbnail"
                      onClick={() => setPreviewImage(img)}
                    />
                  ))}
                </div>
              </div>

              <div className="animal-details-right">
                <h2>{selectedAnimal.name}</h2>

                <div className="details-section">
                  <h3>Animal Information</h3>
                  <div className="details-row">
                    <span className="details-label">Animal Type:</span>
                    <span className="details-value">{selectedAnimal.type}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Age:</span>
                    <span className="details-value">{selectedAnimal.age}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Sex:</span>
                    <span className="details-value">{selectedAnimal.sex}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Breed:</span>
                    <span className="details-value">{selectedAnimal.breed}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Size/Weight:</span>
                    <span className="details-value">{selectedAnimal.size}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Health & Behavior</h3>
                  <div className="details-row">
                    <span className="details-label">Health Condition:</span>
                    <span className="details-value">{selectedAnimal.health}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Behavior Notes:</span>
                    <span className="details-value">{selectedAnimal.behavior}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Rescuer/Owner Contact</h3>
                  <div className="details-row">
                    <span className="details-label">Name:</span>
                    <span className="details-value">{selectedAnimal.rescuerName}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Contact:</span>
                    <span className="details-value">
                      <a href={`mailto:${selectedAnimal.rescuerContact}`}>
                        {selectedAnimal.rescuerContact}
                      </a>
                    </span>
                  </div>
                </div>

                <div className="modal-actions">
                  <a
                    className="btn btn-custom btn-lg"
                    href={`adoption-form.html?animalId=${selectedAnimal.id}`}
                  >
                    Adopt
                  </a>
                </div>
              </div>
            </div>

            {previewImage && (
              <div className="image-preview-lightbox" onClick={() => setPreviewImage(null)}>
                <div className="image-preview-container" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="preview-close-btn"
                    onClick={() => setPreviewImage(null)}
                  >
                    ×
                  </button>
                  <img src={previewImage} alt="Preview" className="preview-image" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
