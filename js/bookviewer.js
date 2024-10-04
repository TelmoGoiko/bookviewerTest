export class BookViewer {

    constructor(data, base) {
        this.base = base;
        this.search_base = 'https://openlibrary.org/search.json?isbn=';
        this.data = data;
        this.index = 0;

        this.irudia = document.getElementById("irudia");
        this.egilea = document.getElementById("egilea");
        this.izenburua = document.getElementById("izenburua");
        this.dataElem = document.getElementById("data");
        this.isbn = document.getElementById("isbn");
        this.liburuKopuru = document.getElementById("liburuKopuru");

        this.initButtons();
        this.updateView();
    }

    initButtons() {
        // aurrera, atzera eta bilatu botoiak hasieratu
        // bilatu botoia sakatzean, erabiltzaileak sartu duen isbn-a duen liburua lortu
        // eta handleSearchData funtzioa exekutatu
        let aurrekoa = document.getElementById("atzera");
        let hurrengoa = document.getElementById("aurrera");
        let bilatu = document.getElementById("bilatu");
        
        aurrekoa.onclick = () => this.prevBook();
        hurrengoa.onclick = () => this.nextBook();
        bilatu.onclick = () => {
            let isbn = this.isbn.value;
            fetch(this.search_base + isbn)
                .then(response => response.json())
                .then(this.handleSearchData);
        };
    }

    extractBookData = (book) => {
        // json objektu egoki bat bueltatu, zure webgunean erabili ahal izateko

        let liburua = {
            egilea: book.author_name ? book.author_name[0] : "Egilea ezezaguna",
            izenburua: book.title ? book.title : "Izenburua ezeaguna",
            data: book.publish_date ? book.publish_date[0] : "Data ezezaguna",
            isbn: book.isbn ? book.isbn[0] : "ISBN ezezaguna",
            filename: book.cover_i ? book.cover_i + "-L.jpg" : "cover.jpg"
        };
        return liburua;
    }
      
    addBookToData = (book, data) => {
        // data array-ean sartu liburua, eta liburu berriaren posizioa bueltatu
        data.push(book);
        return data.length - 1;
    };

    handleSearchData = (data) => {
        // lortu liburua data objektutik
        // extractBookData eta addBookToData funtzioak erabili, indizea berria lortuz
        // updateView funtzioa erabili, liburu berria bistaratzeko
        let book = this.extractBookData(data.docs[0]);
        let index = this.addBookToData(book, this.data);
        this.index = index;
        this.updateView();
    };

    updateView() {
        // liburuaren datu guztiak bistaratu
        // liburu kopurua bistaratu
        let book = this.data[this.index];
        this.irudia.src = this.base + book.filename;
        this.egilea.value = book.egilea;
        this.izenburua.value = book.izenburua;
        this.dataElem.value = book.data;
        this.isbn.value = book.isbn;
        this.liburuKopuru.value = this.data.length;
    }

    nextBook() {
        // Hurrengo indizea lortu eta updateView funtzioa erabili bistaratzeko
        // ez ezazu liburu kopurua gainditu
        if(this.data.length - 1 > this.index) {
            this.index++;
        }
        this.updateView();
    }

    prevBook() {
        // Aurreko indizea lortu eta updateView funtzioa erabili bistaratzeko
        // ez ezazu 0 indizea gainditu
        if(0 < this.index) {
            this.index--;
        }
        this.updateView();
    }
}
