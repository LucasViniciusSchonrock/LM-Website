' =======================================================
' Luke Manhwa [Obras] - Launcher VBS (Modo Silencioso)
' =======================================================
Option Explicit

Dim WshShell, FSO, ScriptDir
Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")

' Pega a pasta atual do script dinamicamente
ScriptDir = FSO.GetParentFolderName(WScript.ScriptFullName)

' Executa o aplicativo Electron oficial com ambiente limpo
WshShell.CurrentDirectory = ScriptDir
WshShell.Run "cmd.exe /c cd /d """ & ScriptDir & """ && set ""ELECTRON_RUN_AS_NODE="" && npm.cmd run electron", 0, False
