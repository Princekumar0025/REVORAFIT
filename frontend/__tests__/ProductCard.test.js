import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

// Mock the context hooks to isolate the component
jest.mock('@/context/CartContext', () => ({
  useCart: () => ({ dispatch: jest.fn() })
}));

jest.mock('@/context/WishlistContext', () => ({
  useWishlist: () => ({ 
    addToWishlist: jest.fn(), 
    removeFromWishlist: jest.fn(), 
    isInWishlist: jest.fn().mockReturnValue(false) 
  })
}));

const mockProduct = {
  _id: '1',
  name: 'Test Dumbbell',
  slug: 'test-dumbbell',
  category: 'fitness',
  price: 1000,
  discountPrice: 800,
  stock: 10,
  images: ['/test.jpg'],
  averageRating: 4.5,
  numReviews: 12
};

describe('ProductCard Frontend UI Tests', () => {
  it('renders product details correctly (Rendering Test)', () => {
    render(<ProductCard product={mockProduct} />);
    
    // Check that title renders
    expect(screen.getByText('Test Dumbbell')).toBeInTheDocument();
    
    // Check that price and discount render properly formatted
    expect(screen.getByText('₹800')).toBeInTheDocument();
    expect(screen.getByText('₹1,000')).toBeInTheDocument();
    
    // Check dynamic discount badge calculation: (1000-800)/1000 = 20%
    expect(screen.getByText('20% OFF')).toBeInTheDocument();
  });

  it('renders out of stock button and disables interaction when stock is 0 (State Logic Test)', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    
    // Query the button
    const button = screen.getByRole('button', { name: /Out of Stock/i });
    
    // Assert visual presence and disabled state
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
