Write-Host ""
Write-Host "SoundChain API Test Suite" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$testsPassed = 0
$testsFailed = 0
$failedTests = @()

function Test-API {
    param(
        [string]$name,
        [string]$method,
        [string]$endpoint
    )
    
    try {
        Write-Host "Testing: $name" -NoNewline
        
        $uri = "$baseUrl$endpoint"
        $response = $null
        
        if ($method -eq "GET") {
            $response = Invoke-WebRequest -Uri $uri -Method GET -UseBasicParsing -ErrorAction Stop
        }
        elseif ($method -eq "POST") {
            $response = Invoke-WebRequest -Uri $uri -Method POST -UseBasicParsing -ErrorAction Stop
        }
        
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
            Write-Host " PASS" -ForegroundColor Green
            $script:testsPassed++
        }
        else {
            Write-Host " FAIL (Status: $($response.StatusCode))" -ForegroundColor Red
            $script:testsFailed++
            $script:failedTests += $name
        }
    }
    catch {
        Write-Host " FAIL" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        $script:failedTests += $name
    }
}

Write-Host "Track APIs" -ForegroundColor Yellow
Test-API -name "GET /api/tracks (all)" -method "GET" -endpoint "/api/tracks"
Test-API -name "GET /api/tracks (limit)" -method "GET" -endpoint "/api/tracks?limit=5"
Test-API -name "GET /api/tracks (search)" -method "GET" -endpoint "/api/tracks?search=test"
Test-API -name "GET /api/tracks (genre)" -method "GET" -endpoint "/api/tracks?genre=Pop"
Test-API -name "GET /api/tracks (sort by plays)" -method "GET" -endpoint "/api/tracks?sort=plays"
Write-Host ""

Write-Host "Artist APIs" -ForegroundColor Yellow
Test-API -name "GET /api/artists (all)" -method "GET" -endpoint "/api/artists"
Test-API -name "GET /api/artists (search)" -method "GET" -endpoint "/api/artists?search=test"
Write-Host ""

Write-Host "User APIs" -ForegroundColor Yellow
Test-API -name "GET /api/users" -method "GET" -endpoint "/api/users"
Write-Host ""

Write-Host "Analytics APIs" -ForegroundColor Yellow
Test-API -name "GET /api/analytics (platform)" -method "GET" -endpoint "/api/analytics"
Test-API -name "GET /api/analytics (artist)" -method "GET" -endpoint "/api/analytics?wallet=0x0000000000000000000000000000000000000000"
Write-Host ""

Write-Host "Recommendations API" -ForegroundColor Yellow
Test-API -name "GET /api/recommendations" -method "GET" -endpoint "/api/recommendations"
Write-Host ""

Write-Host "Earnings APIs" -ForegroundColor Yellow
Test-API -name "GET /api/earnings (artist)" -method "GET" -endpoint "/api/earnings?wallet=0x0000000000000000000000000000000000000000"
Write-Host ""

Write-Host "=========================" -ForegroundColor Cyan
Write-Host "Test Results" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "Total Tests: $($testsPassed + $testsFailed)" -ForegroundColor White
Write-Host "Passed: $testsPassed" -ForegroundColor Green
Write-Host "Failed: $testsFailed" -ForegroundColor Red
Write-Host ""

if ($testsFailed -gt 0) {
    Write-Host "Failed Tests:" -ForegroundColor Red
    foreach ($test in $failedTests) {
        Write-Host "  - $test" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Some tests failed." -ForegroundColor Yellow
    exit 1
}
else {
    Write-Host "All tests passed!" -ForegroundColor Green
    exit 0
}