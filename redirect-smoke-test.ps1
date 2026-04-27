param(
  [string]$BaseUrl = "https://www.autocracymachinery.com"
)

$oldPaths = @(
  "/",
  "/about-us",
  "/brochure",
  "/careers",
  "/contact-us",
  "/faqs",
  "/find-a-dealer",
  "/industries",
  "/products",
  "/privacy-policy",
  "/terms-and-conditions"
)

Write-Host "Testing redirects against $BaseUrl`n"

foreach ($path in $oldPaths) {
  $url = "$BaseUrl$path"
  $response = curl.exe -s -I $url
  $status = ($response | Select-String -Pattern "^HTTP/" | Select-Object -First 1).Line
  $location = ($response | Select-String -Pattern "^Location:" | Select-Object -First 1).Line

  Write-Host "$path"
  Write-Host "  $status"
  if ($location) {
    Write-Host "  $location"
  }
  Write-Host ""
}
