import React, { useState } from 'react';
import { Image, Maximize2 } from 'lucide-react';

export default function GallerySection({ gallery = [] }) {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['All', 'Classroom', 'Science Lab', 'Events', 'Achievements'];

  const filteredItems = filter === 'All'
    ? gallery
    : gallery.filter(item => item.category === filter);

  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Life at Aarohan</div>
          <h2 className="section-title">Campus & Activity Gallery</h2>
          <p className="section-description">
            A glimpse into our vibrant learning spaces, practical science demonstrations, and student celebration events.
          </p>
        </div>

        {/* Categories Filter */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`btn ${filter === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.4rem 1.1rem', fontSize: '0.85rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setSelectedImage(item)}
            >
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={item.image_url}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <span className="badge badge-navy" style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(15,23,42,0.75)', color: 'white' }}>
                  {item.category}
                </span>
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.3rem', borderRadius: '50%' }}>
                  <Maximize2 size={16} />
                </div>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal Lightbox */}
        {selectedImage && (
          <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', textAlign: 'center' }}>
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }}
              />
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>{selectedImage.title}</h3>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>{selectedImage.caption}</p>
              <button className="btn btn-secondary" onClick={() => setSelectedImage(null)}>
                Close Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
