# Database Migrations

This directory contains database migrations managed by Prisma.

## How Migrations Work

1. When you make changes to your Prisma schema file, you create a migration:
   ```
   npx prisma migrate dev --name <migration-name>
   ```

2. Prisma will generate a new folder with a timestamp in this directory.

3. The generated migration contains SQL that will be executed against your database.

## Deploying Migrations

In production, use:
```
npx prisma migrate deploy
```

This command will apply any pending migrations to your production database.

## Best Practices

- Always check in migration files to your version control system
- Use descriptive names for migrations (e.g., `add-user-roles`, `create-tournaments-table`)
- Review the SQL in generated migrations before applying them to production
- Never modify existing migrations that have been applied to a shared database

## Migration Structure Example

A typical migration folder looks like:

```
20230101120000_migration_name/
├── migration.sql    # The SQL statements to run
└── migration.toml   # Metadata about the migration
``` 