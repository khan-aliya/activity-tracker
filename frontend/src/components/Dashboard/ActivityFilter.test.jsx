import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityFilter from './ActivityFilter';

describe('ActivityFilter Component', () => {
  const mockOnFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders ActivityFilter with basic controls', () => {
      render(<ActivityFilter onFilter={mockOnFilter} />);

      expect(screen.getByText(/Filter Activities/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search by title/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/All Categories/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Start Date/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/End Date/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Apply/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
      expect(screen.getByText(/Advanced Filters/i)).toBeInTheDocument();
    });

    it('shows advanced filters when toggled', () => {
      render(<ActivityFilter onFilter={mockOnFilter} />);

      // Advanced filters are inside details element, not visible by default
      const detailsElement = screen.getByText(/Advanced Filters/i).closest('details');
      expect(detailsElement).not.toHaveAttribute('open');
      
      // Click to open
      fireEvent.click(screen.getByText(/Advanced Filters/i));
      expect(detailsElement).toHaveAttribute('open');
    });
  });

  describe('Filter Interactions', () => {
    it('handles search input change', () => {
      render(<ActivityFilter onFilter={mockOnFilter} />);

      const searchInput = screen.getByPlaceholderText(/Search by title/i);
      fireEvent.change(searchInput, { target: { value: 'Yoga' } });

      expect(searchInput.value).toBe('Yoga');
    });

    it('handles category selection', () => {
      render(<ActivityFilter onFilter={mockOnFilter} />);

      const categorySelect = screen.getByDisplayValue(/All Categories/i);
      fireEvent.change(categorySelect, { target: { value: 'Self-care' } });

      expect(categorySelect.value).toBe('Self-care');
    });

    it('handles start date change', () => {
      render(<ActivityFilter onFilter={mockOnFilter} />);

      const startDateInput = screen.getByPlaceholderText(/Start Date/i);
      fireEvent.change(startDateInput, { target: { value: '2023-12-01' } });

      expect(startDateInput.value).toBe('2023-12-01');
    });
  });

  describe('Advanced Filters', () => {
    beforeEach(() => {
      render(<ActivityFilter onFilter={mockOnFilter} />);
      
      // Open advanced filters first
      fireEvent.click(screen.getByText(/Advanced Filters/i));
    });

    it('handles min feeling filter', () => {
      // Get by label text instead of placeholder
      const minFeelingLabel = screen.getByText(/Min Feeling \(1-10\)/i);
      const minFeelingInput = minFeelingLabel.nextElementSibling?.querySelector('input');
      
      if (minFeelingInput) {
        fireEvent.change(minFeelingInput, { target: { value: '5' } });
        expect(minFeelingInput.value).toBe('5');
      } else {
        // Alternative: find by type number and test label relationship
        const numberInputs = screen.getAllByRole('spinbutton');
        expect(numberInputs.length).toBeGreaterThan(0);
        
        // First number input should be min feeling
        fireEvent.change(numberInputs[0], { target: { value: '5' } });
        expect(numberInputs[0].value).toBe('5');
      }
    });

    it('handles max feeling filter', () => {
      // Get all number inputs and find the right one
      const numberInputs = screen.getAllByRole('spinbutton');
      
      // Max feeling should be the second number input
      expect(numberInputs.length).toBeGreaterThan(1);
      
      fireEvent.change(numberInputs[1], { target: { value: '8' } });
      expect(numberInputs[1].value).toBe('8');
    });
  });

  describe('Filter Application', () => {
    it('applies filters when Apply button is clicked', () => {
      render(<ActivityFilter onFilter={mockOnFilter} />);

      const searchInput = screen.getByPlaceholderText(/Search by title/i);
      fireEvent.change(searchInput, { target: { value: 'Yoga' } });

      const applyButton = screen.getByRole('button', { name: /Apply/i });
      fireEvent.click(applyButton);

      expect(mockOnFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Yoga',
          category: 'all'
        })
      );
    });

    it('resets filters when Reset button is clicked', () => {
      render(<ActivityFilter onFilter={mockOnFilter} />);

      const searchInput = screen.getByPlaceholderText(/Search by title/i);
      fireEvent.change(searchInput, { target: { value: 'Yoga' } });

      const resetButton = screen.getByRole('button', { name: /Reset/i });
      fireEvent.click(resetButton);

      expect(searchInput.value).toBe('');
      expect(mockOnFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          search: '',
          category: 'all'
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles null or undefined initial filters', () => {
      render(<ActivityFilter onFilter={mockOnFilter} initialFilters={null} />);

      expect(screen.getByText(/Filter Activities/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search by title/i).value).toBe('');
    });
  });
});