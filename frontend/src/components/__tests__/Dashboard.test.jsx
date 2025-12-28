import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock component since we don't have the actual one yet
const Dashboard = () => {
    return (
        <div data-testid="dashboard">
            <h1>Activity Dashboard</h1>
            <div>Statistics will go here</div>
        </div>
    );
};

describe('Dashboard Component', () => {
    test('renders dashboard heading', () => {
        render(<Dashboard />);
        const heading = screen.getByText(/activity dashboard/i);
        expect(heading).toBeInTheDocument();
    });

    test('dashboard container exists', () => {
        render(<Dashboard />);
        const dashboard = screen.getByTestId('dashboard');
        expect(dashboard).toBeInTheDocument();
    });
});
