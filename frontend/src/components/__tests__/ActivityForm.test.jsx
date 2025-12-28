import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityForm from '../ActivityForm';
import '@testing-library/jest-dom';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    initialData: null,
    loading: false
};

describe('ActivityForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all form fields correctly', () => {
        render(<ActivityForm {...defaultProps} />);
        
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInDocument();
        expect(screen.getByLabelText(/type/i)).toBeInDocument();
        expect(screen.getByLabelText(/duration/i)).toBeInDocument();
        expect(screen.getByLabelText(/date/i)).toBeInDocument();
        expect(screen.getByLabelText(/status/i)).toBeInDocument();
        expect(screen.getByRole('button', { name: /save/i })).toBeInDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInDocument();
    });

    test('submits form with correct data', async () => {
        render(<ActivityForm {...defaultProps} />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/title/i), 'Morning Run');
        await user.type(screen.getByLabelText(/description/i), '5k run in the park');
        await user.selectOptions(screen.getByLabelText(/type/i), 'exercise');
        await user.type(screen.getByLabelText(/duration/i), '45');
        await user.type(screen.getByLabelText(/date/i), '2024-01-15');
        await user.selectOptions(screen.getByLabelText(/status/i), 'completed');

        await user.click(screen.getByRole('button', { name: /save/i }));

        expect(mockOnSubmit).toHaveBeenCalledWith({
            title: 'Morning Run',
            description: '5k run in the park',
            type: 'exercise',
            duration: 45,
            date: '2024-01-15',
            status: 'completed'
        });
    });

    test('shows validation errors for empty required fields', async () => {
        render(<ActivityForm {...defaultProps} />);
        const user = userEvent.setup();

        await user.click(screen.getByRole('button', { name: /save/i }));

        expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('populates form with initial data for editing', () => {
        const initialData = {
            title: 'Existing Activity',
            description: 'Existing description',
            type: 'work',
            duration: 120,
            date: '2024-01-10',
            status: 'pending'
        };

        render(<ActivityForm {...defaultProps} initialData={initialData} />);

        expect(screen.getByLabelText(/title/i).value).toBe('Existing Activity');
        expect(screen.getByLabelText(/description/i).value).toBe('Existing description');
        expect(screen.getByLabelText(/type/i).value).toBe('work');
        expect(screen.getByLabelText(/duration/i).value).toBe('120');
        expect(screen.getByLabelText(/date/i).value).toBe('2024-01-10');
        expect(screen.getByLabelText(/status/i).value).toBe('pending');
    });
});