import React from 'react';

export default function Carousel() {
  return (
    <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{ objectFit: 'cover' }}>
      <div className="carousel-inner" id="carousel">
        <div className="carousel-caption" style={{ zIndex: '10' }}>
          <form className="d-flex justify-content-center">
            <input className="form-control me-2" type="search" placeholder="Search for dishes, cuisines, or restaurants" aria-label="Search" />
            <button className="btn btn-success" type="submit">Search</button>
          </form>
        </div>
        <div className="carousel-item active">
          <img src="https://picsum.photos/id/493/1920/700" className="d-block w-100" style={{ filter: 'brightness(30%)', height: '520px', objectFit: 'cover' }} alt="Food showcase" />
        </div>
        <div className="carousel-item">
          <img src="https://picsum.photos/id/431/1920/700" className="d-block w-100" style={{ filter: 'brightness(30%)', height: '520px', objectFit: 'cover' }} alt="Food showcase" />
        </div>
        <div className="carousel-item">
          <img src="https://picsum.photos/id/429/1920/700" className="d-block w-100" style={{ filter: 'brightness(30%)', height: '520px', objectFit: 'cover' }} alt="Food showcase" />
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
