[CmdletBinding()]
param(
    [ValidateSet('unit', 'full')]
    [string]$Suite = 'unit',
    [string]$GradleUserHome
)

$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path $PSScriptRoot -Parent
Push-Location $repositoryRoot
try {
    $gradleArguments = @('--console=plain', 'test')
    if ($GradleUserHome) {
        $gradleArguments += @('--gradle-user-home', $GradleUserHome)
    }
    if ($Suite -eq 'unit') {
        $testClasses = @(
            'forjun.web.module.history.application.HistoryServiceTest',
            'forjun.web.module.history.api.HistoryRequestValidationTest',
            'forjun.web.module.personal.application.PersonalImageTest',
            'forjun.web.module.system.application.FileQueryServiceTest',
            'forjun.web.module.system.application.FileUploadServiceTest',
            'forjun.web.module.system.infrastructure.storage.LocalFileStorageAdapterTest'
        )
        foreach ($testClass in $testClasses) {
            $gradleArguments += @('--tests', $testClass)
        }
    }
    & .\gradlew.bat @gradleArguments
    if ($LASTEXITCODE -ne 0) { throw "Gradle verification failed (exit $LASTEXITCODE)." }
    Write-Host "PASS: backend $Suite verification"
} finally {
    Pop-Location
}
