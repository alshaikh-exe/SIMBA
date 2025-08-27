import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import './ItemCard.module.scss';

export default function Items({ user, item, loading, handleAddToCart }) {

  if (loading) return <div className="items-loading">Loading equipment...</div>;

  return (
    <div key={item._id} className="item-card">
            <div className="item-image">
            <img src={item.picture} alt={item.name} />
            </div>

            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              <div className="item-meta">
                <p><strong>Return Policy:</strong> {item.returnPolicy}</p>
                <p><strong>Deadline:</strong> {item.deadline} day(s)</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Threshold:</strong> {item.threshold}</p>
              </div>

              {item.location && (
                <p className="item-location">
                  <strong>Location:</strong> {item.location.campus}, {item.location.building}, {item.location.classroom}
                </p>
              )}

              <div className="item-actions">
                <Button
                  variant="secondary"
                  onClick={() => window.open(`/items/${item._id}`, '_blank')}
                >
                  View Details
                </Button>
                {user.role === "user" && item.quantity > 0 && (
                  <Button
                    variant="primary"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          </div>
  );
}
