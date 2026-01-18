#!/bin/bash
# Generate a secure random secret for NEXTAUTH_SECRET

echo "Generated NEXTAUTH_SECRET:"
openssl rand -base64 32

