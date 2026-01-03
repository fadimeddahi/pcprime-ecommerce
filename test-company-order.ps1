# Test enterprise order API endpoint
$url = "https://api.primecomputerdz.dz/company-orders"

$body = @{
    company_data = @{
        company_name = "TechVision Solutions"
        person_name = "Ahmed Bennaceur"
        tax_id = "001234567890123"
        nif = "001234567890123"
        rc = "20/00-1234567B21"
        art = "12345678901234"
        nic = "001234567890123"
        contact_person = "Ahmed Bennaceur"
        contact_title = "IT Manager"
        phone = "+213555123456"
        email = "ahmed.b@techvision.dz"
        address = "45 Rue Didouche Mourad"
        city = "Algiers"
        postal_code = "16000"
        country = "Algeria"
        website = "www.techvision.dz"
        registration_number = "REG-2024-001234"
        industry = "Information Technology"
    }
    cart_items = @(
        @{
            product_id = "792e0565-d979-4d9e-b4da-34a4c683d1c8"
            quantity = 2
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "Sending request to: $url"
Write-Host "Body:"
Write-Host $body
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response Body:"
    Write-Host $responseBody
}
