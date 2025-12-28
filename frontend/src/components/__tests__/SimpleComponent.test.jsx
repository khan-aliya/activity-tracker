import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const SimpleComponent = () => {
    return (
        <div>
            <h1>Activity Tracker</h1>
            <p>Welcome to the activity tracker</p>
        </div>
    );
};

describe('SimpleComponent', () => {
    test('renders heading', () => {
        render(<SimpleComponent />);
        const heading = screen.getByRole('heading', { name: /activity tracker/i });
        expect(heading).toBeInTheDocument();
    });

    test('renders welcome text', () => {
        render(<SimpleComponent />);
        const welcomeText = screen.getByText(/welcome to the activity tracker/i);
        expect(welcomeText).toBeInTheDocument();
    });
});
