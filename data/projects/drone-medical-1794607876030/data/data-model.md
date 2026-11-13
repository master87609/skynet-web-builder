# Database Architecture & Schema — Synapse AI

```sql
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_ref VARCHAR(100) DEFAULT 'synapse-ai',
    full_name VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    service_selection VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS catalog_offerings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    tag VARCHAR(100),
    price_indicator VARCHAR(50),
    description TEXT,
    active BOOLEAN DEFAULT TRUE
);
```
Status: **Approved**