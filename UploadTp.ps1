######################################################################
# Get Command Line Parameters
######################################################################
#param (
#    ##queries the user for input if the parameter is missing
#    [string]$Ip='172.16.48.109',
#    [string]$Username='admin',
#    [string]$Password='password'
#)
#$filter = "*.ch5z"
#$file = Get-ChildItem -Path $PSScriptRoot -Filter $filter -Recurse | sort LastWriteTime -Descending | Select-Object -First 1 | % { $_.Fullname}
#if ($file.length -eq 0)
#{
#    Write-Host "no ch5z files found"
#    Exit
#}
$Ip = "172.16.48.109";
$Username="admin";
$Password="password";
$file = "C:\clients\SpinitarCSharpLibrary\Ember\EmberUI\dist\ch5z\EmberUI.ch5z";
Write-Host "Uploading to " $Ip $file
Send-CrestronProject -Device $Ip -LocalFile $file -Secure -Username $Username -Password $Password
#Send-CrestronProject -Device $Ip -LocalFile $file -Secure -Username admin -Password password