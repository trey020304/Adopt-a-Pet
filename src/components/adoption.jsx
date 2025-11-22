import React, { useState } from "react";

export const Adoption = (props) => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const animals = [
    {
      id: 1,
      name: "Whiskers",
      image: "img/sample_adopt/cat 1.jpg",
      galleryImages: [
        "img/sample_adopt/cat 1.jpg",
        "img/sample_adopt/cat 1.jpg",
        "img/sample_adopt/cat 1.jpg",
      ],
      type: "Cat",
      age: "2 years",
      sex: "Female",
      breed: "Tabby Mix",
      size: "4 lbs",
      health: "Healthy, up-to-date on vaccinations",
      behavior: "Friendly, playful, good with children",
      rescuerName: "Jane Smith",
      rescuerContact: "jane@petrescue.com",
    },
    {
      id: 2,
      name: "Shadow",
      image: "img/sample_adopt/cat 2.jpg",
      galleryImages: [
        "img/sample_adopt/cat 2.jpg",
        "img/sample_adopt/cat 2.jpg",
        "img/sample_adopt/cat 2.jpg",
      ],
      type: "Cat",
      age: "1 year",
      sex: "Male",
      breed: "Black Domestic Shorthair",
      size: "5 lbs",
      health: "Healthy, neutered",
      behavior: "Shy but warming up, needs patient home",
      rescuerName: "John Doe",
      rescuerContact: "john@petrescue.com",
    },
    {
      id: 3,
      name: "Mittens",
      image: "img/sample_adopt/cat 3.jpg",
      galleryImages: [
        "img/sample_adopt/cat 3.jpg",
        "img/sample_adopt/cat 3.jpg",
        "img/sample_adopt/cat 3.jpg",
      ],
      type: "Cat",
      age: "3 years",
      sex: "Female",
      breed: "British Shorthair",
      size: "6 lbs",
      health: "Healthy, spayed",
      behavior: "Affectionate, loves attention",
      rescuerName: "Sarah Johnson",
      rescuerContact: "sarah@petrescue.com",
    },
    {
      id: 4,
      name: "Max",
      image: "img/sample_adopt/dog 1.jpg",
      galleryImages: [
        "img/sample_adopt/dog 1.jpg",
        "img/sample_adopt/dog 1.jpg",
        "img/sample_adopt/dog 1.jpg",
      ],
      type: "Dog",
      age: "3 years",
      sex: "Male",
      breed: "Miniature Poodle Mix",
      size: "55 lbs",
      health: "Healthy, neutered, vaccinated",
      behavior: "Friendly, energetic, good with families",
      rescuerName: "Mike Wilson",
      rescuerContact: "mike@petrescue.com",
    },
    {
      id: 5,
      name: "Bella",
      image: "img/sample_adopt/dog 2.jpg",
      galleryImages: [
        "img/sample_adopt/dog 2.jpg",
        "img/sample_adopt/dog 2.jpg",
        "img/sample_adopt/dog 2.jpg",
      ],
      type: "Dog",
      age: "2 years",
      sex: "Female",
      breed: "Staffordshire Bull Terrier",
      size: "50 lbs",
      health: "Healthy, minor hip dysplasia (manageable)",
      behavior: "Gentle, loves walks, good with other dogs",
      rescuerName: "Emily Brown",
      rescuerContact: "emily@petrescue.com",
    },
    {
      id: 6,
      name: "Rocky",
      image: "img/sample_adopt/dog 3.jpg",
      galleryImages: [
        "img/sample_adopt/dog 3.jpg",
        "img/sample_adopt/dog 3.jpg",
        "img/sample_adopt/dog 3.jpg",
      ],
      type: "Dog",
      age: "4 years",
      sex: "Male",
      breed: "Golden Retriever",
      size: "65 lbs",
      health: "Healthy, fully vaccinated",
      behavior: "Protective, loyal, needs experienced handler",
      rescuerName: "Tom Martinez",
      rescuerContact: "tom@petrescue.com",
    },
  ];

  const scrollContainer = (direction) => {
    const container = document.querySelector(".adoption-carousel");
    const scrollAmount = 300;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div id="adoption">
      <div className="container">
        <div className="section-title text-center">
          <h2>Available for Adoption</h2>
          <p>
            Meet the wonderful pets waiting for their forever homes. Choose a
            companion and make a difference in their lives today.
          </p>
        </div>

        <div className="adoption-container">
          <button
            className="scroll-btn scroll-btn-left"
            onClick={() => scrollContainer("left")}
          >
            &#10094;
          </button>

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

          <button
            className="scroll-btn scroll-btn-right"
            onClick={() => scrollContainer("right")}
          >
            &#10095;
          </button>
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
