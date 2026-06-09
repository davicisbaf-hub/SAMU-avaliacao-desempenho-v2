#!/bin/bash

# 1. Puxa as novidades do Github
git pull origin main

# 2. Reinicia apenas a API para o Node.js ler o código novo
docker restart samu-api

echo "Sistema atualizado com sucesso!"