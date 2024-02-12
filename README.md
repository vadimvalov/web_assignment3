# New Weather App

#### since i didn't get any feedback about the first one, i dunno what's the problem was with the first one, so i need to make another one from zero

## Installation

Clone repo and go

```
npm i
```

then do

```
node app.js
```

to launch the whole program. Now im not using any collector, so the link to the website is localhost:3000

## APIs used

### API KEYS COULD GET BANNED SO IT IS MUST HAVE TO CHECK IT ASAP (IM ALREADY GETTING WARNINGS FROM TimeZoneDB AT GMAIL)

1. OpenWeather API
2. Open-ER API (currency rate)
3. TimeZoneDB

#### currently NOT banned

## Routes explanation:

```
/history
```

to get history

---

```
/admin
```

to get to the admin panel

---

```
/admin/create
```

to create new user from admin panel and then go back to the /admin

---

```
/admin/update/:id
```

takes id and updating users info

---

```
/admin/delete/:id
```

deleting user from the database

---

```
/signup
```

renders signup page

---

```
/login
```

renders login page

---

```
/ping
```

pong

---

```
/weather/:city
```

takes city and an API key as a param and axiosing the OpenWeather

---

```
/signup
```

creates user when info submitted and writes the data to the database

---

```
/logout
```

session destroy

---

```
/auth/status
```

returning auth status (isAuthenticated bool)
