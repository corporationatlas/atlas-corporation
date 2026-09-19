@echo off
title Subir Proyecto ATLAS a GitHub
chcp 65001 >nul
cls
echo ===================================================================
echo             SUBIR PLATAFORMA ATLAS A GITHUB
echo ===================================================================
echo.
echo Repositorio destino:
echo https://github.com/corporationatlas/atlas-corporation.git
echo.

set "GIT_EXE=C:\Users\Usuario\.gemini\antigravity\scratch\tools\git\cmd\git.exe"

if not exist "%GIT_EXE%" (
    echo [ERROR] No se encontro Git portable en tools.
    pause
    exit /b 1
)

"%GIT_EXE%" remote remove origin >nul 2>&1
"%GIT_EXE%" remote add origin https://github.com/corporationatlas/atlas-corporation.git
"%GIT_EXE%" branch -M main

echo.
echo Opciones de autenticacion con GitHub:
echo.
echo [1] Pegar un Token de Acceso Personal (GitHub PAT) (Recomendado y rapido)
echo [2] Intentar inicio de sesion manual por consola
echo.
set /p OPCION="Selecciona 1 o 2: "

if "%OPCION%"=="1" (
    echo.
    set /p GHTOKEN="Pega aqui tu GitHub Token (ghp_...): "
    if not "%GHTOKEN%"=="" (
        echo.
        echo Subiendo codigo a main usando token...
        "%GIT_EXE%" push -u "https://corporationatlas:%GHTOKEN%@github.com/corporationatlas/atlas-corporation.git" main
        goto FIN
    )
)

echo.
echo Subiendo con credenciales manuales...
"%GIT_EXE%" push -u origin main

:FIN
echo.
if %ERRORLEVEL% equ 0 (
    echo ===================================================================
    echo  ¡EXITO TOTAL! El codigo esta ahora en tu repositorio de GitHub:
    echo  https://github.com/corporationatlas/atlas-corporation
    echo ===================================================================
) else (
    echo [AVISO] Si fallo, recuerda que GitHub ya no acepta contraseñas normales,
    echo solo Tokens de Acceso Personal (PAT) con permisos de "repo".
)

echo.
pause
