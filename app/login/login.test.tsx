import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './page';

// Mock Next.js routing utilities so the test runner doesn't throw routing errors
vi.mock('next/navigation', () => ({
  useRouter() {
    return { push: vi.fn() };
  },
}));

describe('Login Page Interface', () => {
  it('renders the sign-in form elements correctly', () => {
    render(<Login />);
    
    // Check if the branding name exists
    expect(screen.getByText('🎁 PermanentGift')).toBeInTheDocument();
    
    // Check if input forms are visible and properly mapped via their labels
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    
    // Check if the exact main submission button exists without matching social buttons
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
  });
});