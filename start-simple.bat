@echo off
cls
echo =======================================
echo  PRODUCT AUTHENTICITY SYSTEM - SIMPLE
echo =======================================
echo.

:menu
echo Choose an option:
echo 1. Install dependencies (requires internet)
echo 2. Compile smart contracts
echo 3. Start local blockchain node
echo 4. Deploy contracts to local node
echo 5. Start React frontend
echo 6. Exit
echo.

set /p choice=Enter your choice (1-6): 

if "%choice%"=="1" goto install
if "%choice%"=="2" goto compile
if "%choice%"=="3" goto node
if "%choice%"=="4" goto deploy
if "%choice%"=="5" goto frontend
if "%choice%"=="6" goto end

echo Invalid choice. Please try again.
goto menu

:install
echo.
echo Installing dependencies...
npm install
echo.
pause
cls
goto menu

:compile
echo.
echo Compiling smart contracts...
npx hardhat compile
echo.
pause
cls
goto menu

:node
echo.
echo Starting local blockchain node...
echo Press Ctrl+C to stop the node when done.
echo.
npx hardhat node
goto menu

:deploy
echo.
echo Deploying contracts to local node...
npx hardhat run scripts/deploy.js --network localhost
echo.
pause
cls
goto menu

:frontend
echo.
echo Starting React frontend...
echo Press Ctrl+C to stop the app when done.
echo.
cd frontend
npm install
npm start
cd ..
goto menu

:end
echo.
echo Thank you for using the Product Authenticity System!
echo. 