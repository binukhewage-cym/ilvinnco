<?php
// Copy to ilvincino-config.php and upload it ONE FOLDER ABOVE public_html
// (never inside the public web folder). Never commit the real file.
return [
    'api_key' => 're_xxxxxxxxxxxxxxxxxxxxxxxx',          // Resend API key (sending access)
    'from' => 'IL VICINO <noreply@forms.cyoumedia.com>', // address on a domain verified in Resend
    'to' => ['info@ilvicino.se'],                        // who receives enquiries
    // 'allowed_hosts' => ['ilvicino.se', 'www.ilvicino.se'], // optional extra hosts
];
