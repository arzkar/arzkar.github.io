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
      "Dance studios needed a unified platform for student enrollment, scheduling, and payments. Existing solutions in the space were either prohibitively expensive or inflexible, forcing studios to rely on spreadsheets and manual reconciliation.\n\nThe system needed to support 100+ studios with strict tenant isolation, 10,000+ students, $500K+ in monthly payment volume, financial compliance, reliability, and operational clarity, with room to scale without constant rewrites. This placed the product directly against established players like DanceStudio-Pro, but with a focus on flexibility and cost efficiency.",
    architecture:
      "The platform was built as a multi-tenant SaaS system with strict data isolation and a clear separation of concerns.\n\nCore backend: A NestJS-based monolith responsible for domain logic, orchestration, and tenant-aware APIs. NestJS was chosen for its strong modular structure, dependency injection, and long-term maintainability at this level of complexity.\n\nPayments service: High-throughput payment workflows (Stripe webhooks, retries, reconciliation) were extracted into a dedicated Fastify microservice. This reduced coupling with the core backend, simplified testing, and allowed the payments pipeline to scale independently under load.\n\nFrontend: A React application built around TanStack Query, enabling optimistic updates, cache consistency, and resilient UI behavior during partial failures.\n\nData layer: MongoDB is used as the primary datastore, with tenant-scoped access patterns and indexing strategies to enforce isolation and performance. While workable, the domain's relational nature surfaced clear limitations that informed later architectural discussions.",
    decisions: [
      "NestJS over Express: The domain complexity (payments, enrollments, scheduling, tenancy) demanded strong structure and dependency boundaries. NestJS provided this without fragmenting the codebase too early.",
      "Fastify payments microservice: The payments domain introduced heavy dependency graphs and testing friction inside the monolith. Extracting it into a Fastify service reduced DI complexity, improved testability, and allowed independent scaling of webhook throughput.",
      "Stripe Connect for payments: Enabled clean separation between platform fees and studio payouts while handling compliance and edge cases reliably.",
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
      "Pointo operates large fleets of lithium-ion batteries powering e-rickshaws. Each battery continuously emits telemetry via a Battery Management System (BMS), producing high-frequency heartbeat data that must be ingested, processed, and analyzed in near real time.\n\nThe system needed to handle thousands of active batteries concurrently, ingest multiple telemetry messages per second per device, support multiple IoT device manufacturers with differing payload formats, enable real-time monitoring and predictive maintenance, and remain reliable under intermittent connectivity and noisy data.",
    architecture:
      "The platform was designed as a stream-oriented IoT ingestion and processing pipeline, optimized for reliability and operational clarity.\n\nEdge & ingestion layer: IoT devices (e.g. Teltonika and other manufacturers) communicate via TCP. Custom parsers were implemented for each device type to normalize vendor-specific payloads into a common internal format.\n\nRaw data capture: Incoming TCP payloads are first written to Amazon S3 as immutable raw records. This provides durability, replayability, and a clear audit trail — critical when dealing with hardware inconsistencies and evolving parsers.\n\nProcessing pipeline: A downstream processing module reads raw payloads, applies validation and transformation logic, and forwards normalized heartbeat events to the core backend.\n\nCore backend: A NestJS service handles business logic, persistence, and APIs. This includes battery health computation, alerting thresholds, and fleet-level aggregation.\n\nMessaging & flow control: RabbitMQ is used to buffer and fan-out heartbeat events, smoothing traffic spikes and decoupling ingestion from processing.\n\nData storage: Time-series–optimized storage is used for battery health metrics, enabling efficient queries over large volumes of telemetry data.\n\nInfrastructure: Deployed on AWS using EC2, RDS, ECR, S3, and SES, with CI/CD pipelines and infrastructure-as-code to ensure repeatable deployments and safe rollbacks.",
    decisions: [
      "Raw payloads to S3 before processing: Storing raw telemetry upfront allowed safe parser iteration, replay of historical data, and protection against malformed or partially understood payloads — a common issue in heterogeneous IoT fleets.",
      "Custom device parsers: Each manufacturer exposes different protocols and payload structures. Writing explicit parsers kept complexity isolated and prevented vendor quirks from leaking into core business logic.",
      "RabbitMQ over Kafka: For the required throughput and team size, RabbitMQ offered sufficient performance with significantly lower operational overhead.",
      "NestJS for the backend: The domain involved complex validation, aggregation, and lifecycle rules. NestJS provided the structure and testability needed to evolve this logic safely.",
      "Time-series–oriented storage: Battery telemetry is append-heavy and query-driven by time windows. Modeling this explicitly avoided costly scans and simplified analytics.",
    ],
    outcome:
      "Ingests and processes millions of telemetry events daily. Supports 10,000+ active batteries in production. Enables real-time monitoring and early fault detection. Improved fleet uptime and operational decision-making for operators. The resulting system balances data integrity, scalability, and debuggability, making it resilient to both hardware noise and future growth.",
    isPrivate: true,
    technologies: [
      "NestJS",
      "Next.js",
      "RabbitMQ",
      "AWS (EC2, RDS, ECR, S3, SES)",
      "TCP",
      "Time-series Storage",
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
      "60% reduction in manual operational processes. Accurate, real-time tracking of battery and charger inventory. Faster and more reliable customer onboarding and collections. Enabled automated battery immobilization tied to business rules. Improved operational visibility and decision-making across teams. The platform became a foundational internal system, enabling Pointo to scale operations without a proportional increase in operational overhead.",
    isPrivate: true,
    technologies: ["Express.js", "React", "TanStack Query", "MySQL", "AWS"],
  },
];
