const fs = require("fs");
const beautify = require("js-beautify").js_beautify;

const { constant, symbol, handler, keyword } = require("./types");

const {
  info,
  logExec,
  chalk: { gray }
} = require("./utils");

class Tokenizer {
  constructor() {
    this.error;
    this.tokens = [];
  }

  add(type, value, line) {
    this.tokens.push({ type, value, line });
  }

  tokenize(code, callback) {
    logExec("tokenizer.Tokenizer.tokenize");

    let index = 0;
    let lineNumber = 1;

    info(
      "Tokenizer.tokenize",
      "start tokenizing, code length:",
      gray(code.length)
    );

    while (index < code.length) {
      if (this.error) break;

      const currentChar = code[index];
      const lastKey = this.tokens[this.tokens.length - 1];
      let lastTokenIsKeyword = false;

      if (lastKey != undefined) {
        if (
          Object.keys(keyword).includes(
            this.tokens[this.tokens.length - 1].value.toUpperCase()
          )
        ) {
          lastTokenIsKeyword = true;
        }
      }

      // cek newline
      if (currentChar == "\n") {
        this.add(constant.NEWLINE, currentChar, lineNumber);

        lineNumber++;
      } else if (currentChar == " " || currentChar == String.fromCharCode(13));
      else if (!currentChar.isEmpty() && !isNaN(currentChar)) {
        // Integer
        let number = "";
        while (!isNaN(code[index])) {
          number += code[index++];
        }
        index--;
        this.add(constant.NUM, number, lineNumber);
      } else if (currentChar.isAlphaNumeric() || currentChar == "_") {
        //Kata dan Keyword
        let word = "";

        while (
          index < code.length &&
          (code[index].isAlphaNumeric() ||
            code[index] == "" ||
            code[index] == "_")
        ) {
          word += code[index++];
        }
        index--;

        // cek jika token terakhir bukan keyword
        if (handler.includes(word) && !lastTokenIsKeyword) {
          let key = word;

          while (code[index] != ")" && index < code.length) {
            key += code[++index];
          }

          this.add(word.toUpperCase(), key, lineNumber);
        } else if (word == "ngimpor" && !lastTokenIsKeyword) {
          let expression = word;

          while (
            !(code[index] == ";" || code[index] == "\n") &&
            index < code.length
          ) {
            expression += code[++index];
          }

          this.add(word.toUpperCase(), expression, lineNumber);
        } else if (word == "yaiku") {
          this.add(constant.IS, symbol.IS, lineNumber);
        } else if (word == "var")
          this.add(constant.VAR, keyword.VAR, lineNumber);
        else if (word == "mlebetaken")
          this.add(constant.INPUT, keyword.INPUT, lineNumber);
        else if (word == "fungsi")
          this.add(constant.FUNCTION, keyword.FUNCTION, lineNumber);
        else if (word == "kelas")
          this.add(constant.CLASS, keyword.CLASS, lineNumber);
        else if (word == "konstruksi" || word == "konstruktor")
          this.add(constant.CONSTRUCT, keyword.CONSTRUCT, lineNumber);
        else if (word == "turunan")
          this.add(constant.EXTENDS, keyword.EXTENDS, lineNumber);
        else if (word == "anyar" || word == "damel")
          this.add(constant.NEW, keyword.NEW, lineNumber);
        else if (word == "puniki")
          this.add(constant.THIS, keyword.THIS, lineNumber);
        else if (word == "wangsulaken")
          this.add(constant.RETURN, keyword.RETURN, lineNumber);
        else if (word == "Wicalan")
          this.add(constant.NUMBER, keyword.NUMBER, lineNumber);
        else if (word == "Teks")
          this.add(constant.STRING, keyword.STRING, lineNumber);
        else if (word == "yen") this.add(constant.IF, keyword.IF, lineNumber);
        else if (word == "liyane" || word == "sewalike")
          this.add(constant.ELSE, keyword.ELSE, lineNumber);
        else if (word == "nindakake")
          this.add(constant.DO, keyword.DO, lineNumber);
        else if (word == "sak")
          this.add(constant.WHILE, keyword.WHILE, lineNumber);
        else if (word == "kanggo")
          this.add(constant.FOR, keyword.FOR, lineNumber);
        else if (word == "ngenteni")
          this.add(constant.AWAIT, keyword.AWAIT, lineNumber);
        else if (word == "mboten" || word == "sanes")
          this.add(constant.NOT, symbol.NOT, lineNumber);
        else if (word == "lan") this.add(constant.AND, symbol.AND, lineNumber);
        else if (word == "utawi" || word == "utawa")
          this.add(constant.OR, symbol.OR, lineNumber);
        else if (
          word == "tulis" ||
          word == "nulis" ||
          word == "tampilken" ||
          word == "nyetak"
        )
          this.add(constant.PRINT, keyword.PRINT, lineNumber);
        else if (word == "melbetaken")
          this.add(constant.INPUT, keyword.INPUT, lineNumber);
        else if (word == "bener" || word == "leres")
          this.add(constant.TRUE, keyword.TRUE, lineNumber);
        else if (word == "lepat" || word == "salah")
          this.add(constant.FALSE, keyword.FALSE, lineNumber);
        else if (word == "+" || word == "ditambahake")
          // teks operator

          this.add(constant.PLUS, symbol.PLUS, lineNumber);
        else if (word == "-" || word == "disuda")
          this.add(constant.MINUS, symbol.MINUS, lineNumber);
        else if (
          word == "*" ||
          word == "diping" ||
          word == "pingna" ||
          word == "ping"
        )
          this.add(constant.TIMES, symbol.TIMES, lineNumber);
        else if (word == "/" || word == "dipunperang" || word == "dibagi")
          this.add(constant.DIVIDE, symbol.DIVIDE, lineNumber);
        else if (word == "%" || word == "modulo")
          // bingung sy apa kramanya
          this.add(constant.MOD, symbol.MOD, lineNumber);
        else if (
          word == "<=" ||
          word == "kirangsaking" ||
          word == "kirangSaking"
        )
          this.add(constant.LESS, symbol.LESS, lineNumber);
        else if (
          word == ">=" ||
          word == "langkungsaking" ||
          word == "langkungSaking"
        )
          this.add(constant.GREATER, symbol.GREATER, lineNumber);
        else if (word == "==" || word == "samikalih" || word == "samiKalih")
          this.add(constant.EQUAL, symbol.EQUAL, lineNumber);
        else if (word == "mandeg" || word == "mandheg")
          this.add(constant.BREAK, keyword.BREAK, lineNumber);
        else if (word == "lumpati")
          this.add(constant.CONTINUE, keyword.CONTINUE, lineNumber);
        else if (word == "ingpo" || word == "info" || word == "tulisinfo" || word == "tulisInfo")
          this.add(constant.INGPO, keyword.INGPO, lineNumber)
        else if (word == "sukses" || word == "tulissukses" || word == "tulisSukses")
          this.add(constant.SUCCESS, keyword.SUCCESS, lineNumber)
        else if (word == "pengetan" || word == "peringatan" || word == "tulispengetan" || word == "tulisPengetan" || word == "tulisperingatan" || word == "tulisPeringatan")
          this.add(constant.WARN, keyword.WARN, lineNumber)
        else if (word == "eror" || word == "kesalahan" || word == "tuliseror" || word == "tulisEror")
          this.add(constant.ERROR, keyword.ERROR, lineNumber)
        else if (word == "get" || word == "njaluk" || word == "njupuk" || word == "GET" || word == "NJALUK" || word == "NJUPUK")
          this.add(constant.GET, keyword.GET, lineNumber)
        else if (word == "post" || word == "kirim" || word == "POST" || word == "KIRIM")
          this.add(constant.POST, keyword.POST, lineNumber)
        else if (word == "werna" || word == "warna")
          this.add(constant.WARNA, keyword.WARNA, lineNumber)

        // bukan keyword kemungkinan nama variabel
        else this.add(constant.VARNAME, word, lineNumber);
      } else if (currentChar == "/" && code[index + 1] == "/") {
        // comment
        let comment = "";

        while (code[index] != "\n" && index < code.length) {
          comment += code[index++];
        }

        this.add(constant.COMMENT, `\n${comment}\n`, lineNumber);
      } else if (currentChar == "/" && code[index + 1] == "*") {
        // multi line comment
        let comment = "";

        while (
          !(code[index] === "*" && code[index + 1] === "/") &&
          index < code.length
        ) {
          comment += code[index++];
        }
        index++;
        this.add(constant.COMMENT, `\n${comment}*/\n`, lineNumber);
      } else if (currentChar == "+" || currentChar == "-") {
        // postfix or prefix
        let expression = currentChar;
        if (currentChar == code[index + 1]) {
          expression += code[index + 1];

          this.add(constant.PFIX, expression, lineNumber);

          index++;
        } else if (code[index + 1] == "=") {
          expression += code[index + 1];

          this.add(constant.ASSIGNMENT, expression, lineNumber);
        } else {
          this.add(
            expression == "+" ? constant.PLUS : constant.MINUS,
            expression,
            lineNumber
          );
        }
      } else if ("*/%".includes(currentChar)) {
        let assignment = currentChar;

        if (code[index + 1] == "=") {
          assignment += code[index + 1];

          this.add(constant.ASSIGNMENT, assignment, lineNumber);

          index++;
        } else {
          this.add(constant.ARITHMATIC, currentChar, lineNumber);
        }
      } else if (currentChar == "<" || currentChar == ">") {
        if (code[index + 1] == "=") {
          this.add(
            currentChar == ">" ? constant.GTOQ : constant.LTOQ,
            currentChar + "=",
            lineNumber
          );
          index++;
        } else if (currentChar == "<")
          this.add(constant.LESS, currentChar, lineNumber);
        else this.add(constant.GREATER, currentChar, lineNumber);
      } else if (currentChar == "=") {
        // cek jika = bagian dari pfix
        if ("-+*/%".includes(code[index - 1])) {
          index++;
        } else if (code[index + 1] == ">") {
          this.add(constant.ARROW, currentChar + code[index + 1], lineNumber);
          index++;
        } else if (code[index + 1] == "=") {
          this.add(constant.IS, symbol.IS, lineNumber);
          index++;
        } else {
          this.add(constant.ASSIGN, currentChar, lineNumber);
        }
      } else if (
        ["|", "&"].includes(currentChar) &&
        code[index + 1] === currentChar
      ) {
        const type = currentChar === "|" ? "OR" : "AND";

        this.add(constant[type], symbol[type], lineNumber);

        index++;
      } else if (currentChar == ".")
        // Penutup
        this.add(constant.DOT, currentChar, lineNumber);
      else if (currentChar == ",")
        this.add(constant.COMMA, currentChar, lineNumber);
      else if (currentChar == ":")
        this.add(constant.COLON, currentChar, lineNumber);
      else if (currentChar == ";")
        this.add(constant.SCOLON, currentChar, lineNumber);
      else if (currentChar == "(")
        this.add(constant.LPAREN, currentChar, lineNumber);
      else if (currentChar == ")")
        this.add(constant.RPAREN, currentChar, lineNumber);
      else if (currentChar == "{")
        this.add(constant.LBRACE, currentChar, lineNumber);
      else if (currentChar == "}")
        this.add(constant.RBRACE, currentChar, lineNumber);
      else if (`'"\``.includes(currentChar)) {
        // String
        index++;
        let quote = "";

        while (code[index] != currentChar) {
          quote += code[index++];

          if (index >= code.length) {
            this.throwError(lineNumber, "Tanda Kutip Tidak Terselesaikan");
            break;
          }
        }

        this.add(
          constant.QUOTE,
          `${currentChar}${quote}${currentChar}`,
          lineNumber
        );
      } else this.add(constant.UNKNOWN, currentChar, lineNumber);

      index++;

      if (index == code.length && !this.error) {
        info(
          "Tokenizer.tokenize",
          "done tokenizing, tokens length:",
          gray(this.tokens.length)
        );

        return callback(this.tokens, null);
      }
    }

    return callback("", this.error);
  }
  throwError(line, mess) {
    info("Tokenizer.error", "error:", `${line}):${mess}`);
    this.error = new Error(`Error: (${line}):\n${mess}`);
  }
}

exports.lex = (filepath, callback) => {
  logExec("tokenizer.lex");

  const code = beautify(fs.readFileSync(filepath, "utf8"), {
    end_with_newline: true
  });

  this.lexString(code, callback);
};

exports.lexString = (code, callback) => {
  logExec("tokenizer.lexString");
  new Tokenizer().tokenize(code, callback);
};

String.prototype.isEmpty = function() {
  return this.length === 0 || !this.trim();
};

String.prototype.isAlphaNumeric = function() {
  let code, index, length;

  for (index = 0, length = this.length; index < length; index++) {
    code = this.charCodeAt(index);

    if (!(code > 64 && code < 91) && !(code > 96 && code < 123)) {
      return false;
    }
  }

  return true;
};
