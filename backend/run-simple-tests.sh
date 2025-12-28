#!/bin/bash

echo "Starting simplified test suite..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check MongoDB connection
echo -e "${YELLOW}Testing MongoDB connection...${NC}"
php artisan tinker --execute="
try {
    \$connection = DB::connection('mongodb');
    echo '${GREEN}✓ Connected to MongoDB: ' . \$connection->getDatabaseName() . '${NC}\n';
} catch (\Exception \$e) {
    echo '${RED}✗ MongoDB connection failed: ' . \$e->getMessage() . '${NC}\n';
    exit(1);
}
"

# Run only specific tests
echo -e "\n${YELLOW}Running model tests...${NC}"
./vendor/bin/phpunit --testsuite Unit --filter ActivityTest
./vendor/bin/phpunit --testsuite Unit --filter UserTest

echo -e "\n${YELLOW}Running simple feature tests...${NC}"
./vendor/bin/phpunit --testsuite Feature --filter MongoDBConnectionTest
./vendor/bin/phpunit --testsuite Feature --filter SimpleApiTest

echo -e "\n${GREEN}✓ Simplified test suite completed!${NC}"