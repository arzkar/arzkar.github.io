/**
 * Case Studies - Deep dives into production systems
 *
 * Each case study focuses on Problem, Architecture, Key Decisions, and Outcome
 * to demonstrate systems thinking and production experience.
 */

export interface CaseStudy {
  title: string;
  company: string;
  companyUrl?: string;
  dateRange: string;
  problem: string;
  architecture: string;
  decisions: string[];
  outcome: string;
  isPrivate: boolean;
  technologies: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    title: "Enrollio.ai — Multi-Tenant SaaS Platform for Dance Studios",
    company: "DaaS - Developers As A Service",
    companyUrl: "https://www.workwithdaas.com/",
    dateRange: "Jul 2025 – Present",
    problem:
      "Dance studios needed a unified platform for student enrollment, scheduling, and payments. Existing solutions in the space were either prohibitively expensive or inflexible, forcing studios to rely on spreadsheets and manual reconciliation.\n\nThe system needed to support 100+ active enterprise clients, each processing $100K-$200K in monthly revenue, leading to a total platform processing volume of over $1M+ monthly. It required strict tenant isolation, a highly flexible custom discount engine, financial compliance, and operational clarity, directly competing against established players with a focus on extreme flexibility.",
    architecture:
      "The platform was built as a multi-tenant SaaS system with strict data isolation and a clear separation of concerns.\n\nCore backend: A NestJS-based monolith responsible for domain logic, orchestration, and tenant-aware APIs. NestJS was chosen for its strong modular structure, dependency injection, and long-term maintainability at this level of complexity.\n\nPayments service: High-throughput payment workflows (Stripe webhooks, retries, reconciliation) were extracted into a dedicated Fastify microservice. This reduced coupling with the core backend, simplified testing, and allowed the payments pipeline to scale independently under load.\n\nFrontend: A React application built around TanStack Query, enabling optimistic updates, cache consistency, and resilient UI behavior during partial failures.\n\nData layer: MongoDB is used as the primary datastore, with tenant-scoped access patterns and indexing strategies to enforce isolation and performance. While workable, the domain's relational nature surfaced clear limitations that informed later architectural discussions.",
    decisions: [
      "NestJS over Express: The domain complexity (payments, enrollments, scheduling, tenancy) demanded strong structure and dependency boundaries. NestJS provided this without fragmenting the codebase too early.",
      "Custom Rules Engine for Billing: Off-the-shelf Stripe Billing wasn't flexible enough to handle the complex, intertwined requirements of multi-student, multi-sibling, and multi-parent discounts. We built a custom discount engine from scratch and used Stripe solely for Payment Intents.",
      "Fastify payments microservice: The payments domain introduced heavy dependency graphs and testing friction inside the monolith. Extracting it into a Fastify service reduced DI complexity, improved testability, and allowed independent scaling of high-throughput payment workflows.",
      "MongoDB vs PostgreSQL: MongoDB was already in place when I joined. While functional, the highly relational nature of enrollments and payments highlighted where a relational model (PostgreSQL) would have provided stronger guarantees and simpler reasoning. This influenced how schemas, validations, and application-level constraints were designed going forward.",
    ],
    outcome:
      "80% reduction in enrollment processing time for studios. Platform reliably handles 10× growth without architectural refactors. 95%+ client retention, driven by operational reliability. Successfully processes millions in monthly transactions in production. Most importantly, the system remains understandable, testable, and evolvable — allowing new features to ship without destabilizing core workflows.",
    isPrivate: true,
    technologies: [
      "NestJS",
      "Fastify",
      "React",
      "TanStack Query",
      "MongoDB",
      "Stripe Connect",
      "AWS",
    ],
  },
  {
    title: "Impulsion.io - Equestrian Scheduling Platform",
    company: "DaaS - Developers As A Service",
    companyUrl: "https://www.workwithdaas.com/",
    dateRange: "Jul 2025 - Present",
    problem:
      "Equestrian facilities needed a sophisticated scheduling system for lessons, horse management, and instructor assignments. Complex domain logic involving recurring schedules, cancellations, waitlists, and resource allocation. Needed to handle timezone complexities and real-time availability updates.",
    architecture:
      "Built with Hono for lightweight, fast API responses. React frontend with TanStack Query for real-time state management. Complex scheduling logic implemented with proper domain modeling. Real-time updates via WebSockets for availability changes. PostgreSQL with timezone-aware datetime handling.",
    decisions: [
      "Chose Hono over NestJS for this project due to lower overhead and faster cold starts",
      "Implemented domain-driven design for complex scheduling rules",
      "Used PostgreSQL's timezone features instead of handling in application code",
      "WebSocket connections for real-time updates instead of polling",
      "Optimistic UI updates for better perceived performance",
    ],
    outcome:
      "Streamlined lesson booking process. Real-time availability prevents double-bookings. System handles complex recurring schedules and cancellations seamlessly. Improved facility utilization and instructor scheduling efficiency.",
    isPrivate: true,
    technologies: [
      "Hono",
      "React",
      "TanStack Query",
      "PostgreSQL",
      "WebSockets",
      "AWS",
    ],
  },
  {
    title: "IoT Battery Fleet Management Platform",
    company: "Pointo",
    companyUrl: "https://www.pointo.in/",
    dateRange: "Jun 2024 – Jul 2025",
    problem:
      "Pointo operates large fleets of lithium-ion batteries powering e-rickshaws. Each battery continuously emits telemetry through IoT BMS devices, generating high-frequency heartbeat packets that needed to be ingested, parsed, processed, and analyzed in near real time.\n\nThe platform needed to support 5,000+ active batteries concurrently, with devices transmitting telemetry every 30 seconds, resulting in over 14.4 million daily events. The system also had to support multiple IoT manufacturers, unreliable network conditions, CAN telemetry decoding, and real-time operational visibility across the fleet.",
    architecture:
      "The system was designed as a stream-oriented telemetry ingestion and processing platform optimized for reliability, scalability, and operational observability.\n\nEdge & ingestion layer: IoT devices communicated over raw TCP connections. We implemented custom binary protocol parsers for multiple device vendors, including Teltonika Codec8/Codec12 payload decoding and CAN telemetry parsing.\n\nProcessing & messaging: RabbitMQ buffered and distributed telemetry events across downstream processing services, smoothing traffic spikes and decoupling ingestion from business workflows.\n\nCore backend: NestJS services handled telemetry persistence, battery state computation, alerting, fleet APIs, and operational workflows.\n\nData layer: PostgreSQL was heavily optimized for high-ingestion telemetry workloads using indexing, partitioning strategies, and query optimization techniques to maintain sub-second dashboard and analytics performance.\n\nInfrastructure: Deployed on AWS using EC2, RDS, ECR, S3, and SES with CI/CD pipelines and operational monitoring.",
    decisions: [
      "Optimized PostgreSQL over dedicated TSDBs to maintain strong relational consistency between telemetry, operational workflows, and fleet data while still supporting large-scale time-series ingestion.",
      "Stored raw telemetry payloads in S3 before processing, enabling safe parser iteration, historical replay, debugging, and recovery from malformed packets.",
      "Used RabbitMQ instead of Kafka to efficiently handle the required throughput with significantly lower operational overhead for a smaller engineering team.",
      "Implemented vendor-specific protocol parsers and CAN decoding pipelines to isolate manufacturer quirks and prevent device-specific complexity from leaking into core services.",
    ],
    outcome:
      "Successfully ingested and processed over 14.4 million telemetry events daily from a fleet of 5,000+ batteries while maintaining reliable real-time monitoring and fault detection. The platform significantly improved operational visibility, reduced manual intervention, and maintained sub-second query performance across critical dashboards and fleet analytics workflows.",
    isPrivate: true,
    technologies: [
      "NestJS",
      "Next.js",
      "PostgreSQL",
      "RabbitMQ",
      "AWS (EC2, RDS, ECR, S3, SES)",
      "TCP",
      "CAN Bus",
      "Teltonika Codec8/Codec12",
      "IoT Telemetry",
      "Distributed Systems",
    ],
  },
  {
    title: "Internal Operations Platform",
    company: "Pointo",
    companyUrl: "https://www.pointo.in/",
    dateRange: "Jun 2024 – Jul 2025",
    problem:
      "Pointo's core operations — sales, customer onboarding, collections, and inventory management — were spread across disconnected tools and manual workflows. This resulted in data silos, delayed decisions, and operational friction as the organization scaled.\n\nThe platform needed to provide a single source of truth across teams, track battery and charger inventory accurately, support customer onboarding with KYC verification and digital contracts, manage collections and payment status, integrate with battery manufacturer APIs for remote immobilization, and offer real-time operational visibility without increasing manual overhead.",
    architecture:
      "The system was built as a centralized internal operations platform, optimized for clarity, speed of iteration, and reliability.\n\nBackend: An Express.js API handles core application logic and integrations. The focus was on predictable request flows and straightforward debuggability for a fast-moving operational environment.\n\nFrontend: A React-based dashboard using TanStack Query for data fetching and cache management, enabling responsive UIs and consistent state across complex workflows.\n\nDatabase: MySQL serves as the primary datastore, with a unified schema spanning sales, collections, inventory, and customer records — enabling cross-functional reporting and analytics.\n\nIntegrations: KYC verification services for customer onboarding, digital contract signing for customer agreements, and manufacturer APIs for remote battery immobilization based on payment or compliance status.\n\nInfrastructure: Deployed on AWS with standard monitoring and alerting to support business-critical operations.",
    decisions: [
      "Monolithic architecture (intentionally): Given the tight coupling between operational workflows, a monolith allowed faster delivery, simpler debugging, and easier coordination across teams — without premature complexity.",
      "Unified data model: Sales, collections, inventory, and customer data were designed to live in a single schema, enabling real-time operational views and reducing reconciliation errors.",
      "Automation over manual workflows: Critical operational steps (onboarding, KYC, contract activation, immobilization triggers) were automated to reduce human error and improve turnaround time.",
      "TanStack Query for frontend state: Operational dashboards depend on freshness and consistency. TanStack Query provided predictable data synchronization without complex client-side state machines.",
    ],
    outcome:
      "Grew and led a 5-person engineering team to deliver the platform, resulting in a 60% reduction in manual operational processes. Achieved accurate, real-time tracking of battery and charger inventory and vastly accelerated customer KYC onboarding. Enabled automated battery immobilization tied to business rules. The platform became a foundational internal system, enabling Pointo to scale operations without a proportional increase in operational overhead.",
    isPrivate: true,
    technologies: ["Express.js", "React", "TanStack Query", "MySQL", "AWS"],
  },
];
