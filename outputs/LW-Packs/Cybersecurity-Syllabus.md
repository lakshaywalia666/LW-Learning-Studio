# Cybersecurity & Hacking · Beginner to Research

Prepared **6 November 2026**. 100 sections; 500 lesson topics; 100 section-project topics; 1,600 tasks. This is a broad-to-deep expert-track roadmap. The named deeper-study checklists extend each concise lesson into reading and independent investigation; they are not claims that every term is a full textbook chapter.

Original explanations, practical prompts and self-checks are inside the .lw file. Third-party references remain their publishers' work. Read the start guide and in-app course guide for scope, pacing and setup. No finite list exhausts present and future cybersecurity knowledge.

## Section index

- 01. Start safely and think like a security professional — Foundation
- 02. Computers, operating systems and data — Foundation
- 03. Networking from first principles — Foundation
- 04. Network services and packet analysis — Foundation
- 05. Linux administration and hardening — Foundation
- 06. Windows administration and PowerShell — Foundation
- 07. Python, shell and security automation — Foundation
- 08. Developer tools and secure coding foundations — Foundation
- 09. Web application and database foundations — Core
- 10. Cryptography and mathematical foundations — Core
- 11. TLS, PKI and cryptographic operations — Core
- 12. Identity, authentication and authorization — Core
- 13. Active Directory administration and security — Core
- 14. Enterprise identity attack paths and defenses — Advanced
- 15. Security architecture and threat modeling — Core
- 16. Network defense, email and edge security — Core
- 17. Vulnerability and exposure management — Core
- 18. Authorized testing, reconnaissance and OSINT — Core
- 19. Web security: access, input and browsers — Advanced
- 20. Web security: server behavior and complex flaws — Advanced
- 21. API and business-logic security — Advanced
- 22. Application security and the secure development lifecycle — Advanced
- 23. Database, data pipeline and storage security — Advanced
- 24. AWS security engineering — Advanced
- 25. Azure and Microsoft cloud security — Advanced
- 26. Google Cloud and cross-cloud security — Advanced
- 27. Containers and Kubernetes security — Advanced
- 28. DevSecOps and software supply-chain security — Advanced
- 29. SOC operations and security telemetry — Core
- 30. Detection engineering and security analytics — Advanced
- 31. Threat intelligence and threat hunting — Advanced
- 32. Incident response and crisis coordination — Advanced
- 33. Digital forensics and evidence handling — Advanced
- 34. Malware behavior, taxonomy and analysis — Advanced
- 35. Reverse engineering and program understanding — Specialist
- 36. Binary security, fuzzing and exploit principles — Specialist
- 37. Red-team planning and purple-team validation — Advanced
- 38. Wireless, RF and short-range security — Advanced
- 39. Android, iOS and mobile application security — Advanced
- 40. Hardware, firmware and IoT security — Specialist
- 41. Operational technology and critical infrastructure — Specialist
- 42. AI, machine-learning and agent security — Advanced
- 43. Governance, risk, privacy and audit — Advanced
- 44. Resilience, architecture operations and leadership — Advanced
- 45. Human, physical and fraud security — Advanced
- 46. Blockchain, smart contracts and financial systems — Specialist
- 47. Advanced cryptography and high-assurance methods — Specialist
- 48. Sector and emerging-system security — Specialist
- 49. Research, professional communication and career depth — Specialist
- 50. Integrated capstones and continuous mastery — Specialist
- 51. Computer architecture and operating-system research — Research
- 52. Linux kernel, eBPF and runtime assurance — Research
- 53. Windows internals and endpoint trust — Research
- 54. macOS internals and Apple enterprise security — Research
- 55. Advanced networking, IPv6 and traffic semantics — Specialist
- 56. Internet routing, DNS, email and PKI operations — Specialist
- 57. Advanced directory, AD CS and identity attack graphs — Research
- 58. Federation, SaaS and multi-organization identity — Research
- 59. Adversary emulation, C2 analysis and evasion concepts — Research
- 60. Browser engines, extensions and client-side research — Research
- 61. Advanced web parsers, deserialization and business logic — Research
- 62. Desktop software, native apps and product security — Research
- 63. Database engines, NoSQL and analytic platforms — Specialist
- 64. AWS control-plane and workload identity research — Research
- 65. Entra and Azure control-plane research — Research
- 66. Google Cloud control-plane research — Research
- 67. Kubernetes multi-tenancy and platform assurance — Research
- 68. Build systems, compilers and source-to-binary trust — Research
- 69. Security data engineering, SOAR and automation safety — Specialist
- 70. Adversarial analytics and detection research — Research
- 71. Advanced Windows and enterprise forensics — Research
- 72. Cloud, SaaS and distributed forensics — Research
- 73. Advanced malware deconstruction and defensive research — Research
- 74. Memory exploitation models and modern mitigations — Research
- 75. Browser and mobile vulnerability research — Research
- 76. Kernel, driver and hypervisor security research — Research
- 77. Advanced fuzzing and program analysis — Research
- 78. Cryptanalysis and security-protocol verification — Research
- 79. Hardware, physical fault and side-channel research — Research
- 80. Telecom, RF and network-protocol research — Research
- 81. Advanced ICS and cyber-physical assurance — Research
- 82. Firmware and embedded product research — Research
- 83. AI model attacks and adversarial evaluation — Research
- 84. Agentic systems, MCP and tool-protocol security — Research
- 85. Privacy engineering and privacy-enhancing research — Research
- 86. Distributed ledgers and financial protocol research — Research
- 87. Fraud, abuse and adversarial business systems — Specialist
- 88. Mainframes, ERP and legacy enterprise security — Specialist
- 89. Sector-specific research and assurance programmes — Research
- 90. Strategic defense and cross-organization crisis research — Research
- 91. Advanced privacy, law and jurisdiction research — Specialist
- 92. Advanced security architecture and formal system design — Research
- 93. Security assurance, standards and evaluation research — Research
- 94. PSIRT, vulnerability coordination and product stewardship — Specialist
- 95. Open-source vulnerability research and ecosystem analysis — Research
- 96. Advanced intelligence, attribution and analytic tradecraft — Research
- 97. Secure tool building and research infrastructure — Research
- 98. Original research and scientific security practice — Research
- 99. Teaching, mentoring and leading expert security work — Specialist
- 100. Independent expert portfolio and original research defense — Research

## 01 · Start safely and think like a security professional

Level: Foundation.

1. **Permission, scope and rules of engagement** — Written authorization, target ownership, stop conditions.
2. **Assets, threats, vulnerabilities and risk** — Asset valuation, threat actors, risk scenarios.
3. **Confidentiality, integrity and availability** — CIA triad, safety, authenticity.
4. **Evidence and deliberate practice** — Hypotheses, reproducibility, limitations.
5. **Personal security and recovery habits** — Password managers, updates, phishing resistance, recovery codes.
6. **Section project**

**Project:** Create a personal lab charter, an asset list and a repeatable evidence notebook. Show one successful backup and recovery.

**References:** [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [NICE Framework Resource Center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center)

## 02 · Computers, operating systems and data

Level: Foundation.

1. **CPU, memory and storage** — CPU instruction cycle, RAM, persistent storage.
2. **Processes, threads and privilege** — Process isolation, threads, privilege rings.
3. **Files, paths and permissions** — Absolute paths, ACLs, symbolic links.
4. **Binary, hexadecimal and encodings** — Bits, bytes, endianness, Unicode, Base64.
5. **Virtualization and trust boundaries** — Virtual machines, hypervisors, snapshots, shared folders.
6. **Section project**

**Project:** Build a diagram showing a request moving through CPU, memory, storage, processes and user permissions on a test machine.

**References:** [Ubuntu Server security documentation](https://ubuntu.com/server/docs/explanation/security/) · [Windows security documentation](https://learn.microsoft.com/en-us/windows/security/)

## 03 · Networking from first principles

Level: Foundation.

1. **Layers, frames and packets** — OSI and TCP/IP models, Ethernet, MTU.
2. **IPv4, IPv6 and subnetting** — CIDR, subnet masks, IPv6 scopes.
3. **TCP, UDP and connection state** — TCP handshake, retransmission, UDP, QUIC.
4. **Routing, switching, NAT and segmentation** — Routing tables, VLANs, NAT, ACLs.
5. **Network troubleshooting and baselines** — Latency, loss, name resolution, known-good baselines.
6. **Section project**

**Project:** Document a two-VM private network, including addressing, routes, allowed traffic and a successful connection test.

**References:** [Wireshark User Guide](https://www.wireshark.org/docs/wsug_html_chunked/) · [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

## 04 · Network services and packet analysis

Level: Foundation.

1. **DNS resolution and trust** — Recursive and authoritative DNS, caching, DNSSEC.
2. **DHCP, ARP and neighbor discovery** — DHCP leases, ARP, IPv6 ND.
3. **HTTP, HTTPS and browser trust** — HTTP methods, status codes, TLS, HTTP/2, HTTP/3.
4. **Email, remote access and file services** — SMTP, IMAP, SSH, RDP, SMB, NFS.
5. **Capture filters, display filters and evidence** — PCAP provenance, display filters, streams, timestamps.
6. **Section project**

**Project:** Produce an annotated packet investigation of your own local web request, including DNS, transport and encryption boundaries.

**References:** [Wireshark User Guide](https://www.wireshark.org/docs/wsug_html_chunked/) · [Web security documentation](https://developer.mozilla.org/en-US/docs/Web/Security)

## 05 · Linux administration and hardening

Level: Foundation.

1. **Linux navigation and documentation** — Shell navigation, manual pages, filesystem hierarchy.
2. **Users, groups, sudo and access** — UIDs, GIDs, sudoers, POSIX permissions, ACLs.
3. **Processes, services and scheduled work** — Systemd, cron, signals, open files.
4. **Updates, packages and secure configuration** — Package trust, update policy, minimal services.
5. **Linux logging and containment controls** — Journald, auditd, AppArmor, SELinux.
6. **Section project**

**Project:** Harden a disposable Linux VM, record a before/after service and permission baseline, and demonstrate rollback.

**References:** [Ubuntu Server security documentation](https://ubuntu.com/server/docs/explanation/security/) · [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

## 06 · Windows administration and PowerShell

Level: Foundation.

1. **Windows objects and access control** — SIDs, access tokens, DACLs, UAC.
2. **PowerShell objects and safe automation** — Pipelines, objects, remoting boundaries, constrained automation.
3. **Windows processes, services and persistence surfaces** — Services, scheduled tasks, startup entries.
4. **Windows event logs and endpoint protection** — Event channels, Defender, EDR coverage.
5. **Updates, encryption and recovery** — Patch rings, BitLocker, recovery material.
6. **Section project**

**Project:** Build a Windows security baseline covering accounts, services, update state, firewall rules and event collection.

**References:** [Windows security documentation](https://learn.microsoft.com/en-us/windows/security/) · [Best practices for securing Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory)

## 07 · Python, shell and security automation

Level: Foundation.

1. **Programming logic and data types** — Variables, loops, functions, types, debugging.
2. **Files, JSON, CSV and timestamps** — Structured parsing, encodings, time zones.
3. **Regular expressions and validation** — Regex limits, allowlists, schema validation.
4. **APIs, retries and secret handling** — HTTP clients, pagination, timeouts, secret stores.
5. **Testing, packaging and reviewable scripts** — Unit tests, fixtures, virtual environments, dependency pinning.
6. **Section project**

**Project:** Create a tested local log-analysis utility that reads synthetic events, rejects malformed records and writes a clear summary.

**References:** [The Python Tutorial](https://docs.python.org/3/tutorial/) · [Git Tutorial](https://git-scm.com/docs/gittutorial)

## 08 · Developer tools and secure coding foundations

Level: Foundation.

1. **Git history, branches and review** — Commits, diffs, branches, merge review.
2. **Input handling and output context** — Canonicalization, parameterization, contextual encoding.
3. **Errors, exceptions and resource limits** — Exceptions, fail-closed design, quotas.
4. **Memory-safe design and language tradeoffs** — C, C++, Rust, Go, Java, JavaScript, memory ownership.
5. **Dependency hygiene and reproducible work** — Lockfiles, dependencies, reproducible setup, code review.
6. **Section project**

**Project:** Publish a local-only repository with a tiny secure service, tests, a threat note and a reproducible build procedure.

**References:** [Git Tutorial](https://git-scm.com/docs/gittutorial) · [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) · [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

## 09 · Web application and database foundations

Level: Core.

1. **Browsers, servers and trust boundaries** — HTML, CSS, JavaScript, DOM, request lifecycle.
2. **Origins, cookies and browser storage** — Same-origin policy, cookies, local storage.
3. **Sessions and authenticated requests** — Session identifiers, expiry, logout, recovery.
4. **Relational data, queries and transactions** — SQL, joins, indexes, transactions, isolation.
5. **Architecture styles and asynchronous work** — Monoliths, microservices, queues, serverless.
6. **Section project**

**Project:** Build or diagram a local app with two roles, sessions, a database and explicit authorization on every protected operation.

**References:** [Web security documentation](https://developer.mozilla.org/en-US/docs/Web/Security) · [OWASP API Security Project](https://owasp.org/projects/api-security-project) · [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

## 10 · Cryptography and mathematical foundations

Level: Core.

1. **Probability, entropy and attacker assumptions** — Probability, entropy, combinatorics, threat assumptions.
2. **Hashes, checksums and message authentication** — SHA families, collision resistance, HMAC.
3. **Symmetric encryption and authenticated encryption** — AES, ChaCha20, AEAD, nonce management.
4. **Public-key cryptography and signatures** — RSA, elliptic curves, signatures, key agreement.
5. **Password hashing and key derivation** — Argon2, scrypt, PBKDF2, salts, offline audit assumptions.
6. **Section project**

**Project:** Create an annotated cryptographic design for a document-sharing application, explaining which guarantees each primitive supplies.

**References:** [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines) · [Post-Quantum Cryptography](https://csrc.nist.gov/projects/post-quantum-cryptography) · [NIST Digital Identity Guidelines, SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final) · [Hashcat documentation](https://hashcat.net/wiki/) · [John the Ripper documentation](https://www.openwall.com/john/doc/)

## 11 · TLS, PKI and cryptographic operations

Level: Core.

1. **TLS handshakes and certificate validation** — TLS 1.3, transcript binding, hostname validation.
2. **Certificate authorities and trust stores** — X.509, chain building, trust anchors.
3. **Key storage, rotation and revocation** — KMS, HSM, rotation, revocation, backup.
4. **Secrets in services and build systems** — Vaults, workload identities, secret exposure response.
5. **Cryptographic failures and migration** — Algorithm inventory, downgrade risks, crypto agility.
6. **Section project**

**Project:** Design a certificate and key lifecycle with issuance, storage, rotation, revocation and a rehearsed compromise response.

**References:** [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines) · [NIST Digital Identity Guidelines, SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final) · [Post-Quantum Cryptography](https://csrc.nist.gov/projects/post-quantum-cryptography) · [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)

## 12 · Identity, authentication and authorization

Level: Core.

1. **Identity proofing and account lifecycle** — Identity assurance, joiner-mover-leaver, service accounts.
2. **Passwords, MFA and passkeys** — FIDO2, WebAuthn, passkeys, MFA recovery.
3. **RBAC, ABAC and object authorization** — RBAC, ABAC, ReBAC, negative authorization tests.
4. **OAuth, OpenID Connect and federation** — OAuth, OIDC, issuer, audience, state, nonce, PKCE.
5. **Privileged access and zero trust** — PAM, JIT access, break-glass, resource-focused access.
6. **Section project**

**Project:** Implement or model a two-role identity system with strong authentication, authorization tests and secure account recovery.

**References:** [NIST Digital Identity Guidelines, SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final) · [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) · [Passkeys](https://fidoalliance.org/passkeys/) · [RFC 9700: OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html) · [OpenID Foundation specifications](https://openid.net/developers/specs/)

## 13 · Active Directory administration and security

Level: Core.

1. **Directory structure and domain trust** — Forests, domains, OUs, trusts, directory replication.
2. **Kerberos, tickets and service identities** — KDC, TGT, service tickets, SPNs.
3. **NTLM, legacy protocols and migration** — NTLM dependencies, signing, channel binding.
4. **Group Policy, delegation and administrative tiers** — GPO control, delegation, administrative separation.
5. **Directory auditing, backups and recovery** — Directory logs, protected backups, forest recovery.
6. **Section project**

**Project:** Build an isolated directory diagram or disposable lab with accounts, groups, policies, audit requirements and a recovery plan.

**References:** [Best practices for securing Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory) · [Windows security documentation](https://learn.microsoft.com/en-us/windows/security/) · [NIST Digital Identity Guidelines, SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final)

## 14 · Enterprise identity attack paths and defenses

Level: Advanced.

1. **Credential theft and token abuse** — LSASS and DPAPI exposure concepts, cookies, refresh tokens.
2. **Kerberos attack classes and telemetry** — Kerberoasting, AS-REP roasting, ticket forgery classes.
3. **Lateral movement and privilege paths** — Pass-the-hash, pass-the-ticket, remote administration paths.
4. **Identity exposure in hybrid environments** — Synchronization, federation, device-management authority.
5. **Purple-team identity validation** — Synthetic identity events, benign control tests, retest evidence.
6. **Section project**

**Project:** Analyze a synthetic identity attack graph, remove three high-risk paths and show the detection evidence that would confirm remediation.

**References:** [Best practices for securing Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory) · [MITRE ATT&CK](https://attack.mitre.org/) · [MITRE D3FEND](https://d3fend.mitre.org/) · [BloodHound documentation](https://bloodhound.specterops.io/home) · [Impacket project documentation](https://github.com/fortra/impacket)

## 15 · Security architecture and threat modeling

Level: Core.

1. **Data flows and trust boundaries** — Data-flow diagrams, entry points, trust boundaries.
2. **STRIDE, abuse cases and privacy threats** — STRIDE, misuse cases, privacy harms.
3. **Design principles and compensating controls** — Least privilege, complete mediation, fail-safe defaults.
4. **Multi-tenancy and shared responsibility** — Tenant isolation, management planes, provider responsibilities.
5. **Security design reviews and decisions** — Architecture decisions, risk owners, review triggers.
6. **Section project**

**Project:** Threat-model a document-sharing service, prioritize abuse cases and produce a control design with explicit assumptions and tests.

**References:** [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) · [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [OWASP Threat Dragon](https://owasp.org/projects/threat-dragon)

## 16 · Network defense, email and edge security

Level: Core.

1. **Firewall policy and network access** — Stateful firewalls, allowlists, NAC, management isolation.
2. **IDS, IPS, NDR and encrypted visibility** — IDS, IPS, EDR, NDR, encrypted-traffic limits.
3. **DNS, web gateways and egress policy** — DNS filtering, proxies, egress policy, WAF limits.
4. **Email authentication and phishing resilience** — SPF, DKIM, DMARC, mailbox rules.
5. **Remote access, VPNs and service exposure** — VPNs, ZTNA, bastions, exposed-service inventory.
6. **Section project**

**Project:** Design and validate a segmented office network with protected administration, DNS/email defenses and clear monitoring responsibilities.

**References:** [MITRE D3FEND](https://d3fend.mitre.org/) · [Wireshark User Guide](https://www.wireshark.org/docs/wsug_html_chunked/) · [Windows security documentation](https://learn.microsoft.com/en-us/windows/security/)

## 17 · Vulnerability and exposure management

Level: Core.

1. **Asset inventory and attack surface** — CMDB, external attack surface, ownership, discovery.
2. **Scanning, validation and false positives** — Authenticated scanning, validation, false positives.
3. **CVSS, EPSS and exploitation evidence** — CVSS 4, EPSS, KEV, exposure context.
4. **Patching, exceptions and compensating controls** — Patch testing, exceptions, compensating controls.
5. **Retesting and meaningful metrics** — Retest windows, coverage, remediation age.
6. **Section project**

**Project:** Create a vulnerability register with asset context, validated evidence, prioritized remediation, exceptions and retest results.

**References:** [CVSS v4.0 specification](https://www.first.org/cvss/v4.0/specification-document) · [Exploit Prediction Scoring System](https://www.first.org/epss/) · [Known Exploited Vulnerabilities data mirror](https://github.com/cisagov/kev-data)

## 18 · Authorized testing, reconnaissance and OSINT

Level: Core.

1. **Scoping a penetration test** — Rules of engagement, authorization, third-party limits.
2. **Passive reconnaissance and source evaluation** — Source provenance, passive DNS concepts, public metadata.
3. **Service discovery in a private lab** — Nmap assumptions, service banners, version uncertainty.
4. **Manual testing and evidence quality** — Manual verification, false positives, minimum evidence.
5. **Disclosure, reporting and retest** — Finding structure, disclosure channels, remediation checks.
6. **Section project**

**Project:** Write an authorized assessment plan and a sanitized findings report for an intentionally vulnerable training application.

**References:** [OWASP Web Security Testing Guide](https://owasp.org/projects/web-security-testing-guide) · [PortSwigger Web Security Academy](https://portswigger.net/web-security) · [NICE Framework Resource Center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center) · [Nmap reference guide](https://nmap.org/book/man.html) · [Metasploit Framework documentation](https://docs.metasploit.com/) · [Kali Linux documentation](https://www.kali.org/docs/)

## 19 · Web security: access, input and browsers

Level: Advanced.

1. **Broken access control and IDOR** — BOLA and IDOR, role boundaries, tenant boundaries.
2. **SQL, command and template injection** — SQL injection, command injection, SSTI concepts.
3. **XSS, DOM safety and content security policy** — Reflected, stored and DOM XSS, CSP, Trusted Types.
4. **CSRF, same-site policy and CORS** — CSRF tokens, SameSite, CORS, origin checks.
5. **Session weaknesses and authentication failures** — Session fixation, token expiry, recovery abuse.
6. **Section project**

**Project:** Assess a local training app for access control, injection and browser risks; implement or explain fixes and negative regression tests.

**References:** [OWASP Top 10:2025](https://top10.owasp.org/2025/) · [OWASP Web Security Testing Guide](https://owasp.org/projects/web-security-testing-guide) · [PortSwigger Web Security Academy](https://portswigger.net/web-security) · [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) · [OWASP Juice Shop](https://owasp.org/projects/juice-shop) · [ZAP documentation](https://www.zaproxy.org/docs/) · [sqlmap documentation](https://github.com/sqlmapproject/sqlmap/wiki)

## 20 · Web security: server behavior and complex flaws

Level: Advanced.

1. **SSRF and outbound request controls** — SSRF, URL parsing, redirects, cloud metadata boundaries.
2. **Uploads, traversal and unsafe deserialization** — Path traversal, uploads, archive handling, object deserialization.
3. **Request smuggling and parser disagreement** — HTTP request smuggling, desynchronization, parser disagreement.
4. **Caches, race conditions and workflow integrity** — Cache poisoning, cache deception, TOCTOU, race conditions.
5. **Misconfiguration and exceptional conditions** — Default credentials, debug features, error paths, unsafe fallbacks.
6. **Section project**

**Project:** Build a server-side web review covering parser boundaries, uploads, error paths, cache behavior and workflow invariants.

**References:** [OWASP Top 10:2025](https://top10.owasp.org/2025/) · [OWASP Web Security Testing Guide](https://owasp.org/projects/web-security-testing-guide) · [PortSwigger Web Security Academy](https://portswigger.net/web-security) · [OWASP Application Security Verification Standard](https://asvs.owasp.org/)

## 21 · API and business-logic security

Level: Advanced.

1. **Object, property and function authorization** — BOLA, BOPLA, BFLA, mass assignment.
2. **REST, GraphQL, gRPC and schema boundaries** — REST, GraphQL introspection, gRPC, protobuf.
3. **Rate limits and resource consumption** — Rate limits, quotas, pagination, amplification.
4. **Business logic, payments and idempotency** — Price integrity, workflow abuse, refunds, idempotency.
5. **Webhooks, third-party APIs and inventory** — Webhook signatures, replay, API inventory, partner trust.
6. **Section project**

**Project:** Build an API authorization and abuse-case matrix, verify it on a local mock and write regression tests for its important invariants.

**References:** [OWASP API Security Project](https://owasp.org/projects/api-security-project) · [OWASP Application Security Verification Standard](https://asvs.owasp.org/) · [PortSwigger Web Security Academy](https://portswigger.net/web-security)

## 22 · Application security and the secure development lifecycle

Level: Advanced.

1. **Security requirements and ASVS** — ASVS requirements, security acceptance criteria.
2. **Code review and security tests** — SAST, DAST, IAST concepts, code review, test design.
3. **Secure design of authentication and recovery** — Enrollment, login, logout, reset, abuse resistance.
4. **AppSec operations and developer collaboration** — Security champions, defect triage, paved roads.
5. **Release verification and vulnerability response** — Release gates, supported versions, PSIRT handoff.
6. **Section project**

**Project:** Create a secure-development plan for a small service with threat requirements, code review, automated checks and release acceptance evidence.

**References:** [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) · [OWASP Application Security Verification Standard](https://asvs.owasp.org/) · [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) · [CWE Top 25 and weakness taxonomy](https://cwe.mitre.org/top25/index.html)

## 23 · Database, data pipeline and storage security

Level: Advanced.

1. **Database identities and least privilege** — Database accounts, grants, stored procedures.
2. **Sensitive data and minimization** — Classification, minimization, tokenization.
3. **Backups, replicas and analytics copies** — Snapshots, replicas, exports, backup access.
4. **Queues, event streams and data integrity** — Kafka-style streams, queues, ordering, replay.
5. **Search, object stores and data exposure** — Object storage, search indexes, signed links, tenant isolation.
6. **Section project**

**Project:** Protect a synthetic data pipeline from collection to deletion, with tenant rules, least-privilege storage and a verified recovery drill.

**References:** [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) · [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) · [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)

## 24 · AWS security engineering

Level: Advanced.

1. **AWS accounts, organizations and responsibility** — Organizations, accounts, shared responsibility.
2. **IAM policies, roles and workload identity** — IAM policies, roles, STS, workload identity.
3. **VPCs, storage and encryption** — VPCs, security groups, S3, KMS.
4. **CloudTrail and cloud detection** — CloudTrail, Config, GuardDuty concepts.
5. **AWS incident readiness and safe operations** — Sandbox budgets, incident roles, resource cleanup.
6. **Section project**

**Project:** Create a paper or sandbox AWS security design with identity boundaries, private data, central audit logs, cost controls and incident recovery.

**References:** [AWS Well-Architected Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) · [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)

## 25 · Azure and Microsoft cloud security

Level: Advanced.

1. **Entra tenants, subscriptions and management** — Entra ID, tenants, subscriptions, management groups.
2. **Conditional access and privileged identity** — Conditional Access, PIM, emergency access.
3. **Managed identities, Key Vault and application access** — Managed identity, service principals, Key Vault.
4. **Azure networking, storage and policy** — NSGs, private endpoints, storage policy.
5. **Microsoft cloud logging and response** — Azure activity, identity logs, response ownership.
6. **Section project**

**Project:** Design an Azure/Entra security baseline with scoped administration, workload identities, protected logs and a tested recovery scenario.

**References:** [Microsoft cloud security benchmark](https://learn.microsoft.com/en-us/security/benchmark/azure/) · [NIST Digital Identity Guidelines, SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final) · [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)

## 26 · Google Cloud and cross-cloud security

Level: Advanced.

1. **Organizations, folders, projects and policies** — Organizations, projects, inherited policy.
2. **Service accounts and workload federation** — Service accounts, IAM conditions, workload federation.
3. **Cloud network and data boundaries** — VPC controls, storage roles, encryption.
4. **Audit logs, detection and response** — Audit logs, workload evidence, incident access.
5. **Cross-cloud identity and configuration drift** — Cross-cloud trust, inventory, drift, shared assumptions.
6. **Section project**

**Project:** Design a Google Cloud security baseline and compare its controls with AWS and Azure without assuming their permission models are identical.

**References:** [Google Cloud security best practices](https://cloud.google.com/security/best-practices) · [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)

## 27 · Containers and Kubernetes security

Level: Advanced.

1. **Images, registries and container boundaries** — OCI images, registries, image identity.
2. **Linux isolation and runtime privilege** — Namespaces, cgroups, seccomp, capabilities.
3. **Kubernetes RBAC and service accounts** — RBAC, service accounts, token scope.
4. **Pod policy, secrets and network policy** — Admission policy, secrets, network policy.
5. **Cluster operations and runtime detection** — Control-plane updates, audit logs, runtime signals.
6. **Section project**

**Project:** Threat-model a local containerized service and propose a Kubernetes deployment with constrained identity, networking, storage and runtime monitoring.

**References:** [Docker Engine security](https://docs.docker.com/engine/security/) · [Kubernetes security documentation](https://kubernetes.io/docs/concepts/security/) · [Supply-chain Levels for Software Artifacts](https://slsa.dev/)

## 28 · DevSecOps and software supply-chain security

Level: Advanced.

1. **CI/CD identities and untrusted contributions** — Runner trust, forked contributions, pipeline tokens.
2. **SBOMs, dependency integrity and maintenance** — SBOM, dependency confusion, typosquatting, ownership changes.
3. **Artifact signing and provenance** — Sigstore concepts, signing, SLSA provenance.
4. **Infrastructure as code and drift control** — Terraform-style plans, policy as code, drift.
5. **Supply-chain incident response** — Compromised dependencies, key revocation, clean rebuilds.
6. **Section project**

**Project:** Create a local build pipeline design with scoped identities, dependency review, provenance, artifact verification and a recovery exercise.

**References:** [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) · [Supply-chain Levels for Software Artifacts](https://slsa.dev/) · [Git Tutorial](https://git-scm.com/docs/gittutorial)

## 29 · SOC operations and security telemetry

Level: Core.

1. **Logs, events, alerts and cases** — Event versus alert, severity, case lifecycle.
2. **Collection, parsing and normalization** — Parsing, schemas, UTC normalization, provenance.
3. **Endpoint and identity telemetry** — Endpoint, authentication, process and administrative events.
4. **Network and cloud telemetry** — DNS, proxy, flow, cloud control-plane events.
5. **Triage, escalation and case quality** — Escalation criteria, hypotheses, analyst handoffs.
6. **Section project**

**Project:** Build a small synthetic security-monitoring pipeline with normalized events, alert triage notes and collection-health tests.

**References:** [MITRE ATT&CK](https://attack.mitre.org/) · [Windows security documentation](https://learn.microsoft.com/en-us/windows/security/) · [Zeek documentation](https://docs.zeek.org/en/current/)

## 30 · Detection engineering and security analytics

Level: Advanced.

1. **Detection hypotheses and threat mapping** — ATT&CK mapping, hypotheses, detection objectives.
2. **Sigma, query languages and portability** — Sigma, KQL, SPL, SQL, backend semantics.
3. **Network detections and protocol context** — Zeek, Suricata, protocol context.
4. **Statistics, baselines and anomaly limits** — Base rates, outliers, seasonality, confidence.
5. **Detection testing, tuning and lifecycle** — Positive fixtures, negative fixtures, tuning, ownership.
6. **Section project**

**Project:** Develop and validate a small detection pack using synthetic data, with expected results, benign counterexamples and documented collection dependencies.

**References:** [Sigma detection-format documentation](https://sigmahq.io/docs/) · [Suricata documentation](https://docs.suricata.io/en/latest/) · [MITRE ATT&CK](https://attack.mitre.org/)

## 31 · Threat intelligence and threat hunting

Level: Advanced.

1. **Intelligence requirements and source quality** — Priority intelligence requirements, source grading.
2. **Indicators, behaviors and context** — IOCs, TTPs, freshness, confidence.
3. **Hypothesis-driven hunting** — Hunt hypotheses, data requirements, stop criteria.
4. **Timeline and relationship analysis** — Timelines, graph links, alternative explanations.
5. **Hunt outcomes and operational improvement** — Negative findings, coverage gaps, detection improvements.
6. **Section project**

**Project:** Produce a sourced threat brief and a hypothesis-driven hunt report using synthetic endpoint, identity and network evidence.

**References:** [MITRE ATT&CK](https://attack.mitre.org/) · [MITRE D3FEND](https://d3fend.mitre.org/) · [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

## 32 · Incident response and crisis coordination

Level: Advanced.

1. **Preparation, authority and response roles** — Incident authority, playbooks, communication plans.
2. **Triage, scoping and evidence preservation** — Triage, scoping, evidence preservation.
3. **Containment, eradication and recovery** — Containment choices, credential invalidation, clean recovery.
4. **Ransomware, destructive events and extortion** — Ransomware, wipers, extortion, restore assurance.
5. **Communications, lessons learned and improvement** — Stakeholder briefs, lessons learned, action ownership.
6. **Section project**

**Project:** Run a fictional account-compromise and ransomware tabletop, preserving evidence and validating clean recovery without deploying harmful software.

**References:** [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) · [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [MITRE ATT&CK](https://attack.mitre.org/)

## 33 · Digital forensics and evidence handling

Level: Advanced.

1. **Evidence integrity and chain of custody** — Acquisition records, hashing, chain of custody.
2. **Disk images and filesystem artifacts** — Partitioning, filesystems, deleted data interpretation.
3. **Memory analysis and volatile state** — Volatile capture concepts, process maps, memory artifacts.
4. **Browser, email and cloud artifacts** — Browser history, email headers, cloud activity.
5. **Forensic reporting and reproducibility** — Repeatability, corroboration, alternative hypotheses.
6. **Section project**

**Project:** Investigate a synthetic endpoint case, preserve source artifacts, build a defensible timeline and report alternative explanations and limits.

**References:** [Volatility 3 documentation](https://volatility3.readthedocs.io/en/stable/) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) · [Wireshark User Guide](https://www.wireshark.org/docs/wsug_html_chunked/)

## 34 · Malware behavior, taxonomy and analysis

Level: Advanced.

1. **Malware classes and operational effects** — Trojans, worms, botnets, ransomware, spyware.
2. **Static triage and file provenance** — Hashes, metadata, imports, strings, provenance.
3. **Dynamic analysis and isolation design** — Sandbox assumptions, behavior observation, isolation.
4. **Persistence, command-and-control and evasion concepts** — Persistence, C2, process injection and evasion concepts.
5. **YARA rules and behavior reports** — YARA, family labels, false positives, evidence-supported reporting.
6. **Section project**

**Project:** Create a malware-analysis report from harmless training artifacts and synthetic telemetry, linking behaviors to detection, containment and recovery.

**References:** [YARA documentation](https://yara.readthedocs.io/en/stable/) · [MITRE ATT&CK](https://attack.mitre.org/) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

## 35 · Reverse engineering and program understanding

Level: Specialist.

1. **Executable formats, loaders and linking** — PE, ELF, Mach-O, loaders, imports.
2. **Assembly, registers and calling conventions** — x86-64, ARM64, registers, stack frames, ABIs.
3. **Disassembly, decompilation and control flow** — Control-flow graphs, data flow, decompiler uncertainty.
4. **Debugging and behavioral validation** — GDB, WinDbg, breakpoints, controlled inputs.
5. **Obfuscation, packing and analysis limits** — Packing, obfuscation, emulation limits.
6. **Section project**

**Project:** Reverse-engineer a harmless program you authored, reconstruct its input behavior and validate your conclusions against controlled runs.

**References:** [Ghidra software reverse engineering framework](https://github.com/NationalSecurityAgency/ghidra) · [Clang AddressSanitizer documentation](https://clang.llvm.org/docs/AddressSanitizer.html) · [YARA documentation](https://yara.readthedocs.io/en/stable/) · [GDB documentation](https://sourceware.org/gdb/documentation/) · [WinDbg documentation](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/)

## 36 · Binary security, fuzzing and exploit principles

Level: Specialist.

1. **Memory corruption and unsafe behavior** — Buffer overflows, UAF, uninitialized memory, integer faults.
2. **Exploit mitigations and their assumptions** — ASLR, DEP/NX, canaries, CFI, memory safety.
3. **Fuzzing harnesses and coverage** — Harness design, coverage, determinism, resource bounds.
4. **Crash triage and minimal reproducers** — Crash deduplication, minimization, sanitizer evidence.
5. **Vulnerability research and coordinated disclosure** — Affected versions, bounded impact, fix validation, disclosure.
6. **Section project**

**Project:** Find and fix a defect in a self-authored toy parser with sanitizers and bounded fuzzing, retaining a minimal non-weaponized reproducer and regression test.

**References:** [Clang AddressSanitizer documentation](https://clang.llvm.org/docs/AddressSanitizer.html) · [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) · [Ghidra software reverse engineering framework](https://github.com/NationalSecurityAgency/ghidra)

## 37 · Red-team planning and purple-team validation

Level: Advanced.

1. **Objectives, threat models and engagement control** — Threat models, objectives, deconfliction, stop authority.
2. **Attack-path planning and safe simulation** — Attack graphs, preconditions, benign simulation.
3. **Initial access and social-engineering concepts** — Phishing and pretext concepts, exposed services, supplier trust.
4. **Lateral movement, persistence and collection objectives** — Lateral movement, persistence, collection and exfiltration objectives.
5. **Purple-team results and retesting** — Prevent, observe, alert, respond, retest.
6. **Section project**

**Project:** Plan an objective-driven authorized exercise using benign simulations, then produce a control-validation report with defensive retesting.

**References:** [MITRE ATT&CK](https://attack.mitre.org/) · [MITRE D3FEND](https://d3fend.mitre.org/) · [OWASP Web Security Testing Guide](https://owasp.org/projects/web-security-testing-guide)

## 38 · Wireless, RF and short-range security

Level: Advanced.

1. **Radio fundamentals and wireless scope** — Frequency, modulation, propagation, legal scope.
2. **Wi-Fi authentication and encryption** — WPA2, WPA3, SAE, protected management frames.
3. **Enterprise wireless and rogue infrastructure** — 802.1X, EAP, RADIUS, certificate validation.
4. **Bluetooth, BLE, NFC and proximity** — Bluetooth, BLE, NFC, RFID, UWB, relay concepts.
5. **Wireless investigation and defensive validation** — Channel coverage, sensor placement, guest isolation.
6. **Section project**

**Project:** Create an owned-network wireless threat model and verify configuration, guest isolation and device inventory without disrupting other networks.

**References:** [WPA3 deployment guide](https://www.cisco.com/c/en/us/td/docs/wireless/controller/9800/technical-reference/wpa3-dg.pdf) · [Guidelines for Securing WLANs](https://csrc.nist.gov/pubs/sp/800/153/final) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

## 39 · Android, iOS and mobile application security

Level: Advanced.

1. **Mobile platform isolation and permissions** — Android sandbox, iOS sandbox, permissions.
2. **Local storage, backups and secret handling** — Keystore, Keychain, logs, backups, screenshots.
3. **Exported components, deep links and IPC** — Android components, intents, content providers, universal links.
4. **Transport, WebViews and authentication** — TLS, WebViews, native bridges, OAuth app flows.
5. **Signing, updates and mobile testing methodology** — Signing, updates, MASVS, MASTG, emulator evidence.
6. **Section project**

**Project:** Assess a self-authored mobile demo or designated training app, documenting storage, exported interfaces, transport, identity and update trust.

**References:** [OWASP Mobile Application Security](https://mas.owasp.org/) · [Android app security risks](https://developer.android.com/privacy-and-security/risks) · [Apple Platform Security guide](https://help.apple.com/pdf/security/en_US/apple-platform-security-guide.pdf) · [Frida documentation](https://frida.re/docs/home/)

## 40 · Hardware, firmware and IoT security

Level: Specialist.

1. **Hardware trust and physical interfaces** — UART, JTAG, SWD, SPI, I2C, device ownership.
2. **Firmware formats and secure boot** — Firmware images, boot chains, trust anchors.
3. **IoT identity, networking and lifecycle** — Device identities, commissioning, decommissioning.
4. **Debugging, side channels and fault concepts** — Hardware debugging, timing leakage, fault models.
5. **Firmware analysis and product assurance** — Firmware provenance, update trust, product support.
6. **Section project**

**Project:** Threat-model a fictional connected device from manufacturing to retirement, including secure boot, updates, physical access and backend identity.

**References:** [NIST Cybersecurity for IoT Program](https://www.nist.gov/itl/applied-cybersecurity/nist-cybersecurity-iot-program) · [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines) · [Guide to Operational Technology Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final)

## 41 · Operational technology and critical infrastructure

Level: Specialist.

1. **OT, ICS, SCADA and safety priorities** — ICS, SCADA, PLC, HMI, safety constraints.
2. **Industrial protocols and trust assumptions** — Modbus, DNP3, OPC UA, industrial Ethernet.
3. **Zones, conduits and remote maintenance** — Zones, conduits, jump hosts, vendor access.
4. **OT vulnerability and change management** — Maintenance windows, legacy assets, compensating controls.
5. **OT incident response and recovery** — Process safety, evidence retention, tested recovery.
6. **Section project**

**Project:** Run an OT tabletop using a fictional plant or simulator, prioritizing physical safety, controlled change, visibility and validated recovery.

**References:** [Guide to Operational Technology Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final) · [MITRE ATT&CK](https://attack.mitre.org/) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

## 42 · AI, machine-learning and agent security

Level: Advanced.

1. **ML lifecycle and model supply chains** — Training data, model registries, dependencies.
2. **Prompt injection and untrusted content** — Indirect prompt injection, instruction hierarchy, untrusted documents.
3. **RAG, data leakage and tenant isolation** — Retrieval authorization, embeddings, tenant separation.
4. **Agent tools, approvals and sandboxing** — Tool permissions, action confirmation, sandbox boundaries.
5. **AI evaluation, abuse cases and monitoring** — Evaluation datasets, abuse cases, drift, auditability.
6. **Section project**

**Project:** Threat-model a retrieval-enabled assistant with tools, build harmless evaluation cases and demonstrate enforced data and action boundaries.

**References:** [OWASP GenAI Security Project](https://genai.owasp.org/) · [MITRE ATLAS](https://atlas.mitre.org/) · [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) · [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) · [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)

## 43 · Governance, risk, privacy and audit

Level: Advanced.

1. **Governance, policies and accountability** — Policies, accountability, risk appetite.
2. **Risk assessment and treatment** — Likelihood, consequence, uncertainty, risk treatment.
3. **Frameworks, controls and assurance** — CSF, control frameworks, audit scope.
4. **Privacy engineering and regulatory obligations** — Data mapping, privacy by design, applicable obligations.
5. **Third-party risk and audit evidence** — Supplier due diligence, evidence sampling, remediation ownership.
6. **Section project**

**Project:** Create a small company security program with an accountable risk register, applicable obligations, control evidence and a privacy data map.

**References:** [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [NIST Privacy Framework](https://www.nist.gov/privacy-framework) · [NICE Framework Resource Center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center)

## 44 · Resilience, architecture operations and leadership

Level: Advanced.

1. **Business impact, RTO and RPO** — Business impact analysis, dependencies, recovery objectives.
2. **Backups, immutable copies and restore drills** — Offline or immutable backups, restores, clean-room recovery.
3. **Availability, DDoS and graceful degradation** — DDoS categories, load shedding, redundancy.
4. **Security metrics, economics and prioritization** — Risk economics, meaningful metrics, opportunity cost.
5. **Leadership, crisis decisions and team health** — Crisis authority, communication, sustainable operations.
6. **Section project**

**Project:** Design and rehearse a recovery plan for a fictional critical service, then present risk, cost and verified outcomes to a nontechnical decision-maker.

**References:** [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) · [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)

## 45 · Human, physical and fraud security

Level: Advanced.

1. **Social engineering and manipulation patterns** — Pretexting, impersonation, persuasion, reporting.
2. **OSINT privacy, doxxing risk and exposure reduction** — Doxxing risks, data brokers, metadata exposure.
3. **Physical access and environmental protection** — Visitor access, tailgating risks, locks, environmental controls.
4. **Business email compromise and payment fraud** — BEC, invoice fraud, beneficiary-change verification.
5. **Deepfakes, trust signals and reporting culture** — Synthetic media, verification channels, non-punitive awareness.
6. **Section project**

**Project:** Create a non-delivery awareness exercise and a fraud-resistant workflow for a fictional office, covering verification, reporting and physical access.

**References:** [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [NIST Digital Identity Guidelines, SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final) · [NICE Framework Resource Center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center)

## 46 · Blockchain, smart contracts and financial systems

Level: Specialist.

1. **Ledgers, consensus and key custody** — Consensus, wallets, custody, transaction finality.
2. **Smart-contract access control and invariants** — Solidity authorization, invariants, state transitions.
3. **Reentrancy, ordering and external calls** — Reentrancy, transaction ordering, callback assumptions.
4. **Oracles, bridges and economic abuse cases** — Oracle trust, bridges, market manipulation concepts.
5. **Financial security reviews and responsible research** — Local test chains, fake assets, responsible findings.
6. **Section project**

**Project:** Assess a toy smart-contract or payment design using a local test environment and fake assets, documenting invariants, privileges and failure recovery.

**References:** [Solidity security considerations](https://docs.soliditylang.org/en/latest/security-considerations.html) · [OpenZeppelin Contracts documentation](https://docs.openzeppelin.com/contracts) · [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)

## 47 · Advanced cryptography and high-assurance methods

Level: Specialist.

1. **Security models and protocol reasoning** — Security definitions, adversary models, reductions.
2. **Formal verification and state machines** — State machines, model checking, protocol properties.
3. **Post-quantum cryptography and migration** — ML-KEM, ML-DSA, SLH-DSA, migration planning.
4. **MPC, homomorphic encryption and zero-knowledge concepts** — MPC, FHE, zero-knowledge proofs, assumption limits.
5. **Cryptanalysis, side channels and implementation assurance** — Cryptanalysis, side channels, implementation validation.
6. **Section project**

**Project:** Produce a high-assurance design note explaining protocol assumptions, formal properties, implementation limits and migration strategy.

**References:** [Post-Quantum Cryptography](https://csrc.nist.gov/projects/post-quantum-cryptography) · [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines) · [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)

## 48 · Sector and emerging-system security

Level: Specialist.

1. **Healthcare and medical-device security** — Clinical workflow, medical-device lifecycle, patient safety.
2. **Automotive and transportation security** — Vehicle networks, transport systems, update trust.
3. **Telecom, 5G and satellite systems** — 5G architecture, signaling trust, satellite dependencies.
4. **Edge, robotics and cyber-physical autonomy** — Robotics, edge inference, autonomy boundaries.
5. **Election, public-interest and high-impact systems** — Election systems, public-service assurance, high-impact review.
6. **Section project**

**Project:** Choose two specialist sectors and create a bounded threat model, safety constraints, evidence plan and a roadmap to sector-specific expertise.

**References:** [Guide to Operational Technology Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final) · [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) · [MITRE ATLAS](https://atlas.mitre.org/)

## 49 · Research, professional communication and career depth

Level: Specialist.

1. **Reading papers and reproducing research** — Literature review, artifact reproduction, novelty.
2. **Experimental design and statistical discipline** — Controls, sampling, statistics, reproducibility.
3. **Technical writing and stakeholder communication** — Technical reports, executive briefs, uncertainty.
4. **Specialization, interviews and professional growth** — Specialization depth, evidence portfolios, interviews.
5. **Portfolio ethics, peer review and teaching** — Peer review, responsible publication, teaching.
6. **Section project**

**Project:** Create a sanitized portfolio showing repeatable work, honest limitations, remediation quality and a specialist development plan.

**References:** [NICE Framework Resource Center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center) · [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [OWASP Web Security Testing Guide](https://owasp.org/projects/web-security-testing-guide)

## 50 · Integrated capstones and continuous mastery

Level: Specialist.

1. **Capstone: build and harden a small organization** — Architecture, identity, segmentation, secure deployment.
2. **Capstone: authorized assessment and remediation** — Scoped assessment, findings, remediation retest.
3. **Capstone: detect and investigate an incident** — Telemetry, detections, synthetic incident reconstruction.
4. **Capstone: recover and brief decision-makers** — Recovery drill, decision log, stakeholder brief.
5. **Maintain skills and update the course evidence** — Source refresh, skill gaps, unfamiliar cases.
6. **Section project**

**Project:** Complete an end-to-end fictional organization assessment, defense, incident response and recovery exercise, then obtain peer review and plan the next learning cycle.

**References:** [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) · [OWASP Application Security Verification Standard](https://asvs.owasp.org/) · [NICE Framework Resource Center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center)

## 51 · Computer architecture and operating-system research

Level: Research.

1. **Privilege levels, traps and system calls** — Privilege rings, exceptions, traps, system calls.
2. **Virtual memory, paging and address spaces** — Page tables, TLBs, virtual address spaces.
3. **Concurrency, synchronization and lifetime** — Locks, atomics, reference counting, object lifetime.
4. **Microarchitecture and speculative execution** — Caches, branch prediction, speculative execution concepts.
5. **OS isolation models and reference monitors** — Reference monitors, isolation, trusted computing base.
6. **Section project**

**Project:** Reconstruct a harmless program across source, machine execution and OS boundaries; validate your model with traces and a peer-reviewed explanation.

**References:** [Linux kernel documentation](https://docs.kernel.org/) · [Windows system information and internals interfaces](https://learn.microsoft.com/en-us/windows/win32/sysinfo/system-information) · [Clang AddressSanitizer documentation](https://clang.llvm.org/docs/AddressSanitizer.html)

## 52 · Linux kernel, eBPF and runtime assurance

Level: Research.

1. **Kernel objects, credentials and namespaces** — Task structures, credentials, user namespaces.
2. **LSMs, seccomp and capability policy** — SELinux, AppArmor, seccomp, Linux capabilities.
3. **eBPF observability and security boundaries** — eBPF verifier, maps, hooks, observability trust.
4. **Kernel exposure, modules and rootkit concepts** — Kernel modules, attack surfaces, rootkit behavior analysis.
5. **Kernel patch analysis and regression assurance** — Kernel diffs, backports, regression tests, evidence.
6. **Section project**

**Project:** Investigate a Linux isolation property in a disposable VM using documented tracing, benign programs and regression evidence.

**References:** [Linux kernel documentation](https://docs.kernel.org/) · [Ubuntu Server security documentation](https://ubuntu.com/server/docs/explanation/security/) · [Clang AddressSanitizer documentation](https://clang.llvm.org/docs/AddressSanitizer.html)

## 53 · Windows internals and endpoint trust

Level: Research.

1. **Tokens, logon sessions and impersonation** — Access tokens, integrity levels, logon sessions.
2. **Objects, handles and access checks** — Object manager, handles, security descriptors.
3. **ETW, audit policy and telemetry integrity** — ETW providers, audit policy, event integrity.
4. **Drivers, code integrity and virtualization-based protection** — Code integrity, drivers, VBS, HVCI concepts.
5. **Endpoint product evaluation and tamper resistance** — EDR assumptions, tamper protection, independent validation.
6. **Section project**

**Project:** Build a documented Windows authority and telemetry model, then investigate a synthetic endpoint case with independently corroborated evidence.

**References:** [Windows system information and internals interfaces](https://learn.microsoft.com/en-us/windows/win32/sysinfo/system-information) · [Windows security documentation](https://learn.microsoft.com/en-us/windows/security/) · [Best practices for securing Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory) · [WinDbg documentation](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/)

## 54 · macOS internals and Apple enterprise security

Level: Research.

1. **Mach-O, launch services and process authority** — Mach-O, launchd, process identity.
2. **Code signing, notarization and Gatekeeper** — Code signing, notarization, Gatekeeper.
3. **Sandboxing, entitlements, TCC and SIP** — App Sandbox, entitlements, TCC, SIP.
4. **Keychain, secure storage and device lifecycle** — Keychain access, MDM, enrollment, recovery.
5. **Extensions, IPC and macOS investigations** — XPC, extensions, unified logs, forensic limits.
6. **Section project**

**Project:** Assess a self-authored macOS utility or documented sample, covering signing, sandboxing, permissions, key storage and managed-device lifecycle.

**References:** [Apple Platform Security guide](https://help.apple.com/pdf/security/en_US/apple-platform-security-guide.pdf) · [OWASP Mobile Application Security](https://mas.owasp.org/) · [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)

## 55 · Advanced networking, IPv6 and traffic semantics

Level: Specialist.

1. **IPv6 address and neighbor-discovery security** — IPv6 scopes, router advertisements, neighbor discovery.
2. **VLANs, trunks and layer-two trust** — 802.1Q, trunks, spanning-tree trust.
3. **Routing protocols and path assurance** — OSPF and BGP assumptions, route filtering.
4. **VPNs, IPsec, tunnels and overlays** — IPsec, WireGuard, GRE, overlays, split tunneling.
5. **Packet normalization and middlebox disagreement** — Reassembly, fragmentation, middlebox interpretation.
6. **Section project**

**Project:** Build a simulated multi-segment network and explain routing, addressing, tunneling and enforcement under normal and failure conditions.

**References:** [RFC standards and protocol references](https://www.rfc-editor.org/) · [Wireshark User Guide](https://www.wireshark.org/docs/wsug_html_chunked/) · [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)

## 56 · Internet routing, DNS, email and PKI operations

Level: Specialist.

1. **BGP, route origin validation and routing incidents** — BGP, RPKI, ROAs, route origin validation.
2. **Authoritative DNS and delegation lifecycle** — DNS delegation, glue, DNSSEC, domain lifecycle.
3. **Encrypted DNS and observation limits** — DoT, DoH, DoQ, encrypted DNS tradeoffs.
4. **Email forwarding, ARC and identity operations** — SPF, DKIM, DMARC, ARC, forwarding.
5. **Certificate transparency, issuance policy and expiry** — CT logs, CAA, certificate issuance, expiry incidents.
6. **Section project**

**Project:** Design an Internet-facing service assurance plan covering routing trust, domain ownership, certificate issuance, email identity and incident recovery.

**References:** [RFC standards and protocol references](https://www.rfc-editor.org/) · [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines) · [WPA3 deployment guide](https://www.cisco.com/c/en/us/td/docs/wireless/controller/9800/technical-reference/wpa3-dg.pdf)

## 57 · Advanced directory, AD CS and identity attack graphs

Level: Research.

1. **ACLs, ownership and delegation chains** — Directory ACLs, object ownership, graph reachability.
2. **AD certificate services and enrollment trust** — AD CS templates, enrollment rights, certificate mapping.
3. **Delegation, trust and service-account exposure** — Unconstrained, constrained and resource-based delegation concepts.
4. **Hybrid identity and SaaS privilege escalation classes** — Hybrid administration, SaaS roles, cross-plane trust.
5. **Directory recovery validation and re-compromise prevention** — Forest recovery, key rollover, residual paths.
6. **Section project**

**Project:** Audit a synthetic directory and certificate-services configuration, identify privilege paths and verify constrained remediations without harvesting credentials.

**References:** [Best practices for securing Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory) · [NIST Digital Identity Guidelines, SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final) · [MITRE ATT&CK](https://attack.mitre.org/) · [BloodHound documentation](https://bloodhound.specterops.io/home) · [Impacket project documentation](https://github.com/fortra/impacket)

## 58 · Federation, SaaS and multi-organization identity

Level: Research.

1. **SAML assertions and federation validation** — SAML signatures, recipient, audience, replay.
2. **OAuth threat models and token-bound authority** — OAuth BCP, PKCE, DPoP, mTLS-bound tokens.
3. **SCIM, provisioning and lifecycle consistency** — SCIM, provisioning, deprovisioning, stale authority.
4. **SaaS application grants and tenant isolation** — Consent grants, app roles, tenant boundaries.
5. **Federation incidents and emergency trust changes** — Federation key changes, sessions, emergency trust restoration.
6. **Section project**

**Project:** Review a fictional federation and SaaS ecosystem, test token and tenant boundaries in a mock environment and produce a least-authority redesign.

**References:** [OpenID Foundation specifications](https://openid.net/developers/specs/) · [NIST Digital Identity Guidelines, SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final) · [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) · [RFC 9700: OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html)

## 59 · Adversary emulation, C2 analysis and evasion concepts

Level: Research.

1. **Objective-driven operations and deconfliction** — Operational objectives, authorization, deconfliction.
2. **Command-channel architectures and defensive observations** — C2 patterns, beacon analysis, network and process observations.
3. **Evasion and anti-analysis behavior classes** — Living-off-the-land, anti-debugging, process injection concepts.
4. **Persistence and privilege-boundary validation** — Persistence categories, privilege boundaries, benign markers.
5. **Emulation findings and detection-resistant assumptions** — Control assumptions, telemetry gaps, retest limits.
6. **Section project**

**Project:** Design a controlled emulation study using benign behavior and synthetic traces, documenting what telemetry, controls and responders can actually establish.

**References:** [MITRE ATT&CK](https://attack.mitre.org/) · [MITRE D3FEND](https://d3fend.mitre.org/) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

## 60 · Browser engines, extensions and client-side research

Level: Research.

1. **JavaScript prototypes and object-boundary flaws** — Prototype pollution, DOM clobbering, object integrity.
2. **WebSockets, workers and asynchronous client state** — WebSockets, service workers, shared workers, asynchronous state.
3. **Browser extension permissions and supply chains** — Extension permissions, messaging, update trust.
4. **JavaScript engines, JIT and WebAssembly models** — V8, JIT, WebAssembly, memory models.
5. **Origin isolation, site isolation and browser assurance** — Same-origin policy, site isolation, cross-origin isolation.
6. **Section project**

**Project:** Analyze a self-authored browser demo and a published fixed defect, connecting runtime behavior, origin isolation, extension authority and regression tests.

**References:** [V8 engine documentation](https://v8.dev/docs) · [Chromium security](https://www.chromium.org/Home/chromium-security/) · [Web security documentation](https://developer.mozilla.org/en-US/docs/Web/Security)

## 61 · Advanced web parsers, deserialization and business logic

Level: Research.

1. **XXE, XML parsers and document processing** — XML, DTD, XXE, parser configuration.
2. **Template languages and object deserialization** — SSTI, unsafe deserialization, object graphs.
3. **Request framing, cache keys and connection reuse** — HTTP/1 framing, HTTP/2 translation, cache keys.
4. **Race conditions and distributed business invariants** — TOCTOU, double spending, distributed idempotency.
5. **Advanced assessment through invariant discovery** — Business invariants, cross-feature interactions, negative tests.
6. **Section project**

**Project:** Perform a differential review of a local multi-component web design, identify an invariant violation and verify a root-cause fix with negative cases.

**References:** [PortSwigger Web Security Academy](https://portswigger.net/web-security) · [OWASP Web Security Testing Guide](https://owasp.org/projects/web-security-testing-guide) · [OWASP Application Security Verification Standard](https://asvs.owasp.org/) · [CWE Top 25 and weakness taxonomy](https://cwe.mitre.org/top25/index.html)

## 62 · Desktop software, native apps and product security

Level: Research.

1. **Electron and hybrid desktop trust boundaries** — Electron contexts, renderer isolation, preload bridges.
2. **Privileged helpers, IPC and local authorization** — Privileged helpers, IPC callers, local authorization.
3. **Archives, symlinks and filesystem containment** — Zip Slip, symlinks, canonicalization, TOCTOU.
4. **Updaters, plugins and local supply chains** — Plugin loading, update signatures, rollback.
5. **Product security review and release assurance** — Desktop trust model, packaging, release evidence.
6. **Section project**

**Project:** Review a self-authored desktop utility with a privileged helper, file import and update path; deliver threat evidence and regression tests.

**References:** [Apple Platform Security guide](https://help.apple.com/pdf/security/en_US/apple-platform-security-guide.pdf) · [Windows security documentation](https://learn.microsoft.com/en-us/windows/security/) · [OWASP Mobile Application Security](https://mas.owasp.org/) · [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)

## 63 · Database engines, NoSQL and analytic platforms

Level: Specialist.

1. **Database authentication and privileged operations** — PostgreSQL roles, MongoDB identities, engine privilege.
2. **Row-level security and tenant policy** — Row-level security, connection pooling, tenant context.
3. **NoSQL operators, queries and schema assumptions** — NoSQL operators, query injection, schema ambiguity.
4. **Search, analytics and data-lake access** — Search indexes, data lakes, analytics roles.
5. **Database auditing, recovery and forensic interpretation** — Database logs, transaction evidence, restore validation.
6. **Section project**

**Project:** Assess a synthetic multi-tenant data platform covering authentication, row-level policy, queries, extensions, backups and analytics copies.

**References:** [PostgreSQL client authentication documentation](https://www.postgresql.org/docs/current/client-authentication.html) · [MongoDB security documentation](https://www.mongodb.com/docs/manual/security/) · [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

## 64 · AWS control-plane and workload identity research

Level: Research.

1. **Effective IAM and policy evaluation** — Identity and resource policies, explicit deny, conditions.
2. **STS sessions, role chaining and workload credentials** — STS, role chaining, session policies, federation.
3. **Resource-policy, organization and KMS interactions** — SCPs, resource policies, KMS grants, permission boundaries.
4. **Metadata, serverless and service integration boundaries** — Instance metadata, serverless identities, service delegation.
5. **Cloud attack graphs and recovery research** — Effective access graphs, least privilege, cloud recovery.
6. **Section project**

**Project:** Model effective AWS authority for a fictional multi-account workload and validate restrictive policies, credential boundaries and incident evidence.

**References:** [AWS Well-Architected Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) · [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) · [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)

## 65 · Entra and Azure control-plane research

Level: Research.

1. **Application objects, service principals and consent** — Entra application objects, service principals, consent.
2. **Delegation, on-behalf-of flows and audiences** — Delegated permissions, application permissions, on-behalf-of.
3. **Azure resource roles and identity bridges** — Azure RBAC, directory roles, cross-plane bridges.
4. **Key Vault, private endpoints and policy assurance** — Key Vault policy, private endpoints, governance.
5. **Tenant compromise and trust restoration** — Tenant incident scope, sessions, app trust, clean administration.
6. **Section project**

**Project:** Review effective authority across a fictional Entra tenant and Azure estate, including applications, consent, resource roles and recovery trust.

**References:** [Microsoft cloud security benchmark](https://learn.microsoft.com/en-us/security/benchmark/azure/) · [OpenID Foundation specifications](https://openid.net/developers/specs/) · [NIST Digital Identity Guidelines, SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final)

## 66 · Google Cloud control-plane research

Level: Research.

1. **Effective IAM and conditional access** — Policy inheritance, conditional IAM, deny policies.
2. **Service-account impersonation and federation** — Service-account impersonation, workload identity federation.
3. **Organization policy and data perimeters** — Organization policy, VPC Service Controls, data boundaries.
4. **Build, deploy and runtime authority** — Build identities, deploy authority, runtime accounts.
5. **Cross-project investigations and recovery** — Cross-project evidence, trust reset, recovery validation.
6. **Section project**

**Project:** Model a fictional Google Cloud organization and verify identity, service-account, organization-policy and data-perimeter assumptions.

**References:** [Google Cloud security best practices](https://cloud.google.com/security/best-practices) · [OpenID Foundation specifications](https://openid.net/developers/specs/) · [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)

## 67 · Kubernetes multi-tenancy and platform assurance

Level: Research.

1. **Control-plane data and cluster authority** — API server, etcd, certificates, control-plane authority.
2. **Admission, operators and custom resources** — Admission webhooks, operators, CRDs, reconciliation.
3. **Tenant isolation across network and storage** — Namespaces, storage claims, node trust, network policy.
4. **Cluster supply chains and upgrade safety** — Image provenance, cluster upgrades, controller dependencies.
5. **Platform compromise and clean-room recovery** — Compromise scope, clean cluster rebuild, trust restoration.
6. **Section project**

**Project:** Evaluate a fictional multi-tenant cluster using explicit threat boundaries, admission controls, workload constraints and recovery validation.

**References:** [Kubernetes security documentation](https://kubernetes.io/docs/concepts/security/) · [Docker Engine security](https://docs.docker.com/engine/security/) · [Linux kernel documentation](https://docs.kernel.org/)

## 68 · Build systems, compilers and source-to-binary trust

Level: Research.

1. **Bootstrapping and the trusting-trust problem** — Compiler bootstrapping, trusting trust, toolchain authority.
2. **Hermetic builds and dependency resolution** — Hermeticity, deterministic builds, dependency resolution.
3. **Package ecosystems, install scripts and ownership** — Package maintainers, install hooks, namespace ownership.
4. **Signing services, provenance and release identity** — Signing services, provenance attestations, release identities.
5. **Independent release verification and research** — Independent rebuilds, binary comparison, reproducibility limits.
6. **Section project**

**Project:** Create a source-to-artifact assurance experiment with isolated builds, dependency provenance, independent reproduction and a documented trust model.

**References:** [Supply-chain Levels for Software Artifacts](https://slsa.dev/) · [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) · [Clang AddressSanitizer documentation](https://clang.llvm.org/docs/AddressSanitizer.html) · [Git Tutorial](https://git-scm.com/docs/gittutorial)

## 69 · Security data engineering, SOAR and automation safety

Level: Specialist.

1. **Event schemas, provenance and evolution** — Schema versioning, event provenance, parser correctness.
2. **Streaming time, ordering and exactly-once claims** — Event time, watermarks, ordering, duplicate delivery.
3. **Collection cost, retention and query performance** — Retention tiers, query cost, cardinality, data quality.
4. **SOAR permissions and consequential actions** — SOAR authority, action approval, credential scope.
5. **Automation failure, rollback and audit trails** — Dry runs, rollback, idempotency, audit trails.
6. **Section project**

**Project:** Build a synthetic event pipeline and response workflow with schema validation, backpressure, auditability and controlled human approval for consequential actions.

**References:** [Sigma detection-format documentation](https://sigmahq.io/docs/) · [Zeek documentation](https://docs.zeek.org/en/current/) · [The Python Tutorial](https://docs.python.org/3/tutorial/) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

## 70 · Adversarial analytics and detection research

Level: Research.

1. **Base rates, precision and operational utility** — Base-rate fallacy, precision, recall, analyst utility.
2. **Ground truth, labels and dataset leakage** — Labels, ground truth, training-test leakage.
3. **Adaptive adversaries and robust evaluation** — Adaptive behavior, holdout cases, robustness.
4. **Drift, calibration and monitoring dependencies** — Drift, calibration, missing sensors, dependency failures.
5. **Blind validation and reproducible detection claims** — Blind tests, reproducible datasets, uncertainty.
6. **Section project**

**Project:** Evaluate a detection hypothesis on separated synthetic development and blind-test sets, measuring utility, robustness, drift and operational cost.

**References:** [MITRE ATT&CK](https://attack.mitre.org/) · [Sigma detection-format documentation](https://sigmahq.io/docs/) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

## 71 · Advanced Windows and enterprise forensics

Level: Research.

1. **Registry and configuration artifacts** — Registry hives, configuration history, artifact provenance.
2. **NTFS metadata and change journals** — MFT, USN journal, timestamps, filesystem limits.
3. **Execution, application and user-activity traces** — Prefetch, Amcache, Shimcache, SRUM interpretation.
4. **Enterprise correlation and identity attribution** — Endpoint, identity and network correlation.
5. **Forensic peer review and competing hypotheses** — Competing hypotheses, peer review, confidence limits.
6. **Section project**

**Project:** Investigate a synthetic enterprise endpoint case with artifact-specific reasoning, timeline uncertainty and independently reproducible findings.

**References:** [Windows system information and internals interfaces](https://learn.microsoft.com/en-us/windows/win32/sysinfo/system-information) · [Volatility 3 documentation](https://volatility3.readthedocs.io/en/stable/) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

## 72 · Cloud, SaaS and distributed forensics

Level: Research.

1. **Control-plane and data-plane evidence** — Provider control-plane versus workload evidence.
2. **Ephemeral compute, snapshots and containers** — Ephemeral instances, snapshots, containers, managed services.
3. **Federated identities and token provenance** — Federated sessions, token issuance, identity provenance.
4. **Provider access, legal process and retention limits** — Retention, acquisition rights, provider support.
5. **Distributed timelines and incident reconstruction** — Clock differences, distributed causality, corroboration.
6. **Section project**

**Project:** Investigate a synthetic multi-cloud incident while preserving provider-specific semantics, identity provenance and known collection gaps.

**References:** [AWS Well-Architected Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) · [Microsoft cloud security benchmark](https://learn.microsoft.com/en-us/security/benchmark/azure/) · [Google Cloud security best practices](https://cloud.google.com/security/best-practices) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

## 73 · Advanced malware deconstruction and defensive research

Level: Research.

1. **Loaders, stages and dependency chains** — Loaders, stages, imports, execution dependencies.
2. **Packing, emulation and semantic reconstruction** — Packing, emulation, semantic reconstruction.
3. **Rootkits, kernel trust and firmware persistence concepts** — Kernel rootkits, bootkits, firmware persistence concepts.
4. **Malware families, clustering and attribution limits** — Code similarity, clustering, shared infrastructure, attribution.
5. **Behavioral signatures and research-quality reporting** — Behavior summaries, YARA limits, reproducible reports.
6. **Section project**

**Project:** Produce a peer-reviewable behavior analysis using harmless programs, documented fixed samples or synthetic traces, with explicit capability and confidence boundaries.

**References:** [Ghidra software reverse engineering framework](https://github.com/NationalSecurityAgency/ghidra) · [YARA documentation](https://yara.readthedocs.io/en/stable/) · [MITRE ATT&CK](https://attack.mitre.org/)

## 74 · Memory exploitation models and modern mitigations

Level: Research.

1. **Stack, heap and object-lifetime vulnerabilities** — Stack corruption, heap corruption, UAF, double free.
2. **Integer, type and representation confusion** — Integer overflow, signedness, type confusion.
3. **Code-reuse and control-flow concepts** — ROP, JOP, control-flow integrity, CET concepts.
4. **Information disclosure and mitigation interaction** — Information leaks, layout assumptions, mitigation interactions.
5. **Exploitability assessment and patch assurance** — Root-cause analysis, exploitability limits, regression tests.
6. **Section project**

**Project:** Analyze a fixed memory-safety defect or self-authored toy, demonstrate the violated invariant without weaponization and verify both the root-cause fix and mitigation assumptions.

**References:** [Clang AddressSanitizer documentation](https://clang.llvm.org/docs/AddressSanitizer.html) · [Ghidra software reverse engineering framework](https://github.com/NationalSecurityAgency/ghidra) · [CWE Top 25 and weakness taxonomy](https://cwe.mitre.org/top25/index.html)

## 75 · Browser and mobile vulnerability research

Level: Research.

1. **JIT optimization and speculative assumptions** — JIT tiers, optimization assumptions, deoptimization.
2. **Garbage collection and cross-component lifetimes** — Garbage collection, object lifetime, cross-language interfaces.
3. **Browser IPC and sandbox escape classes** — IPC validation, sandbox escape classes, broker boundaries.
4. **Mobile system services and app-to-platform boundaries** — Mobile daemons, system services, entitlement checks.
5. **Research workflow and coordinated platform fixes** — Fixed-case reproduction, affected versions, coordinated fixes.
6. **Section project**

**Project:** Study a published fixed browser or mobile defect, reconstruct the violated assumptions and build a safe regression or model-based validation plan.

**References:** [V8 engine documentation](https://v8.dev/docs) · [Chromium security](https://www.chromium.org/Home/chromium-security/) · [Android app security risks](https://developer.android.com/privacy-and-security/risks) · [Apple Platform Security guide](https://help.apple.com/pdf/security/en_US/apple-platform-security-guide.pdf) · [Frida documentation](https://frida.re/docs/home/) · [GDB documentation](https://sourceware.org/gdb/documentation/)

## 76 · Kernel, driver and hypervisor security research

Level: Research.

1. **Kernel entry points and driver input surfaces** — IOCTLs, syscalls, driver inputs, kernel attack surface.
2. **Device memory, DMA and IOMMU boundaries** — DMA, IOMMU, device ownership, memory mappings.
3. **Hypervisor and virtual-device attack classes** — Virtual devices, hypercalls, VM escape classes.
4. **Kernel concurrency and synchronization research** — Kernel races, locking, lifetime, synchronization.
5. **Privileged patch review and assurance claims** — Patch review, variant analysis, mitigation boundaries.
6. **Section project**

**Project:** Threat-model a privileged interface and analyze a published fixed defect with a non-weaponized reproducer strategy, patch reasoning and independent review.

**References:** [Linux kernel documentation](https://docs.kernel.org/) · [Windows system information and internals interfaces](https://learn.microsoft.com/en-us/windows/win32/sysinfo/system-information) · [Clang AddressSanitizer documentation](https://clang.llvm.org/docs/AddressSanitizer.html)

## 77 · Advanced fuzzing and program analysis

Level: Research.

1. **Coverage-guided and structure-aware fuzzing** — Coverage feedback, grammars, structure-aware mutation.
2. **Stateful protocols and sequence testing** — State machines, sequence fuzzing, reset behavior.
3. **Differential and metamorphic testing** — Differential testing, metamorphic properties, oracles.
4. **Static, symbolic and dynamic analysis** — Static analysis, symbolic execution, dynamic instrumentation.
5. **Corpus management and reproducible triage** — Seed curation, crash deduplication, stable reproducers.
6. **Section project**

**Project:** Build a bounded local research harness for a self-authored parser, compare analysis methods and publish a reproducible defect-and-fix study.

**References:** [Clang AddressSanitizer documentation](https://clang.llvm.org/docs/AddressSanitizer.html) · [CWE Top 25 and weakness taxonomy](https://cwe.mitre.org/top25/index.html) · [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)

## 78 · Cryptanalysis and security-protocol verification

Level: Research.

1. **Number theory and public-key assumptions** — Modular arithmetic, groups, finite fields, hardness assumptions.
2. **Randomness, nonces and state failures** — Randomness failures, nonce reuse, state rollback.
3. **Chosen-input and oracle attack concepts** — Padding oracles, chosen-input models, adaptive-query concepts.
4. **Symbolic protocol models and composition** — Symbolic models, authentication, secrecy, composition.
5. **Proof review, implementation leakage and peer challenge** — Proof assumptions, implementation leakage, independent review.
6. **Section project**

**Project:** Analyze a toy or published protocol under an explicit attacker model, verify a stated property and obtain independent critique of the proof and implementation assumptions.

**References:** [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines) · [RFC standards and protocol references](https://www.rfc-editor.org/) · [Post-Quantum Cryptography](https://csrc.nist.gov/projects/post-quantum-cryptography) · [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)

## 79 · Hardware, physical fault and side-channel research

Level: Research.

1. **Hardware interface and firmware acquisition models** — Datasheets, interfaces, acquisition provenance.
2. **Secure elements, TPMs and roots of trust** — TPM, secure elements, attestation, roots of trust.
3. **Timing, power and electromagnetic leakage concepts** — Timing, power, EM leakage, statistical controls.
4. **Fault injection and physical attack assumptions** — Voltage and clock fault concepts, physical threat models.
5. **Hardware assurance and reproducible research** — Measurement controls, repeatability, assurance limits.
6. **Section project**

**Project:** Design a non-destructive experiment on an owned development board or simulator, characterize measurement uncertainty and propose a verified mitigation.

**References:** [NIST Cybersecurity for IoT Program](https://www.nist.gov/itl/applied-cybersecurity/nist-cybersecurity-iot-program) · [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines) · [Linux kernel documentation](https://docs.kernel.org/)

## 80 · Telecom, RF and network-protocol research

Level: Research.

1. **Cellular identities and authentication architecture** — SIM and eSIM, cellular identities, authentication architecture.
2. **Signaling systems and inter-operator trust** — SS7, Diameter, roaming, inter-operator trust.
3. **SDR, RF measurement and experimental scope** — SDR, sampling, modulation, permitted measurement.
4. **Satellite, navigation and timing dependencies** — GNSS, satellite links, timing dependence.
5. **Protocol research and responsible ecosystem coordination** — Protocol models, ecosystem coordination, responsible research.
6. **Section project**

**Project:** Build a simulator-based telecom threat study with explicit protocol roles, trust boundaries, synthetic evidence and a non-interference validation plan.

**References:** [RFC standards and protocol references](https://www.rfc-editor.org/) · [WPA3 deployment guide](https://www.cisco.com/c/en/us/td/docs/wireless/controller/9800/technical-reference/wpa3-dg.pdf) · [Guidelines for Securing WLANs](https://csrc.nist.gov/pubs/sp/800/153/final)

## 81 · Advanced ICS and cyber-physical assurance

Level: Research.

1. **Control logic, engineering stations and process invariants** — PLC logic, engineering stations, process invariants.
2. **Industrial firmware and product lifecycle research** — Firmware lifecycle, legacy dependencies, vendor coordination.
3. **Historian, telemetry and process evidence** — Historian records, process telemetry, sensor confidence.
4. **Hardware-in-the-loop and safe validation design** — Digital twins, hardware-in-the-loop, safety stop design.
5. **OT assurance cases and independent review** — OT assurance cases, independent review, operational constraints.
6. **Section project**

**Project:** Develop a simulator-only cyber-physical assurance case connecting controller authority, process safety, monitoring and independently validated recovery.

**References:** [Guide to Operational Technology Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final) · [MITRE ATT&CK](https://attack.mitre.org/) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

## 82 · Firmware and embedded product research

Level: Research.

1. **UEFI, bootloaders and measured startup** — UEFI, bootloaders, measured boot, rollback resistance.
2. **TEE, TrustZone and compartment boundaries** — TrustZone, TEEs, secure monitors, compartment boundaries.
3. **RTOS, bare-metal and constrained-device tradeoffs** — RTOS scheduling, interrupts, bare metal, resource limits.
4. **OTA updates, rollback protection and fleet operations** — OTA signing, staged rollout, device recovery.
5. **Embedded vulnerability disclosure and support lifetime** — Coordinated disclosure, fleet exposure, end-of-support.
6. **Section project**

**Project:** Review a fictional embedded product from boot to update and retirement, using permitted artifacts, reproducible analysis and a vendor-ready remediation report.

**References:** [NIST Cybersecurity for IoT Program](https://www.nist.gov/itl/applied-cybersecurity/nist-cybersecurity-iot-program) · [Linux kernel documentation](https://docs.kernel.org/) · [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)

## 83 · AI model attacks and adversarial evaluation

Level: Research.

1. **Training-data poisoning and backdoor concepts** — Training poisoning, backdoors, dataset provenance.
2. **Adversarial inputs and robustness measurement** — Adversarial examples, threat models, robustness.
3. **Model extraction, inversion and membership inference** — Model extraction, model inversion, membership inference.
4. **LLM evaluation and the 2026 risk landscape** — OWASP LLM risks 2026, tool access, data leakage.
5. **AI research claims and reproducibility** — Baselines, reproducible evaluations, claims and uncertainty.
6. **Section project**

**Project:** Evaluate a local toy model or published benchmark with synthetic data, documenting attacker assumptions, privacy effects, robustness and reproducibility.

**References:** [MITRE ATLAS](https://atlas.mitre.org/) · [OWASP GenAI Security Project](https://genai.owasp.org/) · [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/)

## 84 · Agentic systems, MCP and tool-protocol security

Level: Research.

1. **Agent authority and action binding** — Agent identity, scoped authority, action binding.
2. **MCP authorization and confused-deputy risks** — MCP authorization, confused deputy, token audience.
3. **Tool output, retrieval and memory poisoning** — Tool-output injection, retrieval poisoning, memory provenance.
4. **Multi-agent delegation and cross-agent trust** — Multi-agent delegation, handoffs, inherited trust.
5. **Agent evaluations and runtime control assurance** — Permission checks, action logs, adversarial evaluations.
6. **Section project**

**Project:** Build a local mock agent-tool ecosystem with constrained identities, consent, resource authorization and an evaluation suite for untrusted content and stale authority.

**References:** [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) · [Model Context Protocol security best practices](https://modelcontextprotocol.io/specification/latest/basic/security_best_practices) · [OpenID Foundation specifications](https://openid.net/developers/specs/)

## 85 · Privacy engineering and privacy-enhancing research

Level: Research.

1. **De-identification and re-identification risk** — Linkability, singling out, re-identification.
2. **Differential privacy and composition concepts** — Differential privacy, privacy budgets, composition.
3. **MPC, homomorphic computation and trusted hardware** — MPC, FHE, TEEs, trust assumptions.
4. **Biometric systems and privacy assurance** — Biometric templates, liveness limits, sensitive inference.
5. **Privacy research validation and misuse resistance** — Privacy attack models, empirical evaluation, misuse resistance.
6. **Section project**

**Project:** Compare privacy designs for a synthetic dataset, quantify stated leakage and utility, and produce a defensible evaluation of assumptions and limitations.

**References:** [NIST Privacy Framework](https://www.nist.gov/privacy-framework) · [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines) · [NIST Digital Identity Guidelines, SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final)

## 86 · Distributed ledgers and financial protocol research

Level: Research.

1. **Consensus, finality and distributed failure** — Consensus, finality, forks, distributed failure.
2. **MEV, transaction ordering and economic incentives** — MEV, ordering, incentive compatibility, economic assumptions.
3. **Bridges, validators and cross-chain trust** — Bridges, validators, threshold trust, cross-chain state.
4. **Governance, upgrades and emergency authority** — Governance keys, upgrade authority, emergency controls.
5. **Formal invariants and economic stress testing** — State invariants, local simulation, economic stress tests.
6. **Section project**

**Project:** Review a local fake-asset protocol with explicit economic and technical invariants, blind tests and independent critique of failure assumptions.

**References:** [Solidity security considerations](https://docs.soliditylang.org/en/latest/security-considerations.html) · [OpenZeppelin Contracts documentation](https://docs.openzeppelin.com/contracts) · [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)

## 87 · Fraud, abuse and adversarial business systems

Level: Specialist.

1. **Account takeover and identity-abuse lifecycles** — Credential stuffing concepts, account recovery abuse, session takeover.
2. **Bots, automation and resource abuse** — Bots, fake accounts, resource abuse, rate-limit tradeoffs.
3. **Payment, refund and beneficiary-change controls** — Refunds, beneficiary changes, transaction review.
4. **Risk signals, privacy and fair review** — Risk signals, human review, fairness, data minimization.
5. **Abuse-case research and programme metrics** — Abuse metrics, displacement, counterexamples, false positives.
6. **Section project**

**Project:** Design a fictional abuse-defense programme with transaction verification, privacy-aware signals, appeal paths and measured legitimate-user impact.

**References:** [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [NIST Privacy Framework](https://www.nist.gov/privacy-framework) · [NIST Digital Identity Guidelines, SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final)

## 88 · Mainframes, ERP and legacy enterprise security

Level: Specialist.

1. **Mainframe identities and resource protection** — z/OS, RACF, resource classes, privileged identities.
2. **Batch jobs, transactions and data movement** — JCL, batch jobs, CICS concepts, data movement.
3. **ERP roles, business transactions and segregation** — SAP and ERP roles, segregation of duties.
4. **Legacy protocols and modernization bridges** — Legacy authentication, gateways, modernization boundaries.
5. **Legacy evidence, resilience and migration assurance** — Operational evidence, backups, migration rollback.
6. **Section project**

**Project:** Create a legacy-estate assurance plan covering identity, transactions, integration boundaries, audit and phased modernization without disrupting operations.

**References:** [z/OS Security Server RACF library](https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-security-server-racf) · [SAP BTP security documentation](https://help.sap.com/docs/btp/sap-business-technology-platform/security) · [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)

## 89 · Sector-specific research and assurance programmes

Level: Research.

1. **Medical-device and clinical ecosystem research** — Clinical dependencies, medical-device updates, patient safety.
2. **Automotive, aviation and transport assurance** — CAN, automotive ECUs, aviation systems, assurance boundaries.
3. **Energy, utilities and interconnected critical services** — Energy systems, utility dependencies, cascading failures.
4. **Space, defense and high-assurance environments** — Space systems, defense assurance, high-consequence review.
5. **Public-interest systems and independent verification** — Public-interest infrastructure, transparency, independent verification.
6. **Section project**

**Project:** Choose a sector and produce an expert-reviewed assurance case with technical evidence, safety constraints, governance and explicit remaining research questions.

**References:** [Guide to Operational Technology Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final) · [NIST Cybersecurity for IoT Program](https://www.nist.gov/itl/applied-cybersecurity/nist-cybersecurity-iot-program) · [NIST Privacy Framework](https://www.nist.gov/privacy-framework) · [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)

## 90 · Strategic defense and cross-organization crisis research

Level: Research.

1. **Threat actors, campaigns and evidence discipline** — Campaign analysis, source confidence, attribution limits.
2. **Supply-chain and cross-organization incidents** — Supplier compromise, shared dependencies, cross-party response.
3. **Critical-service prioritization and escalation** — Critical-service triage, escalation, decision authority.
4. **International norms and lawful research boundaries** — International norms, jurisdiction, lawful cooperation.
5. **Strategic exercises and lessons across institutions** — Strategic tabletops, evidence-led lessons, institutional change.
6. **Section project**

**Project:** Run a multi-organization fictional crisis exercise with technical evidence, attribution uncertainty, information-sharing boundaries and verified recovery priorities.

**References:** [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) · [MITRE ATT&CK](https://attack.mitre.org/) · [NICE Framework Resource Center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center)

## 91 · Advanced privacy, law and jurisdiction research

Level: Specialist.

1. **Researching applicable obligations from primary sources** — Primary legal texts, regulator guidance, effective dates.
2. **Data roles, processing purposes and cross-border flows** — Controller and processor concepts, purposes, cross-border data maps.
3. **Retention, rights and verifiable deletion engineering** — Retention, rights workflows, backups, verifiable deletion.
4. **Incident notification and evidence governance** — Incident facts, notification research, qualified escalation.
5. **Privacy assurance research and accountable decisions** — Traceable criteria, privacy controls, assurance review.
6. **Section project**

**Project:** Create a jurisdiction-aware research dossier for a fictional service, separating current authoritative requirements, technical controls and questions needing qualified legal review.

**References:** [NIST Privacy Framework](https://www.nist.gov/privacy-framework) · [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [Law Library of Congress research center](https://www.loc.gov/research-centers/law-library-of-congress/)

## 92 · Advanced security architecture and formal system design

Level: Research.

1. **Capability systems and authority minimization** — Capabilities, attenuation, revocation, ambient authority.
2. **Information flow and declassification** — Information flow, noninterference concepts, declassification.
3. **Distributed trust, consistency and security invariants** — Distributed authorization, freshness, consistency, revocation.
4. **Trusted computing base and compositional assurance** — Trusted computing base, composition, interface assumptions.
5. **Architecture counterexamples and peer challenge** — Counterexamples, model review, implementation evidence.
6. **Section project**

**Project:** Specify and evaluate a high-assurance fictional system, connecting threat assumptions, formal invariants, implementation boundaries and operational recovery.

**References:** [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) · [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines) · [Linux kernel documentation](https://docs.kernel.org/) · [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)

## 93 · Security assurance, standards and evaluation research

Level: Research.

1. **Criteria selection and scope engineering** — Evaluation scope, criteria, system boundaries.
2. **Evidence quality, sampling and independence** — Evidence provenance, sampling, independence.
3. **Control design versus operating effectiveness** — Control design, deployment, operating effectiveness.
4. **Certification and evaluation claims** — Certification scope, product evaluation, deployment assumptions.
5. **Continuous assurance and falsifiable metrics** — Falsifiable claims, continuous checks, change triggers.
6. **Section project**

**Project:** Create an evidence-based assurance case, compare control and outcome frameworks, and independently evaluate one precise security claim.

**References:** [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [OWASP Application Security Verification Standard](https://asvs.owasp.org/) · [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) · [NICE Framework Resource Center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center)

## 94 · PSIRT, vulnerability coordination and product stewardship

Level: Specialist.

1. **Vulnerability intake and reporter collaboration** — Disclosure policy, intake channels, reporter collaboration.
2. **Root cause, variants and affected-version analysis** — Variant analysis, affected versions, root causes.
3. **Severity, impact and advisory accuracy** — Severity, impact assumptions, advisory accuracy.
4. **Fix coordination, embargoes and release trust** — Embargo coordination, release trust, partner responsibilities.
5. **Post-release validation and product improvement** — Fix adoption, recurrence, support lifetime.
6. **Section project**

**Project:** Operate a fictional product-security incident process from intake through root-cause remediation, coordinated release and verified customer guidance.

**References:** [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) · [CWE Top 25 and weakness taxonomy](https://cwe.mitre.org/top25/index.html) · [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

## 95 · Open-source vulnerability research and ecosystem analysis

Level: Research.

1. **Target selection and research authorization** — Permitted local targets, licenses, research charters.
2. **Root-cause taxonomies and CWE mapping** — CWE mapping, causal defects, weakness families.
3. **Repository and history-based research** — Repository history, patch analysis, regression discovery.
4. **Responsible research automation at scale** — Local research automation, rate and resource bounds.
5. **Maintainer collaboration and sustainable fixes** — Maintainer collaboration, fix quality, sustainable support.
6. **Section project**

**Project:** Produce a reproducible study of a permitted open-source component or self-authored project, with bounded evidence, variant analysis and coordinated maintenance outcomes.

**References:** [CWE Top 25 and weakness taxonomy](https://cwe.mitre.org/top25/index.html) · [Git Tutorial](https://git-scm.com/docs/gittutorial) · [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) · [Supply-chain Levels for Software Artifacts](https://slsa.dev/)

## 96 · Advanced intelligence, attribution and analytic tradecraft

Level: Research.

1. **Intelligence collection plans and ethical scope** — Collection requirements, lawful scope, source evaluation.
2. **Structured analytic techniques and bias** — Alternative hypotheses, cognitive bias, structured analysis.
3. **Infrastructure, malware and campaign linkage** — Infrastructure links, malware links, campaign uncertainty.
4. **Strategic assessments and uncertainty communication** — Confidence language, strategic assessments, decision relevance.
5. **Analytic validation and retrospective review** — Analytic retrospectives, falsification, source refresh.
6. **Section project**

**Project:** Write an independently critiqued intelligence assessment using public or synthetic evidence, with source evaluation, competing hypotheses and clear decision relevance.

**References:** [MITRE ATT&CK](https://attack.mitre.org/) · [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) · [NICE Framework Resource Center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center)

## 97 · Secure tool building and research infrastructure

Level: Research.

1. **Research tool architecture and safe defaults** — Threat models, safe defaults, reproducible tool behavior.
2. **Parsers, plugins and untrusted artifacts** — Untrusted parsers, plugin isolation, dependency boundaries.
3. **Reproducible environments and dependency trust** — Environment pinning, fixtures, provenance.
4. **Performance, resource budgets and failure handling** — Resource budgets, timeouts, bounded failure.
5. **Tool validation, review and maintenance** — Tests, peer review, release signing, maintenance.
6. **Section project**

**Project:** Build a local-only security research tool with a documented threat model, safe defaults, bounded execution, regression tests and independent code review.

**References:** [The Python Tutorial](https://docs.python.org/3/tutorial/) · [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) · [Supply-chain Levels for Software Artifacts](https://slsa.dev/) · [Linux kernel documentation](https://docs.kernel.org/)

## 98 · Original research and scientific security practice

Level: Research.

1. **Literature review and precise research questions** — Prior work, novelty, precise questions.
2. **Methods, controls and preregistered decisions** — Controls, inclusion criteria, preregistration, measurement.
3. **Negative results and uncertainty** — Negative results, uncertainty, reporting exclusions.
4. **Artifact evaluation and independent replication** — Artifact evaluation, independent replication, harmless fixtures.
5. **Research writing, peer review and correction** — Research papers, reviewer responses, correction history.
6. **Section project**

**Project:** Complete a defensible original research study or meaningful independent replication, with public-safe artifacts, peer critique and documented corrections.

**References:** [NICE Framework Resource Center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center) · [CWE Top 25 and weakness taxonomy](https://cwe.mitre.org/top25/index.html) · [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

## 99 · Teaching, mentoring and leading expert security work

Level: Specialist.

1. **Teaching mechanisms and testing understanding** — Causal explanations, worked examples, transfer tests.
2. **Mentoring research and engineering judgment** — Mentoring hypotheses, actionable feedback, independent reasoning.
3. **Review culture and constructive disagreement** — Evidence-led review, constructive dissent, decision records.
4. **Leading investigations and cross-functional decisions** — Cross-functional leadership, specialist input, escalation.
5. **Sustainable expertise and knowledge stewardship** — Runbooks, knowledge transfer, sustained expert practice.
6. **Section project**

**Project:** Teach a difficult topic, mentor a reproducible project and lead a peer-reviewed exercise with clear decisions, technical depth and sustainable operating practices.

**References:** [NICE Framework Resource Center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center) · [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

## 100 · Independent expert portfolio and original research defense

Level: Research.

1. **Blind multi-domain assessment** — Blind cases, unfamiliar evidence, independent evaluation.
2. **Build, assess, detect and recover integration** — Build, assess, detect, investigate, recover.
3. **Original contribution and responsible validation** — Original methods, tools, findings, rigorous replication.
4. **Peer defense and correction of assumptions** — Peer defense, counterexamples, corrected conclusions.
5. **Continuing expert practice and emerging frontiers** — Maintained depth, new research questions, continuing contribution.
6. **Section project**

**Project:** Defend a multi-domain portfolio before qualified peers, complete a blind assessment and publish or privately preserve a responsible original research contribution with verifiable evidence.

**References:** [NICE Framework Resource Center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center) · [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) · [OWASP Application Security Verification Standard](https://asvs.owasp.org/) · [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

## Official reference catalogue

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) — NIST. Risk outcomes, governance and programme structure.
- [NICE Framework Resource Center](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center) — NIST. Explore professional work roles, knowledge and skills; this course is not a NICE certification.
- [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) — NIST. Published incident-response guidance linked to cybersecurity risk management.
- [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) — NIST. SSDF 1.1 final baseline. The publisher publications page still listed 1.2 as Draft on 6 November 2026; distinguish drafts from final recommendations.
- [NIST Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) — NIST. Architecture concepts and resource-focused access decisions.
- [NIST Digital Identity Guidelines, SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final) — NIST. Identity proofing, authentication and federation guidance.
- [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines) — NIST. Find current official cryptographic standards and implementation guidance.
- [Post-Quantum Cryptography](https://csrc.nist.gov/projects/post-quantum-cryptography) — NIST. Use current finalized standards and migration guidance; distinguish research from standardized practice.
- [NIST Privacy Framework](https://www.nist.gov/privacy-framework) — NIST. Privacy-risk concepts; applicable laws need separate current jurisdiction-specific sources.
- [Guide to Operational Technology Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final) — NIST. OT architecture, risk and operational constraints; use simulators and tabletop exercises.
- [Guidelines for Securing WLANs](https://csrc.nist.gov/pubs/sp/800/153/final) — NIST. An older WLAN lifecycle baseline; read alongside current WPA3 and device-vendor guidance.
- [NIST Cybersecurity for IoT Program](https://www.nist.gov/itl/applied-cybersecurity/nist-cybersecurity-iot-program) — NIST. IoT capabilities, lifecycle and product assurance.
- [MITRE ATT&CK](https://attack.mitre.org/) — MITRE. Map observed adversary behavior and detection questions; mappings are not proof of coverage.
- [MITRE D3FEND](https://d3fend.mitre.org/) — MITRE. Research defensive countermeasures and their relationships.
- [MITRE ATLAS](https://atlas.mitre.org/) — MITRE. AI-system threat knowledge; interactive site may require JavaScript.
- [OWASP Top 10:2025](https://top10.owasp.org/2025/) — OWASP Foundation. Web-security awareness baseline; this course also covers issues beyond the Top 10.
- [OWASP Application Security Verification Standard](https://asvs.owasp.org/) — OWASP Foundation. ASVS 5.0.0 was shown by the publisher when checked; select applicable requirements.
- [OWASP API Security Project](https://owasp.org/projects/api-security-project) — OWASP Foundation. API risks and further guidance, including the published 2023 Top 10.
- [OWASP Web Security Testing Guide](https://owasp.org/projects/web-security-testing-guide) — OWASP Foundation. Assessment methodology and authorized test cases.
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) — OWASP Foundation. Implementation-focused secure coding references.
- [OWASP Threat Dragon](https://owasp.org/projects/threat-dragon) — OWASP Foundation. Optional open-source threat-modeling tool; paper diagrams are acceptable.
- [OWASP Mobile Application Security](https://mas.owasp.org/) — OWASP Foundation. MASVS, MASTG and designated mobile training material.
- [OWASP GenAI Security Project](https://genai.owasp.org/) — OWASP Foundation. AI application risks, evaluation and guidance.
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) — PortSwigger. Optional designated training exercises. A site account or network connection may be needed; platform scope applies.
- [OWASP Juice Shop](https://owasp.org/projects/juice-shop) — OWASP Foundation. Optional intentionally vulnerable local application. Keep it on an isolated local lab network.
- [The Python Tutorial](https://docs.python.org/3/tutorial/) — Python Software Foundation. Language reference/tutorial; the first programming lessons in this course provide the beginner starting point.
- [Git Tutorial](https://git-scm.com/docs/gittutorial) — Git project. Version-control workflow and command documentation.
- [Ubuntu Server security documentation](https://ubuntu.com/server/docs/explanation/security/) — Canonical. Linux administration and hardening; use documentation matching your installed distribution.
- [Windows security documentation](https://learn.microsoft.com/en-us/windows/security/) — Microsoft. Platform security controls and deployment guidance.
- [Best practices for securing Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory) — Microsoft. Directory administration and protection; some supporting material may require an account.
- [Web security documentation](https://developer.mozilla.org/en-US/docs/Web/Security) — Mozilla contributors. Browser security and web-platform concepts.
- [Wireshark User Guide](https://www.wireshark.org/docs/wsug_html_chunked/) — Wireshark project. Capture and display analysis using only traffic you are authorized to collect.
- [Passkeys](https://fidoalliance.org/passkeys/) — FIDO Alliance. Passkey concepts, deployment and phishing resistance.
- [AWS Well-Architected Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) — Amazon Web Services. AWS workload security. Paper alternatives are included; cloud exercises can incur charges.
- [Microsoft cloud security benchmark](https://learn.microsoft.com/en-us/security/benchmark/azure/) — Microsoft. Cloud-control objectives; distinguish published baselines from previews.
- [Google Cloud security best practices](https://cloud.google.com/security/best-practices) — Google Cloud. Provider architecture and control guidance; check current service behavior.
- [Docker Engine security](https://docs.docker.com/engine/security/) — Docker. Container runtime boundary, privilege and host integration.
- [Kubernetes security documentation](https://kubernetes.io/docs/concepts/security/) — Kubernetes project. Cluster, workload, identity and network security; choose the installed version.
- [Supply-chain Levels for Software Artifacts](https://slsa.dev/) — SLSA project. Artifact integrity, provenance and build trust.
- [Known Exploited Vulnerabilities data mirror](https://github.com/cisagov/kev-data) — CISA. Official CISA mirror used because the main catalogue blocked automated retrieval.
- [CVSS v4.0 specification](https://www.first.org/cvss/v4.0/specification-document) — FIRST. Severity-scoring semantics; not a complete organizational risk score.
- [Exploit Prediction Scoring System](https://www.first.org/epss/) — FIRST. Model context and current exploitation-probability data.
- [Zeek documentation](https://docs.zeek.org/en/current/) — Zeek project. Network telemetry concepts and local authorized analysis.
- [Suricata documentation](https://docs.suricata.io/en/latest/) — Open Information Security Foundation. Network detection reference. Latest can be development documentation; select the installed stable version.
- [Sigma detection-format documentation](https://sigmahq.io/docs/) — SigmaHQ. Portable detection rules, field mapping and testing.
- [YARA documentation](https://yara.readthedocs.io/en/stable/) — YARA project. File and memory pattern matching with harmless training fixtures.
- [Volatility 3 documentation](https://volatility3.readthedocs.io/en/stable/) — Volatility Foundation. Memory-analysis framework and supported artifact formats.
- [Ghidra software reverse engineering framework](https://github.com/NationalSecurityAgency/ghidra) — National Security Agency / Ghidra project. Analyze self-authored harmless binaries and documented training programs.
- [Clang AddressSanitizer documentation](https://clang.llvm.org/docs/AddressSanitizer.html) — LLVM project. Detect and understand memory faults in self-authored toy programs.
- [WPA3 deployment guide](https://www.cisco.com/c/en/us/td/docs/wireless/controller/9800/technical-reference/wpa3-dg.pdf) — Cisco. Current vendor WPA3 reference; settings are product-specific, not universal router instructions.
- [Android app security risks](https://developer.android.com/privacy-and-security/risks) — Google / Android Developers. Mobile application boundary and platform-risk guidance.
- [Apple Platform Security guide](https://help.apple.com/pdf/security/en_US/apple-platform-security-guide.pdf) — Apple. Official downloadable platform-security guide. The web guide rate-limited retrieval; confirm the current edition when studying.
- [Solidity security considerations](https://docs.soliditylang.org/en/latest/security-considerations.html) — Solidity project. Smart-contract risks. Latest may be development documentation; use the version matching the toy compiler.
- [OpenZeppelin Contracts documentation](https://docs.openzeppelin.com/contracts) — OpenZeppelin. Contract design and reusable components; practice with fake assets on a local test chain.
- [Linux kernel documentation](https://docs.kernel.org/) — Linux kernel project. Kernel internals, supported interfaces and security assumptions; select the relevant kernel version.
- [Windows system information and internals interfaces](https://learn.microsoft.com/en-us/windows/win32/sysinfo/system-information) — Microsoft. Start from documented interfaces and follow platform-specific security and debugging references.
- [RFC standards and protocol references](https://www.rfc-editor.org/) — RFC Editor / IETF. Find the exact RFC, updates, status and errata. Not every RFC is a current standard.
- [RFC 9700: OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html) — IETF. Published OAuth security BCP, January 2025; check subsequent updates and the chosen flow.
- [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html) — IETF. Published TLS 1.3 protocol specification; review updates and implementation context.
- [OpenID Foundation specifications](https://openid.net/developers/specs/) — OpenID Foundation. Federation and identity specifications; distinguish final specifications and drafts.
- [PostgreSQL client authentication documentation](https://www.postgresql.org/docs/current/client-authentication.html) — PostgreSQL project. Database authentication and security references matching the installed release.
- [MongoDB security documentation](https://www.mongodb.com/docs/manual/security/) — MongoDB. NoSQL authentication, authorization, encryption and deployment controls.
- [V8 engine documentation](https://v8.dev/docs) — V8 project. Engine design, runtime and optimization references for fixed-case and toy research.
- [Chromium security](https://www.chromium.org/Home/chromium-security/) — Chromium project. Browser security architecture, research and responsible reporting references.
- [Model Context Protocol security best practices](https://modelcontextprotocol.io/specification/latest/basic/security_best_practices) — Model Context Protocol project. Current publisher security guidance; redirected to its 2026-07-28 documentation tree when checked.
- [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) — OWASP GenAI Security Project. 2026 LLM risk reference published by the project; adapt categories into system-specific evaluations.
- [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) — OWASP GenAI Security Project. Agentic risk reference. Pair with enforced tool permissions and current protocol security guidance.
- [CWE Top 25 and weakness taxonomy](https://cwe.mitre.org/top25/index.html) — MITRE. The publisher landing page showed the 2025 edition when checked; the taxonomy extends beyond this ranked list.
- [z/OS Security Server RACF library](https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-security-server-racf) — IBM. Versioned primary RACF documentation identified through publisher search; use the deployed z/OS edition.
- [SAP BTP security documentation](https://help.sap.com/docs/btp/sap-business-technology-platform/security) — SAP. ERP/cloud integration entry point; interactive documentation may require JavaScript and product-specific navigation.
- [Law Library of Congress research center](https://www.loc.gov/research-centers/law-library-of-congress/) — Library of Congress. A government legal-research starting point, not a single global compliance answer; retrieval was blocked in the automated check.
- [Nmap reference guide](https://nmap.org/book/man.html) — Nmap project. Discovery concepts and permitted local-lab use; targets, effects and authorization must be explicit.
- [ZAP documentation](https://www.zaproxy.org/docs/) — ZAP project. Web assessment reference for self-authored apps and designated training targets.
- [Metasploit Framework documentation](https://docs.metasploit.com/) — Metasploit / Rapid7. Framework concepts and bounded designated-lab methodology; no permission to test unrelated services.
- [GDB documentation](https://sourceware.org/gdb/documentation/) — GNU / GDB project. Debug self-authored harmless binaries and validate program-understanding hypotheses.
- [WinDbg documentation](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/) — Microsoft. Windows debugging and dump-analysis entry point.
- [Hashcat documentation](https://hashcat.net/wiki/) — Hashcat project. Password-auditing concepts with synthetic hashes you generated yourself; no third-party credential collection.
- [John the Ripper documentation](https://www.openwall.com/john/doc/) — Openwall. Authorized offline password-audit concepts and algorithm understanding using dummy data.
- [BloodHound documentation](https://bloodhound.specterops.io/home) — SpecterOps. Identity attack-path modeling and defensive remediation in a dummy directory or synthetic graph.
- [Frida documentation](https://frida.re/docs/home/) — Frida project. Instrumentation of self-authored or explicitly designated training apps.
- [Impacket project documentation](https://github.com/fortra/impacket) — Fortra / Impacket project. Protocol-library study with mock services and authorized lab identities.
- [sqlmap documentation](https://github.com/sqlmapproject/sqlmap/wiki) — sqlmap project. Understand automated test assumptions and verify results on an intentionally vulnerable local training app.
- [Kali Linux documentation](https://www.kali.org/docs/) — Kali / OffSec. Optional learning environment. A security distribution does not establish skill or testing authorization.
