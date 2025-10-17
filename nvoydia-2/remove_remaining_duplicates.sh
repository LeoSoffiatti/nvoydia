#!/bin/bash

# Script to remove remaining duplicate companies
# This will remove the second occurrence of each duplicate company

echo "Removing remaining duplicate companies..."

# ElevenLabs duplicate
sed -i '' '1912,1947d' data-service.js
echo "Removed ElevenLabs duplicate"

# GitHub Copilot duplicate  
sed -i '' '2250,2278d' data-service.js
echo "Removed GitHub Copilot duplicate"

# CodiumAI duplicate
sed -i '' '2284,2312d' data-service.js
echo "Removed CodiumAI duplicate"

# Replit duplicate
sed -i '' '2320,2348d' data-service.js
echo "Removed Replit duplicate"

# Tome duplicate
sed -i '' '2466,2494d' data-service.js
echo "Removed Tome duplicate"

# Notion duplicate
sed -i '' '2502,2530d' data-service.js
echo "Removed Notion duplicate"

# Figma duplicate
sed -i '' '2538,2566d' data-service.js
echo "Removed Figma duplicate"

# Canva duplicate
sed -i '' '2574,2602d' data-service.js
echo "Removed Canva duplicate"

# AWS duplicate
sed -i '' '2610,2638d' data-service.js
echo "Removed AWS duplicate"

# Vercel duplicate
sed -i '' '2718,2746d' data-service.js
echo "Removed Vercel duplicate"

# Baseten duplicate
sed -i '' '2790,2818d' data-service.js
echo "Removed Baseten duplicate"

# Weights & Biases duplicate
sed -i '' '2900,2928d' data-service.js
echo "Removed Weights & Biases duplicate"

# DataBricks duplicate
sed -i '' '2936,2964d' data-service.js
echo "Removed DataBricks duplicate"

# Pinecone duplicate
sed -i '' '2972,3000d' data-service.js
echo "Removed Pinecone duplicate"

# LangChain duplicate
sed -i '' '3008,3036d' data-service.js
echo "Removed LangChain duplicate"

# LlamaIndex duplicate
sed -i '' '3044,3072d' data-service.js
echo "Removed LlamaIndex duplicate"

# cuDNN duplicate
sed -i '' '3118,3146d' data-service.js
echo "Removed cuDNN duplicate"

# TensorRT duplicate
sed -i '' '3154,3182d' data-service.js
echo "Removed TensorRT duplicate"

# RAPIDS duplicate
sed -i '' '3224,3252d' data-service.js
echo "Removed RAPIDS duplicate"

# Triton Inference Server duplicate
sed -i '' '3260,3288d' data-service.js
echo "Removed Triton Inference Server duplicate"

# CUDA Toolkit duplicate
sed -i '' '3296,3324d' data-service.js
echo "Removed CUDA Toolkit duplicate"

echo "✅ All duplicate companies removed!"
