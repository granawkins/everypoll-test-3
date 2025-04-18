import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header Component', () => {
  it('renders the header with Mentat logo', () => {
    render(<Header />);
    
    // Check if logo is rendered
    const logoImage = screen.getByAltText('Mentat logo');
    expect(logoImage).toBeInTheDocument();
    
    // Check if logo is inside a link to mentat.ai
    const link = logoImage.closest('a');
    expect(link).toHaveAttribute('href', 'https://mentat.ai');
  });
});
