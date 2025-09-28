# Urlyn Backend - Modular System Test Script (PowerShell)
# This script helps test the new modular backend architecture

Write-Host "🚀 Urlyn Backend - Modular System Test" -ForegroundColor Blue
Write-Host "======================================" -ForegroundColor Blue

$baseUrl = "http://localhost:5001"
$modularRunning = $false

Write-Host ""
Write-Host "1. Checking Server Status" -ForegroundColor Blue
Write-Host "-------------------------"

# Function to test if service is running
function Test-Service {
    param(
        [string]$url,
        [string]$name
    )
    
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $name is running" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "❌ $name is not running" -ForegroundColor Red
        return $false
    }
}

# Check if modular server is running
if (Test-Service "$baseUrl/api/health" "Modular Server") {
    $script:modularRunning = $true
} else {
    $script:modularRunning = $false
}

Write-Host ""
Write-Host "2. Module Structure Validation" -ForegroundColor Blue
Write-Host "-----------------------------"

# Check if key directories exist
$directories = @(
    "modules",
    "modules\auth",
    "modules\core",
    "modules\personas",
    "modules\personas\student",
    "modules\personas\creator", 
    "modules\personas\professional",
    "modules\personas\entrepreneur",
    "modules\personas\researcher",
    "modules\shared"
)

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Write-Host "✅ $dir exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $dir missing" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "3. Key Files Validation" -ForegroundColor Blue
Write-Host "----------------------"

# Check if key files exist
$files = @(
    "server-modular.js",
    "modules\ModuleManager.js",
    "modules\auth\models\User.js",
    "modules\auth\models\PersonaProfile.js",
    "modules\core\models\Bookmark.js",
    "modules\core\models\Folder.js",
    "modules\shared\services\socketManager.js"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file missing" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "4. Legacy Cleanup Verification" -ForegroundColor Blue
Write-Host "------------------------------"

# Check that legacy folders are removed
$legacyFolders = @(
    "controllers",
    "models",
    "routes", 
    "services",
    "config",
    "middlewares",
    "utils"
)

foreach ($folder in $legacyFolders) {
    if (Test-Path $folder) {
        Write-Host "⚠️ Legacy folder still exists: $folder" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Legacy folder removed: $folder" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Summary" -ForegroundColor Blue
Write-Host "======="

if ($script:modularRunning) {
    Write-Host "🎉 Modular backend is operational!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Blue
    Write-Host "1. Run comprehensive tests: npm test"
    Write-Host "2. Test persona switching in the frontend"
    Write-Host "3. Verify data isolation between personas"
    Write-Host "4. Monitor module performance"
} else {
    Write-Host "📝 Modular backend structure is ready!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To start the server:" -ForegroundColor Blue
    Write-Host "npm run dev:modular"
}

Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Blue
Write-Host "npm run dev:modular          # Start development server"
Write-Host "npm run health              # Check system health"
Write-Host "npm run modules:status      # Check module status"
Write-Host "npm test                    # Run test suite"
Write-Host "npm run test:personas       # Test persona functionality"

Write-Host ""
Write-Host "🚀 Modular backend cleanup and test complete!" -ForegroundColor Green
