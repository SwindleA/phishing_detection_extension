
```mermaid
sequenceDiagram
    User->>+Extension: Opens email
    Extension->>+Server: Send email contents

    Server->>+AI: Send email contents
    AI-->>-Server: Phishing or not phishing
    Server-->>-Extension: Phishing or not phishing
    Extension-->>-User: Display phishing or not phishing

```
