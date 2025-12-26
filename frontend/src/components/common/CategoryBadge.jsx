import { Badge } from 'react-bootstrap';

const CategoryBadge = ({ category }) => {
    const getCategoryColor = (category) => {
        switch(category?.toLowerCase()) {
            case 'self-care':
            case 'selfcare':
                return 'selfcare';
            case 'productivity':
                return 'productivity';
            case 'reward':
                return 'reward';
            default:
                return 'secondary';
        }
    };

    return (
        <Badge bg={getCategoryColor(category)}>
            {category || 'Unknown'}
        </Badge>
    );
};

export default CategoryBadge;