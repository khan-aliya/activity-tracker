import { render, screen, fireEvent } from '@testing-library/react';
import ActivityList from '../ActivityList';
import '@testing-library/jest-dom';

const mockActivities = [
    {
        id: '1',
        title: 'Morning Yoga',
        description: '30 minutes of yoga',
        type: 'exercise',
        duration: 30,
        date: '2024-01-15',
        status: 'completed'
    },
    {
        id: '2',
        title: 'Project Meeting',
        description: 'Team sync meeting',
        type: 'work',
        duration: 60,
        date: '2024-01-15',
        status: 'pending'
    },
    {
        id: '3',
        title: 'Read Book',
        description: 'Read 50 pages',
        type: 'study',
        duration: 45,
        date: '2024-01-14',
        status: 'completed'
    }
];

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe('ActivityList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all activities correctly', () => {
        render(
            <ActivityList 
                activities={mockActivities}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                loading={false}
            />
        );

        expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
        expect(screen.getByText('Project Meeting')).toBeInTheDocument();
        expect(screen.getByText('Read Book')).toBeInTheDocument();
        expect(screen.getByText('exercise')).toBeInTheDocument();
        expect(screen.getByText('work')).toBeInTheDocument();
        expect(screen.getByText('study')).toBeInTheDocument();
    });

    test('shows empty state when no activities', () => {
        render(
            <ActivityList 
                activities={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                loading={false}
            />
        );

        expect(screen.getByText(/no activities found/i)).toBeInTheDocument();
    });

    test('calls onEdit when edit button is clicked', () => {
        render(
            <ActivityList 
                activities={mockActivities}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                loading={false}
            />
        );

        fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[0]);
        expect(mockOnEdit).toHaveBeenCalledWith(mockActivities[0]);
    });

    test('calls onDelete when delete button is clicked and confirmed', () => {
        window.confirm = jest.fn(() => true);
        
        render(
            <ActivityList 
                activities={mockActivities}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                loading={false}
            />
        );

        fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
        expect(mockOnDelete).toHaveBeenCalledWith('1');
    });

    test('shows loading state', () => {
        render(
            <ActivityList 
                activities={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                loading={true}
            />
        );

        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText(/loading activities/i)).toBeInTheDocument();
    });
});