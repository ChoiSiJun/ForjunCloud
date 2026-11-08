[CmdletBinding()]
param(
    [ValidateSet('quick', 'full')]
    [string]$Suite = 'quick',
    [switch]$Storybook
)

$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path $PSScriptRoot -Parent
$yarnRelease = Join-Path $repositoryRoot '.yarn/releases/yarn-4.1.1.cjs'
$typeScript = Join-Path $repositoryRoot 'node_modules/typescript/bin/tsc'

function Invoke-NodeCheck {
    param([string[]]$NodeArguments)
    & node @NodeArguments
    if ($LASTEXITCODE -ne 0) { throw "Frontend verification failed (exit $LASTEXITCODE): node $($NodeArguments -join ' ')" }
}

Push-Location $repositoryRoot
try {
    if (!(Test-Path -LiteralPath $yarnRelease) -or !(Test-Path -LiteralPath $typeScript)) {
        throw 'Yarn release or TypeScript is missing. Install the locked dependencies first.'
    }
    $cacheDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ('fortuncloud-types-' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $cacheDirectory | Out-Null
    Write-Host "TypeScript cache: $cacheDirectory"
    Invoke-NodeCheck -NodeArguments @($yarnRelease, 'lint')
    $projects = @(
        @{ Config = 'package/home/tsconfig.json'; Cache = 'home' },
        @{ Config = 'package/core/tsconfig.json'; Cache = 'core' },
        @{ Config = 'storybook/tsconfig.app.json'; Cache = 'storybook-app' },
        @{ Config = 'storybook/tsconfig.node.json'; Cache = 'storybook-node' }
    )
    foreach ($project in $projects) {
        Invoke-NodeCheck -NodeArguments @($typeScript, '-p', $project.Config, '--noEmit', '--incremental', '--tsBuildInfoFile', (Join-Path $cacheDirectory ($project.Cache + '.tsbuildinfo')))
    }
    Invoke-NodeCheck -NodeArguments @('scripts/test-personal-profile.cjs')
    if ($Suite -eq 'full') { Invoke-NodeCheck -NodeArguments @($yarnRelease, 'build') }
    if ($Storybook) { Invoke-NodeCheck -NodeArguments @($yarnRelease, 'build-storybook') }
    Write-Host "PASS: frontend $Suite verification"
} finally {
    Pop-Location
}
