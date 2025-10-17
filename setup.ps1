# Quick Start Script for Mock Test Application
# Run this script to set up the application quickly

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  B.Sc. CSIT Mock Test - Quick Setup Script   " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "[1/5] Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host "⚠ Please update DATABASE_URL in .env file before continuing!" -ForegroundColor Red
    Write-Host ""
    $continue = Read-Host "Have you updated the DATABASE_URL? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Setup cancelled. Please update .env and run this script again." -ForegroundColor Red
        exit
    }
} else {
    Write-Host "[1/5] .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/5] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "[3/5] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to generate Prisma Client" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "[4/5] Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database migrated" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to migrate database" -ForegroundColor Red
    Write-Host "Please check your DATABASE_URL and ensure PostgreSQL is running" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "[5/5] Seeding database..." -ForegroundColor Yellow
npm run prisma:seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database seeded" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to seed database" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete! 🎉                           " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Admin Credentials:" -ForegroundColor Yellow
Write-Host "  Email: admin@csitabmc.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "To start the development server, run:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open http://localhost:3000 in your browser" -ForegroundColor Yellow
Write-Host ""
