@echo off
title Subir Proyecto ATLAS a GitHub
chcp 65001 >nul
echo ========================================================
echo        SUBIR PLATAFORMA ATLAS A TU GITHUB
echo ========================================================
echo.

set "GIT_EXE=C:\Users\Usuario\.gemini\antigravity\scratch\tools\git\cmd\git.exe"

if not exist "%GIT_EXE%" (
    echo [ERROR] No se encontro Git portable.
    pause
    exit /b 1
)

echo Repositorio local preparado y listo.
echo.
set /p REPO_URL="Pega aqui la URL de tu repositorio de GitHub (ejemplo: https://github.com/tu-usuario/atlas-web.git): "

if "%REPO_URL%"=="" (
    echo No ingresaste ninguna URL. Operacion cancelada.
    pause
    exit /b 1
)

echo.
echo Conectando con tu repositorio en GitHub...
"%GIT_EXE%" remote remove origin >nul 2>&1
"%GIT_EXE%" remote add origin %REPO_URL%
"%GIT_EXE%" branch -M main

echo.
echo Subiendo el codigo a la rama main...
echo (Si es la primera vez, se abrira una ventana segura de GitHub para que inicies sesion)
echo.
"%GIT_EXE%" push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo  ¡LISTO! Tu codigo esta publicado en GitHub exitosamente.
    echo ========================================================
) else (
    echo.
    echo Ocurrio un error al subir. Revisa tus permisos o credenciales.
)

pause
