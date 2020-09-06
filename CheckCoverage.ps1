param(
	[string]$coverageReportPath = $(throw "coverageReportPath is required"),
	[int]$coverageThreshold = $(throw "coverageThreshold is reqired")
)

[xml]$coverageDoc = Get-Content -Path $coverageReportPath;
Write-Host $coverageDoc.coverage.'line-rate';
[float]$lineRate = $coverageDoc.coverage.'line-rate';
[float]$lineRatePercentage = $lineRate * 100;
Write-Host "Coverage line rate: $lineRatePercentage"
if ($lineRatePercentage -lt $coverageThreshold) {
	Write-Error -Message "Coverage percentage too low. Required: $coverageThreshold Coverage: $lineRatePercentage";
	return 1;
}

return;
