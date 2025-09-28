@echo off
REM Urlyn Backend - Modular System Test Script (Windows)
REM This script helps test the new modular backend architecture

echo 🚀 Urlyn Backend - Modular System Test
echo ======================================

set BASE_URL=http://localhost:5001
set MODULAR_RUNNING=false

echo.
echo 1. Checking Server Status
echo -------------------------

REM Check if modular server is running
curl -s %BASE_URL%/api/health >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo ✅ Modular Server is running
    set MODULAR_RUNNING=true
) else (
    echo ❌ Modular Server is not running
)

echo.
echo 2. Testing Core Endpoints
echo -------------------------

if "%MODULAR_RUNNING%"=="true" (
    echo Testing System Health...
    curl -s %BASE_URL%/api/health
    echo.
    
    echo Testing Module Health...
    curl -s %BASE_URL%/api/health/modules
    echo.
    
    echo Testing Auth Endpoints...
    curl -s -w "Status: %%{http_code}" %BASE_URL%/api/auth/me
    echo.
    
    echo.
    echo 3. Testing Core Feature Endpoints
    echo --------------------------------
    
    echo Testing Core Bookmarks (should require auth)...
    curl -s -w "Status: %%{http_code}" %BASE_URL%/api/core/bookmarks
    echo.
    
    echo Testing Core Folders (should require auth)...
    curl -s -w "Status: %%{http_code}" %BASE_URL%/api/core/folders
    echo.
    
    echo.
    echo 4. Testing Persona Endpoints
    echo ----------------------------
    
    echo Testing Student Persona...
    curl -s -w "Status: %%{http_code}" %BASE_URL%/api/personas/student
    echo.
    
    echo Testing Creator Persona...
    curl -s -w "Status: %%{http_code}" %BASE_URL%/api/personas/creator
    echo.
    
    echo.
    echo 5. Testing Legacy Compatibility
    echo ------------------------------
    
    echo Testing Legacy Student Folders...
    curl -s -w "Status: %%{http_code}" %BASE_URL%/api/student/folders
    echo.
    
) else (
    echo ❌ Cannot test endpoints - server is not running
    echo 💡 Start the server with: npm run dev:modular
)

echo.
echo 6. Module Structure Validation
echo -----------------------------

set directories=backend\modules backend\modules\auth backend\modules\core backend\modules\personas backend\modules\personas\student backend\modules\personas\creator backend\modules\personas\professional backend\modules\personas\entrepreneur backend\modules\personas\researcher backend\modules\shared

for %%d in (backend\modules backend\modules\auth backend\modules\core backend\modules\personas backend\modules\personas\student backend\modules\personas\creator backend\modules\personas\professional backend\modules\personas\entrepreneur backend\modules\personas\researcher backend\modules\shared) do (
    if exist "%%d" (
        echo ✅ %%d exists
    ) else (
        echo ❌ %%d missing
    )
)

echo.
echo 7. Key Files Validation
echo ----------------------

for %%f in (backend\server-modular.js backend\modules\ModuleManager.js backend\modules\auth\models\User.js backend\modules\auth\models\PersonaProfile.js backend\modules\core\models\Bookmark.js backend\modules\core\models\Folder.js) do (
    if exist "%%f" (
        echo ✅ %%f exists
    ) else (
        echo ❌ %%f missing
    )
)

echo.
echo Summary
echo =======

if "%MODULAR_RUNNING%"=="true" (
    echo 🎉 Modular backend is operational!
    echo.
    echo Next steps:
    echo 1. Run comprehensive tests: npm test
    echo 2. Test persona switching in the frontend
    echo 3. Verify data isolation between personas
    echo 4. Monitor module performance
) else (
    echo ❌ Modular backend needs to be started
    echo.
    echo To start the server:
    echo cd backend && npm run dev:modular
)

echo.
echo Useful commands:
echo npm run dev:modular          # Start development server
echo npm run health              # Check system health
echo npm run modules:status      # Check module status
echo npm test                    # Run test suite
echo npm run test:personas       # Test persona functionality

echo.
echo 🚀 Modular backend test complete!
pause
