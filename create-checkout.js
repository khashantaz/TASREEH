name: Deploy Firebase Rules

on:
  push:
    branches:
      - main
    paths:
      - 'firestore.rules'
      - 'firebase.json'

jobs:
  deploy-firebase:
    name: Deploy Firestore Rules
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy Firestore rules
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only firestore:rules
        env:
          GCP_SA_KEY: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
