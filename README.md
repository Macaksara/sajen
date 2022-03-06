# sajen
Mungkin sebuah bahasa Pemrogramman berbasis pada Javascript yang menggunakan Bahasa Jawa sebagai sintax di dalamnya...

**sajen** mempunyai extensi .sj atau anda dapat langsung menjalankan kode menggunakan file javascript.

[DOKUMENTASI](https://sajen.macaksara.tech) - Contoh, perbedaan sintax dll...

# Instalasi
```cli
npm i --save sajen
```

atau install secara global untuk dapat menjalankan file sj langsung...

```cli
npm i -g sajen
```

# Permulaan
- CLI

```cli
~$ sajen run <nama file atau lokasi file>

untuk menu bantuan:
~$ sajen -h
```

- API
  * Compile

  ```js
  const sajen = require('sajen');

  var code = `
    fungsi haloDunya() {
      tulis('hello world')
    }

    haloDunya()
  `;

  sajen.compile(code).then(compiled => {
    console.log(compiled)
  })
  ```

  * Run

  ```js
  const sajen = require('sajen');

  var code = `
    fungsi haloDunya() {
      tulis('hello world')
    }

    haloDunya()
  `;

  (async() => {
    await sajen.run(code)
  })()
  ```

# Hello world
```js
tulis('hello world')
```

# Dokumentasi
Lihat semua perbedaan antara *sajen* dan *javascript* atau melihat lihat contoh dan cara penggunaan *sajen* di [SINI](https://sajen.macaksara.tech)

# Added

- Ubah semua fungsi dalam bahsa indonesia ke jawa.
- `tulisInfo('pesan')` - Print indikator info ke console langsung tanpa memakai `tulis()`.
- `tulisSukses('pesan')` - Print indikator sukses ke console langsung tanpa memakai `tulis()`.
- `tulisPengetan('pesan')` - Print indikator peringatan ke console langsung tanpa memakai `tulis()`.
- `tulisEror('pesan')` - Print indikator eror ke console langsung tanpa memakai `tulis()`.
- `njupuk('url')` - Metode **GET** seperti menggunakan **Axios**.
- `kirim('url')` - Metode **POST** seperti menggunakan **Axios**.
- `werna.<ireng | abang | ijo | kuning | biru | magenta | cyan | putih | abuAbu | lmIreng | lmAbang | lmIjo | lmKuning | lmBiru | lmMagenta | lmCyan | lmPutih>('Pesan')` - Membuat konsol jadi berwana... dengan `tulis(werna.<warna>('Pesan yang di warnai'))`

# Credits
- [Jawaskrip Repository](https://github.com/Jawaksrip/jawaskrip) - [indmind](https://github.com/indmind)
