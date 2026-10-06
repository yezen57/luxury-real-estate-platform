# scripts/setup-powershell.ps1
# هذا السكربت يقوم بإضافة وتحديث دالة Start-Dayar في ملف الـ Profile الخاص بالباورشيل.

$FunctionCode = @'

# دالة لتشغيل مشروع ديار الأحلام من أي مكان في الباورشيل
function Start-Dayar {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$false)]
        [switch]$Install
    )

    $ProjectPath = "d:\projects\My jop\ديار الاحلام\الموقع الالكتروني\dayar"

    if (-not (Test-Path $ProjectPath)) {
        Write-Error "المسار الخاص بالمشروع غير موجود: $ProjectPath"
        return
    }

    # تحميل متغيرات البيئة من ملف .env إن وجد
    $EnvFile = Join-Path $ProjectPath ".env"
    if (Test-Path $EnvFile) {
        Write-Host "Loading environment variables from .env file..." -ForegroundColor Cyan
        Get-Content $EnvFile | ForEach-Object {
            $line = $_.Trim()
            if ($line -and -not $line.StartsWith("#")) {
                $key, $value = $line -split '=', 2
                if ($key -and $value) {
                    $key = $key.Trim()
                    $value = $value.Trim()
                    [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
                }
            }
        }
    } else {
        Write-Warning "ملف .env غير موجود! يرجى إنشاء ملف .env في مسار المشروع وتحديد DATABASE_URL و SESSION_SECRET."
        Write-Warning "يمكنك نسخ ملف .env.example وتعديله."
    }

    $PSExe = (Get-Process -Id $PID).Path

    if ($Install) {
        Write-Host "جاري تثبيت الحزم (npm packages) في $ProjectPath..." -ForegroundColor Cyan
        Push-Location $ProjectPath
        try {
            pnpm install
        } finally {
            Pop-Location
        }
    }

    Write-Host "جاري تشغيل خادم الـ API في نافذة جديدة..." -ForegroundColor Yellow
    Start-Process $PSExe -ArgumentList "-NoExit", "-Command", "cd '$ProjectPath'; `$env:PORT=`$env:API_PORT; `$env:NODE_ENV='development'; pnpm --filter @workspace/api-server run dev"

    Write-Host "جاري تشغيل الواجهة الأمامية (Frontend) في نافذة جديدة..." -ForegroundColor Yellow
    Start-Process $PSExe -ArgumentList "-NoExit", "-Command", "cd '$ProjectPath'; pnpm --filter @workspace/dayar-al-ahlam run dev"

    Write-Host "تم تشغيل خادم الـ API والـ Frontend بنجاح في نوافذ منفصلة!" -ForegroundColor Green
}
'@

# التأكد من وجود ملف الـ Profile
if (-not (Test-Path $PROFILE)) {
    Write-Host "ملف الـ Profile غير موجود. جاري إنشائه..." -ForegroundColor Yellow
    $ProfileDir = Split-Path $PROFILE -Parent
    if (-not (Test-Path $ProfileDir)) {
        New-Item -Type Directory -Path $ProfileDir -Force | Out-Null
    }
    New-Item -Type File -Path $PROFILE -Force | Out-Null
}

# قراءة محتوى الـ Profile لتحديثه بشكل آمن
$ProfileContent = Get-Content $PROFILE -Raw

if ($ProfileContent -match "function Start-Dayar") {
    # إذا كانت الدالة موجودة، نقوم بإعادة تعيين الملف بالدالة الجديدة لتجنب التكرار والتلف
    Set-Content -Path $PROFILE -Value $FunctionCode -Force
    Write-Host "تم تحديث دالة Start-Dayar بنجاح في ملف الـ Profile الخاص بك!" -ForegroundColor Green
} else {
    Add-Content -Path $PROFILE -Value $FunctionCode
    Write-Host "تمت إضافة دالة Start-Dayar بنجاح إلى ملف الـ Profile الخاص بك!" -ForegroundColor Green
}

Write-Host "مسار ملف الـ Profile: $PROFILE" -ForegroundColor Gray
