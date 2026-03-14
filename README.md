<<<<<<< HEAD
# Project-Manager
=======
<h1 align="center">Polygon</h1>

<p align="center">
  <img src="https://i.ibb.co/s3GcGm3/logo-black.png" alt="angular-logo" style="height:150px"/>
  <br>
  <em>Aplikacija za planiranje i upravljanje projektima</em>
  <br>
  <em><a href="http://softeng.pmf.kg.ac.rs:10162">http://softeng.pmf.kg.ac.rs:10162</a></em>
  <br>
  <hr>
</p>

<h1>Dokumentacija</h1>

<h2>Pokretanje aplikacije</h2>
<p>
  Za pokretanje aplikacije potrebno je instalirati:

  - <a href="https://www.mysql.com/">MySQL</a>

  - <a href="https://angular.io/start">Angular</a>

- <a href="https://dotnet.microsoft.com/en-us/download">.Net</a>
</p>

<h3>Debug verzija</h3>

Rad sa bazom:

- Pokrenuti mysql: 
  - podesiti konekcioni string kao u aplikaciji
  - napraviti bazu "si_baza"

- U team-polygon\src\back\api izvrsiti komande:
  - dotnet ef migrations add init
  - dotnet ef database update

Pokretanje web aplikacije:
  - U team-polygon\src\back\api izvrsiti komandu:
    - dotnet run

- Otvoriti terminal u team-polygon\src\front\web_app i pokrenuti komande:
    - npm ci
    - ng serve --o

<h3>Production verzija</h3>

Rad sa bazom:

- U team-polygon\src\back\api izvrsiti komandu:
  - dotnet ef migrations script --output /scipt/f_migration.sql

- Na serveru pokrenuti mysql: 
  - podesiti konekcioni string kao u aplikaciji
  - napraviti bazu "si_baza"
  - pokrenuti prethodno generisanu sql skriptu

Pokretanje web aplikacije:
  - U team-polygon\src\back\api izvrsiti komande:
    - dotnet publish -c Release -r linux-x64 -o ./publish
    - generisane fajlove okaciti na server i pokrenuti ./api

- Otvoriti terminal u team-polygon\src\front\web_app i pokrenuti komande:
    - npm ci
    - ng build --configuration=production  
    - generisane fajlove okaciti na server u folder public/
    - na server okaciti server.js i pokrenuti: 
      - node server.js

<h3>Kredencijali korisnika za testiranje</h3>

- Administrator 
  - username: admin pasword: admin

- Project Manager:
  - username: mmarko pasword: mmarko
  - username: kosta pasword: kosta

- User:
  - username: laki pasword: laki
  - username: vuk pasword: vuk
  - username: tamara pasword: tamara
  - username: tina pasword: tina

- Guest:
  - username: asistent1 pasword: asistent1
  - username: asistent2 pasword: asistent2

Uputstvo za testere se nalazi u doc/uputstvo_za_testere.pdf
    


>>>>>>> 2bfa17d (Push project)
