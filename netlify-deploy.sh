#!/bin/bash
echo "🚀 Deploying SOVS to Netlify..."
echo ""
echo "Step 1: Build the web version"
npm run build:web
echo ""
echo "Step 2: Deploy to Netlify"
netlify deploy --prod --dir=dist
