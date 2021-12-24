const grid = document.querySelector('#container');

const playerFactory = (isim, sembol,soyut) => {
    return { isim, sembol ,soyut}
};

const Player1 = playerFactory(`1`, `X`,1);
const Player2 = playerFactory(`2`, `O`,-1);
const PlayerAI = playerFactory(`AI`, `O`,-1);


const tahtamiz = (function tahtaOlustur() {
    let currentPlayer = Player1;
    let Tahta = [[,,], [,,], [,,]];
    let TahtaSoyut = [[0,0,0], [0,0,0], [0,0,0]];
    const boyut = 3;
    // tahtaTemizle();
    for (let i = 0; i < boyut; i++) {
        let hucreSatiri = document.createElement('div');
        hucreSatiri.classList.add('hucreSatiri');
        hucreSatiri.classList.add('unselectable');
        hucreSatiri.setAttribute(`draggable`, "false");
        for (let j = 0; j < boyut; j++) {
            let hucre = document.createElement('div');
            hucre.classList.add('hucre');
            hucre.setAttribute(`data-satir`, i);
            hucre.setAttribute(`data-sutun`, j);
            hucre.classList.add('unselectable');
            hucre.setAttribute(`draggable`, "false");
            hucre.style.cssText = `width: ${100 / boyut}%`;
            hucreSatiri.appendChild(hucre);
        }
        grid.appendChild(hucreSatiri);
    }
    const hucreler = document.querySelectorAll('.hucre');
    hucreler.forEach((hucreYeri) => {
        hucreYeri.addEventListener('click', sekilkoy);
        hucreYeri.addEventListener("contextmenu", (e) => { e.preventDefault(); return false; });
    });
    tahtayiYenile();

    function sekilkoy(e) {
        if (TahtaSoyut[e.target.dataset.satir][e.target.dataset.sutun] === 0){
            Tahta[e.target.dataset.satir][e.target.dataset.sutun] = currentPlayer.sembol;
            TahtaSoyut[e.target.dataset.satir][e.target.dataset.sutun] = currentPlayer.soyut;
            tahtayiYenile();
            zaferKontrolu();
            
            if (currentPlayer === Player1) {
                currentPlayer = Player2;
            }
            else {
                currentPlayer = Player1;
            }
        }
    }

    function tahtayiYenile() {
        hucreler.forEach((hucreYeri) => {
            hucreYeri.textContent = Tahta[hucreYeri.dataset.satir][hucreYeri.dataset.sutun];
        });
    }

    function tahtaTemizle(){
        Tahta = [[,,], [,,], [,,]];
        currentPlayer = Player1;
        tahtayiYenile();
    }
    function zaferKontrolu() {
        // for (let i = 0; i < boyut; i++) {
        //     if (TahtaSoyut)
        // }
        // for (let i = 0; i < boyut; i++) {

        // }
    }
    return {tahtaTemizle};
})();



// tahtaOlustur();