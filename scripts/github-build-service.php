<?php

/**
 * IntoGolfCentral GitHub Build Service
 *
 * Service class voor het triggeren van builds via GitHub Actions
 * Integreert met de bestaande IntoGolfCentral infrastructuur
 */

class GitHubBuildService
{
    private $token;
    private $repo;
    private $owner;

    public function __construct($token, $owner = 'intogolf', $repo = 'IntoGolfV3_Golfer')
    {
        $this->token = $token;
        $this->owner = $owner;
        $this->repo = $repo;
    }

    /**
     * Trigger een build via GitHub Actions Repository Dispatch
     *
     * @param string $tenant De tenant om te builden (engelenburg, dev, etc.)
     * @param string $platform Platform: android, ios, of both
     * @param string $version Version number (optioneel)
     * @param string $callbackUrl URL voor build completion callback
     * @return array Response van GitHub API
     */
    public function triggerBuild($tenant, $platform = 'both', $version = null, $callbackUrl = null)
    {
        $endpoint = "https://api.github.com/repos/{$this->owner}/{$this->repo}/dispatches";

        $payload = [
            'event_type' => 'build-app',
            'client_payload' => [
                'tenant' => $tenant,
                'platform' => $platform,
                'version' => $version,
                'callback_url' => $callbackUrl ?: config('app.url') . '/api/builds/complete',
                'triggered_by' => 'intogolfcentral',
                'timestamp' => now()->toISOString()
            ]
        ];

        $response = $this->makeGitHubRequest($endpoint, 'POST', $payload);

        if ($response['status'] === 204) {
            \Log::info("GitHub build triggered", [
                'tenant' => $tenant,
                'platform' => $platform,
                'payload' => $payload
            ]);

            return [
                'success' => true,
                'message' => "Build triggered for {$tenant} ({$platform})",
                'github_response' => $response
            ];
        }

        \Log::error("GitHub build trigger failed", [
            'tenant' => $tenant,
            'platform' => $platform,
            'response' => $response
        ]);

        return [
            'success' => false,
            'message' => 'Failed to trigger build',
            'error' => $response['body'] ?? 'Unknown error'
        ];
    }

    /**
     * Haal build status op via GitHub Actions API
     *
     * @param int $runId GitHub Actions run ID
     * @return array Build status informatie
     */
    public function getBuildStatus($runId)
    {
        $endpoint = "https://api.github.com/repos/{$this->owner}/{$this->repo}/actions/runs/{$runId}";

        $response = $this->makeGitHubRequest($endpoint, 'GET');

        if ($response['status'] === 200) {
            $data = json_decode($response['body'], true);

            return [
                'success' => true,
                'status' => $data['status'],
                'conclusion' => $data['conclusion'],
                'created_at' => $data['created_at'],
                'updated_at' => $data['updated_at'],
                'html_url' => $data['html_url']
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to get build status'
        ];
    }

    /**
     * Haal alle builds op voor een tenant
     *
     * @param string $tenant
     * @param int $limit
     * @return array
     */
    public function getTenantBuilds($tenant, $limit = 10)
    {
        $endpoint = "https://api.github.com/repos/{$this->owner}/{$this->repo}/actions/runs";

        $params = [
            'event' => 'repository_dispatch',
            'per_page' => $limit
        ];

        $url = $endpoint . '?' . http_build_query($params);
        $response = $this->makeGitHubRequest($url, 'GET');

        if ($response['status'] === 200) {
            $data = json_decode($response['body'], true);
            $builds = [];

            foreach ($data['workflow_runs'] as $run) {
                // Filter builds voor deze tenant (payload info is niet altijd beschikbaar)
                // We kunnen dit verbeteren door workflow names te gebruiken
                if (strpos($run['display_title'], $tenant) !== false) {
                    $builds[] = [
                        'id' => $run['id'],
                        'status' => $run['status'],
                        'conclusion' => $run['conclusion'],
                        'created_at' => $run['created_at'],
                        'updated_at' => $run['updated_at'],
                        'html_url' => $run['html_url'],
                        'head_sha' => $run['head_sha']
                    ];
                }
            }

            return [
                'success' => true,
                'builds' => $builds
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to get builds'
        ];
    }

    /**
     * Download build artifacts
     *
     * @param int $runId
     * @param string $artifactName
     * @return array
     */
    public function downloadArtifact($runId, $artifactName)
    {
        // Eerst artifacts voor deze run ophalen
        $endpoint = "https://api.github.com/repos/{$this->owner}/{$this->repo}/actions/runs/{$runId}/artifacts";
        $response = $this->makeGitHubRequest($endpoint, 'GET');

        if ($response['status'] !== 200) {
            return [
                'success' => false,
                'message' => 'Failed to get artifacts list'
            ];
        }

        $data = json_decode($response['body'], true);
        $artifact = null;

        foreach ($data['artifacts'] as $art) {
            if ($art['name'] === $artifactName) {
                $artifact = $art;
                break;
            }
        }

        if (!$artifact) {
            return [
                'success' => false,
                'message' => "Artifact {$artifactName} not found"
            ];
        }

        // Download artifact
        $downloadEndpoint = "https://api.github.com/repos/{$this->owner}/{$this->repo}/actions/artifacts/{$artifact['id']}/zip";
        $downloadResponse = $this->makeGitHubRequest($downloadEndpoint, 'GET');

        if ($downloadResponse['status'] === 200) {
            return [
                'success' => true,
                'data' => $downloadResponse['body'],
                'size' => $artifact['size_in_bytes'],
                'filename' => $artifactName . '.zip'
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to download artifact'
        ];
    }

    /**
     * Maak GitHub API request
     *
     * @param string $url
     * @param string $method
     * @param array $data
     * @return array
     */
    private function makeGitHubRequest($url, $method = 'GET', $data = null)
    {
        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => [
                'Authorization: token ' . $this->token,
                'Accept: application/vnd.github.v3+json',
                'User-Agent: IntoGolfCentral'
            ]
        ]);

        if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge(
                curl_getinfo($ch, CURLINFO_HEADER_OUT) ?: [],
                ['Content-Type: application/json']
            ));
        }

        $body = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);

        curl_close($ch);

        if ($error) {
            \Log::error("GitHub API cURL error", ['error' => $error, 'url' => $url]);
        }

        return [
            'status' => $status,
            'body' => $body,
            'error' => $error
        ];
    }
}

/**
 * Usage Examples:
 *
 * // Trigger een build
 * $github = new GitHubBuildService(config('services.github.token'));
 * $result = $github->triggerBuild('engelenburg', 'android');
 *
 * // Check build status
 * $status = $github->getBuildStatus(123456789);
 *
 * // Download artifacts
 * $artifact = $github->downloadArtifact(123456789, 'android-engelenburg');
 */