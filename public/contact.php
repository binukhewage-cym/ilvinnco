<?php
// Receives the contact form and emails it to the restaurant through Resend.
// Secrets live in ilvincino-config.php, kept OUTSIDE the public web folder.

declare(strict_types=1);

ini_set("display_errors", "0");

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'Metoden är inte tillåten.']);
}

// Load config: env override, then one folder above the web root, then next to this file.
$candidates = array_filter([
    getenv('ILVINCINO_CONFIG') ?: null,
    dirname(__DIR__) . '/ilvincino-config.php',
    __DIR__ . '/ilvincino-config.php',
]);
$config = null;
foreach ($candidates as $path) {
    if (is_file($path)) {
        $config = require $path;
        break;
    }
}
if (!is_array($config) || empty($config['api_key']) || empty($config['to']) || empty($config['from'])) {
    error_log('contact.php: missing or incomplete ilvincino-config.php');
    respond(500, ['ok' => false, 'error' => 'Formuläret är inte konfigurerat. Ring eller mejla oss istället.']);
}

// Same-site requests only.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $allowed = array_merge([$_SERVER['HTTP_HOST'] ?? ''], $config['allowed_hosts'] ?? []);
    $allowed = array_map(static fn ($h) => strtolower(preg_replace('/:\d+$/', '', (string) $h)), $allowed);
    if (!$originHost || !in_array(strtolower($originHost), $allowed, true)) {
        respond(403, ['ok' => false, 'error' => 'Förfrågan nekades.']);
    }
}

// Bot traps: filled honeypot, or submitted within 3 seconds of page load. Pretend success.
$elapsed = (int) ($_POST['elapsed'] ?? 0);
if (trim((string) ($_POST['website'] ?? '')) !== '' || $elapsed < 3000) {
    respond(200, ['ok' => true]);
}

// Rate limit: 5 submissions per 10 minutes per visitor address.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$bucket = sys_get_temp_dir() . '/ilvincino_rl_' . md5($ip) . '.json';
$fh = @fopen($bucket, 'c+');
if ($fh && flock($fh, LOCK_EX)) {
    $times = json_decode((string) stream_get_contents($fh), true);
    $times = array_values(array_filter(is_array($times) ? $times : [], static fn ($t) => $t > time() - 600));
    if (count($times) >= 5) {
        flock($fh, LOCK_UN);
        fclose($fh);
        respond(429, ['ok' => false, 'error' => 'För många försök. Vänta en stund och försök igen.']);
    }
    $times[] = time();
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($times));
    flock($fh, LOCK_UN);
}
if ($fh) {
    fclose($fh);
}

// Validate input.
$clean = static fn (string $v): string => trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $v));
$name = $clean((string) ($_POST['name'] ?? ''));
$email = $clean((string) ($_POST['email'] ?? ''));
$phone = $clean((string) ($_POST['phone'] ?? ''));
$message = $clean((string) ($_POST['message'] ?? ''));

if ($name === '' || mb_strlen($name) > 100) {
    respond(422, ['ok' => false, 'error' => 'Ange ditt namn.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 200) {
    respond(422, ['ok' => false, 'error' => 'Ange en giltig e-postadress.']);
}
if (mb_strlen($phone) > 40) {
    respond(422, ['ok' => false, 'error' => 'Telefonnumret är för långt.']);
}
if (mb_strlen($message) < 5 || mb_strlen($message) > 4000) {
    respond(422, ['ok' => false, 'error' => 'Skriv ett meddelande (minst 5 tecken).']);
}

// Build and send via Resend.
$subjectName = preg_replace('/[\r\n]+/', ' ', $name);
$text = "Namn: $name\nE-post: $email\nTelefon: " . ($phone !== '' ? $phone : '-') . "\n\n$message";
$e = static fn (string $v): string => htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$html = '<p><strong>Namn:</strong> ' . $e($name) . '<br><strong>E-post:</strong> ' . $e($email)
    . '<br><strong>Telefon:</strong> ' . ($phone !== '' ? $e($phone) : '-') . '</p><p>'
    . nl2br($e($message)) . '</p>';

$payload = json_encode([
    'from' => $config['from'],
    'to' => (array) $config['to'],
    'reply_to' => $email,
    'subject' => 'Ny förfrågan från ' . $subjectName,
    'text' => $text,
    'html' => $html,
], JSON_UNESCAPED_UNICODE);

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $config['api_key'],
        'Content-Type: application/json',
    ],
]);
$response = curl_exec($ch);
$code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);

if ($response === false || $code < 200 || $code >= 300) {
    error_log('contact.php: Resend failed (HTTP ' . $code . '): ' . substr((string) $response, 0, 300));
    respond(502, ['ok' => false, 'error' => 'Kunde inte skicka meddelandet. Försök igen eller ring oss.']);
}

respond(200, ['ok' => true]);
