# Daily Images

Format de nommage obligatoire :
- `YYYY-MM-DD__slug-de-la-rue.jpg`
- Exemple : `2026-03-25__montee-des-abricotiers.jpg`

Regles de slug :
- minuscules
- accents supprimes
- apostrophes supprimees
- caracteres non alphanumeriques remplaces par `-`
- tirets consecutifs compresses

Reference des prochains Daily :
- `manifest_next_30.csv`

Depot des images :
- Place les fichiers `.jpg` directement dans ce dossier.

Optionnel :
- Tu peux ajouter une version `.webp` du meme nom si besoin.

Generation Google Street View :
- Activer l'API Google Street View Static et configurer `GOOGLE_STREET_VIEW_API_KEY`
  dans l'environnement ou dans `.env.local`.
- Lancer un test sans capture :
  `npm run daily:streetview -- --from 2026-05-11 --to 2026-05-13 --dry-run`
- Generer les images manquantes :
  `npm run daily:streetview -- --from 2026-05-11 --only-missing`
- Parametres utiles :
  `--width 430 --height 640 --fov 90 --pitch 15 --heading 180 --radius 50`
