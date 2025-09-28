#!/bin/bash

# Urlyn Backend - Modular System Test Script
# This script helps test the new modular backend architecture

echo "🚀 Urlyn Backend - Modular System Test"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if service is running
check_service() {
    local url=$1
    local name=$2
    
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $name is not running${NC}"
        return 1
    fi
}

# Function to test API endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local name=$3
    local expected_status=${4:-200}
    
    echo -n "Testing $name... "
    
    response=$(curl -s -w "%{http_code}" -X "$method" "$url" -o /dev/null)
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL (Expected: $expected_status, Got: $response)${NC}"
        return 1
    fi
}

echo ""
echo -e "${BLUE}1. Checking Server Status${NC}"
echo "-------------------------"

BASE_URL="http://localhost:5001"

# Check if modular server is running
if check_service "$BASE_URL/api/health" "Modular Server"; then
    MODULAR_RUNNING=true
else
    MODULAR_RUNNING=false
fi

# Check if legacy server is running (on different port for testing)
if check_service "http://localhost:5002/health" "Legacy Server (if running)"; then
    LEGACY_RUNNING=true
else
    LEGACY_RUNNING=false
    echo -e "${YELLOW}ℹ️  Legacy server not running (this is expected)${NC}"
fi

echo ""
echo -e "${BLUE}2. Testing Core Endpoints${NC}"
echo "-------------------------"

if [ "$MODULAR_RUNNING" = true ]; then
    # Test health endpoints
    test_endpoint "GET" "$BASE_URL/api/health" "System Health"
    test_endpoint "GET" "$BASE_URL/api/health/modules" "Module Health"
    
    # Test auth endpoints (should return method not allowed or validation errors, not 404)
    test_endpoint "GET" "$BASE_URL/api/auth/me" "Auth Me Endpoint" "401"
    test_endpoint "POST" "$BASE_URL/api/auth/register" "Auth Register Endpoint" "400"
    test_endpoint "POST" "$BASE_URL/api/auth/login" "Auth Login Endpoint" "400"
    
    echo ""
    echo -e "${BLUE}3. Testing Core Feature Endpoints${NC}"
    echo "--------------------------------"
    
    # Test core endpoints (should require auth)
    test_endpoint "GET" "$BASE_URL/api/core/bookmarks" "Core Bookmarks" "401"
    test_endpoint "GET" "$BASE_URL/api/core/folders" "Core Folders" "401"
    test_endpoint "GET" "$BASE_URL/api/core/tags" "Core Tags" "401"
    test_endpoint "GET" "$BASE_URL/api/core/notes" "Core Notes" "401"
    test_endpoint "GET" "$BASE_URL/api/core/tasks" "Core Tasks" "401"
    
    echo ""
    echo -e "${BLUE}4. Testing Persona Endpoints${NC}"
    echo "----------------------------"
    
    # Test persona endpoints (should require auth)
    test_endpoint "GET" "$BASE_URL/api/personas/student" "Student Persona Index" "401"
    test_endpoint "GET" "$BASE_URL/api/personas/creator" "Creator Persona Index" "401"
    test_endpoint "GET" "$BASE_URL/api/personas/professional" "Professional Persona Index" "401"
    test_endpoint "GET" "$BASE_URL/api/personas/entrepreneur" "Entrepreneur Persona Index" "401"
    test_endpoint "GET" "$BASE_URL/api/personas/researcher" "Researcher Persona Index" "401"
    
    echo ""
    echo -e "${BLUE}5. Testing Legacy Compatibility${NC}"
    echo "------------------------------"
    
    # Test legacy endpoints (should redirect or work)
    test_endpoint "GET" "$BASE_URL/api/student/folders" "Legacy Student Folders" "401"
    
else
    echo -e "${RED}❌ Cannot test endpoints - server is not running${NC}"
    echo -e "${YELLOW}💡 Start the server with: npm run dev:modular${NC}"
fi

echo ""
echo -e "${BLUE}6. Module Structure Validation${NC}"
echo "-----------------------------"

# Check if key directories exist
directories=(
    "backend/modules"
    "backend/modules/auth"
    "backend/modules/core" 
    "backend/modules/personas"
    "backend/modules/personas/student"
    "backend/modules/personas/creator"
    "backend/modules/personas/professional"
    "backend/modules/personas/entrepreneur"
    "backend/modules/personas/researcher"
    "backend/modules/shared"
)

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $dir exists${NC}"
    else
        echo -e "${RED}❌ $dir missing${NC}"
    fi
done

echo ""
echo -e "${BLUE}7. Key Files Validation${NC}"
echo "----------------------"

# Check if key files exist
files=(
    "backend/server-modular.js"
    "backend/modules/ModuleManager.js"
    "backend/modules/auth/models/User.js"
    "backend/modules/auth/models/PersonaProfile.js"
    "backend/modules/core/models/Bookmark.js"
    "backend/modules/core/models/Folder.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done

echo ""
echo -e "${BLUE}8. Database Connection Test${NC}"
echo "---------------------------"

# Check MongoDB connection (requires server to be running)
if [ "$MODULAR_RUNNING" = true ]; then
    if curl -s "$BASE_URL/api/health" | grep -q "database.*connected" 2>/dev/null; then
        echo -e "${GREEN}✅ Database connection healthy${NC}"
    else
        echo -e "${YELLOW}⚠️  Database status unknown${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Cannot test database - server not running${NC}"
fi

echo ""
echo -e "${BLUE}Summary${NC}"
echo "======="

if [ "$MODULAR_RUNNING" = true ]; then
    echo -e "${GREEN}🎉 Modular backend is operational!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Run comprehensive tests: npm test"
    echo "2. Test persona switching in the frontend"
    echo "3. Verify data isolation between personas"
    echo "4. Monitor module performance"
else
    echo -e "${RED}❌ Modular backend needs to be started${NC}"
    echo ""
    echo -e "${BLUE}To start the server:${NC}"
    echo "cd backend && npm run dev:modular"
fi

echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "npm run dev:modular          # Start development server"
echo "npm run health              # Check system health"
echo "npm run modules:status      # Check module status"
echo "npm test                    # Run test suite"
echo "npm run test:personas       # Test persona functionality"

echo ""
echo -e "${GREEN}🚀 Modular backend test complete!${NC}"
