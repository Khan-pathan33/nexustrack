
Add-Type -AssemblyName System.Windows.Forms
$html = Get-Content -Path "C:\\Users\\Nafisa Khanam\\Desktop\\online tracker next.js project\\trackpulse\\scripts\\report.html" -Raw -Encoding UTF8

$prefix = @"
Version:0.9
StartHTML:<<<<<<<<1
EndHTML:<<<<<<<<2
StartFragment:<<<<<<<<3
EndFragment:<<<<<<<<4
<html><body>
<!--StartFragment-->
"@

$suffix = @"
<!--EndFragment-->
</body></html>
"@

$combined = $prefix + $html + $suffix
$bytes = [System.Text.Encoding]::UTF8.GetBytes($combined)
$len = $bytes.Length

$sHTML = 105
$eHTML = $len
$sFrag = [System.Text.Encoding]::UTF8.GetBytes($prefix).Length
$eFrag = $sFrag + [System.Text.Encoding]::UTF8.GetBytes($html).Length

$p1 = $sHTML.ToString("D8")
$p2 = $eHTML.ToString("D8")
$p3 = $sFrag.ToString("D8")
$p4 = $eFrag.ToString("D8")

$header = @"
Version:0.9
StartHTML:$p1
EndHTML:$p2
StartFragment:$p3
EndFragment:$p4
<html><body>
<!--StartFragment-->
"@

$fullHtmlClipboard = $header + $html + $suffix

$dataObj = New-Object System.Windows.Forms.DataObject
$dataObj.SetData([System.Windows.Forms.DataFormats]::Html, $fullHtmlClipboard)
$plainText = @"
Hi Varaprasad Sir and Vineetha Mam,

Good Evening,

Please find below the task summary for today:
Technology: Web Development
Planned Tasks (Today): Day 1 React Fundamentals & JSX
Pending Tasks (Today): Bala Krishna Parimi, Girish C, Jayakrishna Madicharla (React Profile Page mini assignment)
Planned Tasks (Next Day): Day 2 Props, State & Component Communication
Challenges / Blockers: N/A
"@
$dataObj.SetData([System.Windows.Forms.DataFormats]::UnicodeText, $plainText)
[System.Windows.Forms.Clipboard]::SetDataObject($dataObj, $true)
Write-Host "CF_HTML Clipboard populated successfully!"
