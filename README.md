# Green Bites - Backend

Ye Green Bites food website ka backend server hai (Node.js + Express + MongoDB).
Isay chalane ke liye aapke computer mein **Node.js** installed hona chahiye
(agar nahi hai to https://nodejs.org se install kar lein).

## Setup / Install karne ka tarika

1. Is folder ko kisi bhi jagah extract kar lein (zip se nikaal lein).
2. Terminal / Command Prompt kholein aur is folder mein jayein:
   ```
   cd green-bites-backend
   ```
3. Zaroori packages install karein:
   ```
   npm install
   ```
4. `.env` file mein `MONGO_URI` set karein (neechay MongoDB section dekhein).
5. Server start karein:
   ```
   npm start
   ```
6. Browser mein ye URL kholein:
   ```
   http://localhost:3000
   ```

Bas! Ab pura Green Bites website (frontend + backend + database) is ek hi jagah se chal raha hai.

## Backend kya karta hai

- **Order Now** button click karne par ek form khulta hai — jo order backend
  ko bhejta hai aur **MongoDB database** mein save ho jata hai.
- **Contact** section ka form bhi backend ko message bhejta hai — jo
  MongoDB mein save ho jata hai.
- Har order/contact aane par Brevo se email notification bhi bhejta hai (agar configure ho).

## MongoDB Setup (Database)

1. https://www.mongodb.com/cloud/atlas par free account banayein (agar nahi hai).
2. Ek **free cluster** create karein.
3. **Database Access** mein ek user banayein (username/password).
4. **Network Access** mein apna IP allow karein (ya `0.0.0.0/0` for anywhere, testing ke liye).
5. **Connect → Drivers** se connection string copy karein, kuch is tarah ki dikhegi:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/greenbites?retryWrites=true&w=majority
   ```
6. `.env` file mein `MONGO_URI` ki value ye copy ki hui string se replace kar dein
   (username/password bhi apne asli wale daalein).
7. Server start karein — terminal mein "MongoDB se connect ho gaya ✅" dikhna chahiye.

Agar local MongoDB install kiya hua hai to `.env` mein ye bhi likh saktay hain:
```
MONGO_URI=mongodb://localhost:27017/greenbites
```

## API Endpoints

| Method | URL              | Kaam                              |
|--------|------------------|------------------------------------|
| POST   | /api/order       | Naya order submit karna (MongoDB mein save)  |
| GET    | /api/orders      | Sab orders dekhna (admin ke liye)  |
| PUT    | /api/orders/:id  | Order ka status update karna       |
| POST   | /api/contact     | Contact message bhejna (MongoDB mein save) |
| GET    | /api/contacts    | Sab contact messages dekhna        |

## Folder Structure

```
green-bites-backend/
  server.js          -> backend server code
  package.json        -> project dependencies
  .env                 -> environment variables (MONGO_URI, BREVO keys, PORT)
  .env.example         -> .env ka sample/template
  models/
    Order.js            -> MongoDB order schema
    Contact.js           -> MongoDB contact schema
  public/
    index.html          -> website ka frontend (yehi browser mein khulta hai)
```

## .env file

`.env` file mein server ki settings hain:

```
PORT=3000

MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/greenbites?retryWrites=true&w=majority

BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=noreply@greenbites.com
BREVO_SENDER_NAME=Green Bites
BREVO_RECEIVER_EMAIL=owner@greenbites.com
```

Agar aap server ka port change karna chahain, to `.env` file mein `PORT` ki
value badal dein (jaise `PORT=4000`) aur server restart kar dein.

## Brevo Email Setup (Order aur Contact ki email notification)

Jab bhi koi order ya contact message submit karega, backend automatically
**Brevo** ke zariye ek notification email bhej dega. Isay activate karne ka tarika:

1. https://www.brevo.com par free account banayein (agar nahi hai).
2. Dashboard mein jayein: **Settings → SMTP & API → API Keys**.
3. Ek naya API key generate karein aur copy kar lein.
4. `.env` file kholein aur values bharein:
   - `BREVO_API_KEY` — apni copy ki hui API key yahan paste karein
   - `BREVO_SENDER_EMAIL` — Brevo mein verify ki hui sender email
   - `BREVO_SENDER_NAME` — jo naam email mein "from" ki tarah dikhna chahiye
   - `BREVO_RECEIVER_EMAIL` — jahan aap orders/messages ki notification receive karna chahtay hain
5. Server dobara start karein (`npm start`).

Agar `BREVO_API_KEY` set nahi ki gayi to server phir bhi normally kaam karega —
bas email notification nahi bhejega. MongoDB mein order/contact data phir bhi save hota rahega.

Frontend ki images ab bhi internet se live load hoti hain (TheMealDB, Wikipedia,
Foodish APIs), isliye server chalane ke waqt internet connection zaroor honi chahiye.
