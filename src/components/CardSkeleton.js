import React from 'react';

export default function CardSkeleton() {
  return (
    <div className="card card-food h-100 border-0 bg-white" aria-hidden="true">
      <div className="card-img-wrapper placeholder-glow">
        <div className="placeholder w-100 h-100" />
      </div>
      <div className="card-body placeholder-glow">
        <div className="placeholder col-12 mb-3 rounded"></div>
        <div className="placeholder col-10 mb-3 rounded"></div>
        <div className="placeholder col-8 mb-4 rounded"></div>
        <div className="placeholder col-12 rounded mt-auto" style={{ height: '42px' }}></div>
      </div>
    </div>
  );
}
