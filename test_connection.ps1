Write-Host "Testing Backend Connection..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 5
    Write-Host "✅ Backend is running!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)"
} catch {
    Write-Host "❌ Cannot connect to backend!" -ForegroundColor Red
    Write-Host "Make sure you're in the virtual environment and the server is running."
}

Write-Host "`nTesting Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000" -TimeoutSec 5
    Write-Host "✅ Frontend is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend is not running!" -ForegroundColor Red
    Write-Host "Run 'npm start' in the frontend directory."
}