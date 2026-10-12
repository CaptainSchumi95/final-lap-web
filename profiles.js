// Upraviteľné medailóny. Roly sú výhradne z THE FINAL LAP - Titulky.xlsx.
// Nový medailón pridajte až po overení jeho životopisných informácií.
const profiles = {
  alex: {
    name: 'Alex Koníček',
    role: 'Réžia, scenár, strih · Tomáš Targa',
    bio: 'Filmový, divadelný a dabingový herec. Účinkoval v projektoch Zrada, Nikdy nehovor nikdy a Hniezdo. Jeho dabingové skúsenosti zahŕňajú filmy Rodinka Úžasných 2 a Luca; na javisku sa predstavil v inscenáciách Mamma Mia a Pomáda. V The Final Lap prepája tvorbu filmu s hlavnou hereckou úlohou.',
    source: 'LAP.pdf (medailón); aktuálne titulky (roly)',
    sourceUrl: null
  },
  michal: {
    name: 'Michal Vilim',
    role: 'Koprodukcia, námet, odborná pomoc, marketing a dizajn, jazdecké zastupovanie · Viktor Majer',
    bio: 'Aktívny motokárový pretekár, šéftréner a zakladateľ MAX60 Academy. Mladým jazdcom odovzdáva skúsenosti z trate aj prístup k taktike a mentálnej príprave. V roku 2019 reprezentoval Slovensko na FIA Motorsport Games v Ríme. Do filmu prináša skúsenosti zo skutočných pretekov a stvárňuje Viktora Majera.',
    source: 'MAX60 Academy a dodané snímky medailónu',
    sourceUrl: 'https://www.max60.academy/#treneri'
  },
  samuel: {
    name: 'Samuel Švehla',
    role: 'Námet, scénografia, praktické efekty · Milanko',
    bio: 'K filmovej tvorbe sa dostal cez školské projekty, na ktorých sa podieľal ako režisér, scenárista alebo kameraman. Zúčastnil sa aj európskej súťaže Concurso de Cortometrajes. V The Final Lap sa podieľa na námete, scénografii a praktických efektoch a pred kamerou vystupuje ako Milanko.',
    source: 'LAP.pdf (medailón); aktuálne titulky (roly)',
    sourceUrl: null
  },
  pavla: {
    name: 'Pavla Marková',
    role: 'Herecké obsadenie · Lucka',
    bio: 'Vo filme The Final Lap stvárňuje postavu Lucky.',
    photo: 'assets/pavla.webp',
    source: 'THE FINAL LAP – Titulky.xlsx',
    sourceUrl: null
  },

  // MEDAILÓNY NA DOPLNENIE: vyplňte bio a prípadne photo.
  "tomas-uhliarik": {
      "name": "Tomáš Uhliarik",
      "role": "Producent",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "ottakar-chlpik": {
      "name": "Ottakar Chlpík",
      "role": "Pilot FPV dronu",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "lukas-vyhnalik": {
      "name": "Lukas Vyhnalík",
      "role": "Šéf kamerového oddelenia",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "adam-jablonsky": {
      "name": "Adam Jablonský",
      "role": "Hlavný kameraman",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "jasmina-bombosova": {
      "name": "Jasmína Bombošová",
      "role": "Asistentka réžie",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "silvia-achbergerova": {
      "name": "Silvia Achbergerová",
      "role": "Kamera",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "matus-gastan": {
      "name": "Matúš Gaštan",
      "role": "Hlavný zvukár",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "martin-krchnavy": {
      "name": "Martin Krchnavý",
      "role": "Asistent kamery",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "jakub-svirloch": {
      "name": "Jakub Švirloch",
      "role": "Fotografie a zábery zo zákulisia",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "tomas-farkas": {
      "name": "Tomáš Farkaš",
      "role": "Zvukár",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "mikulas-zima": {
      "name": "Mikuláš Zima",
      "role": "Hlavný hudobný skladateľ",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "samuel-kmet": {
      "name": "Samuel Kmeť",
      "role": "Klapka",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "matej-franta": {
      "name": "Matej Franta",
      "role": "Asistent",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "timofei-gumin": {
      "name": "Timofei Gumin",
      "role": "Farebné korekcie",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "patrik-pal": {
      "name": "Patrik Pál",
      "role": "Zvuková mixáž",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "michal-letovanec": {
      "name": "Michal Letovanec",
      "role": "Jazdecké zastupovanie",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "erik-konicek": {
      "name": "Erik Koníček",
      "role": "Tomáš Targa (ml.)",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "andy-kummer": {
      "name": "Andy Kummer",
      "role": "Oliver Kubiš",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "patrik-toman": {
      "name": "Patrik Toman",
      "role": "Robo",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "michal-rovnak": {
      "name": "Michal Rovňák",
      "role": "Šéf",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "martin-pavelek": {
      "name": "Martin Pavelek",
      "role": "Chlapec",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "juraj-slovak": {
      "name": "Juraj Slovák",
      "role": "Juraj Slovák",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "viliam-musitz": {
      "name": "Viliam Mušitz",
      "role": "Okuliarnatý zamestnanec",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "sebastian-jati": {
      "name": "Sebastian Jati",
      "role": "Komentátor",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
  "pretekari-akademie-max60": {
      "name": "Pretekári Akadémie MAX60",
      "role": "Pretekári",
      "bio": "",
      "source": "Aktuálne filmové titulky",
      "sourceUrl": null
  },
};
