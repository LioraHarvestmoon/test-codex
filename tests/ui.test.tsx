import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrandSummary } from '@/components/BrandSummary';
import anker from '@/mock/anker.json';

describe('BrandSummary UI', () => {
  it('renders key brand information', () => {
    render(<BrandSummary profile={anker} dataMode="mock" />);
    expect(screen.getByText('Anker')).toBeInTheDocument();
    expect(screen.getByText(/Industry-leading fast charging technology/i)).toBeInTheDocument();
    expect(screen.getByText(/Source audit trail/i)).toBeInTheDocument();
  });

  it('toggles highlight visibility', () => {
    render(<BrandSummary profile={anker} dataMode="mock" />);
    const toggle = screen.getByRole('button', { name: /show more/i });
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument();
  });
});
