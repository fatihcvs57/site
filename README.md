# Sanayi Parçacı Online Sistem

## Çalıştırma

Node 18+

```bash
cp .env.example .env
npm install
npm run migrate
npm run seed
npm start
```

Uygulama: http://localhost:3000

İlk giriş: `admin@partshop.local / admin123`

## Replit'te Çalıştırma

Projeyi Replit'e import ettikten sonra **Run** düğmesine basmanız yeterlidir; varsayılan komut
`npm run migrate && npm run seed && npm start` olarak ayarlanmıştır. Manuel çalıştırmak için:

```bash
npm run migrate
npm run seed
npm start
```
