#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting PHPUnit Tests...${NC}\n"

# Run unit tests
echo -e "${GREEN}Running Unit Tests...${NC}"
./vendor/bin/phpunit --testsuite Unit

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓ All unit tests passed!${NC}"
else
    echo -e "\n${RED}✗ Some unit tests failed!${NC}"
    exit 1
fi

# Run with coverage
echo -e "\n${GREEN}Generating Test Coverage Report...${NC}"
./vendor/bin/phpunit --coverage-html tests/coverage

echo -e "\n${GREEN}✓ Coverage report generated at tests/coverage/index.html${NC}"
echo -e "\n${YELLOW}Test Summary:${NC}"
echo -e "Unit Tests: $(find tests/Unit -name '*Test.php' | wc -l) test files"
echo -e "Feature Tests: $(find tests/Feature -name '*Test.php' | wc -l) test files"