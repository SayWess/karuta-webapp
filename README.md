# Karuta Webapp

TODO





# Configuration Supabase

Pour l'instant pas grand chose, pensez juste à renommer `.env.default` en `.env` avant de lancer le docker compose.

Accès au dashboard :
- `http://localhost:8000`
- DASHBOARD_USERNAME=supabase \
  DASHBOARD_PASSWORD=f3785e9882c999fcf5b9be7733785b0d

## Troubleshooting

Si jamais vous avez un postgres qui tourne déjà, changez la variable d'env `POSTGRES_PORT` au port que vous voulez pour ne pas qu'ils entrent en conflit. 

