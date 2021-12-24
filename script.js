const grid = document.querySelector('#container');

const playerFactory = (isim, sembol,soyut) => {
    return { isim, sembol ,soyut}
};

const Player1 = playerFactory(`1`, `X`,1);
const Player2 = playerFactory(`2`, `O`,-1);
const PlayerAI = playerFactory(`AI`, `O`,-1);
const rbs = document.getElementsByName('mod');
function modSec(){
  let selectedValue;
  for (const rb of rbs) {
      if (rb.checked) {
          selectedValue = rb.value;
          return (selectedValue);
      }
  }
}
// let OyunModu=1;

const tahtamiz = (function tahtaOlustur() {
    let currentPlayer = Player1;
    let Tahta = [[,,], [,,], [,,]];
    let TahtaSoyut = [[0,0,0], [0,0,0], [0,0,0]];
    let cepheler = [[[0,0],[0,1],[0,2]],[[1,0],[1,1],[1,2]],[[2,0],[2,1],[2,2]],[[0,0],[1,0],[2,0]],[[0,1],[1,1],[2,1]],[[0,2],[1,2],[2,2]],[[0,0],[1,1],[2,2]],[[2,0],[1,1],[0,2]]];
    // let cephePuanlari=[0,0,0,0,0,0,0,0];
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
                if (modSec()===`insan`){            
                    currentPlayer = Player2;
                }
                else{
                    currentPlayer = PlayerAI;
                }
            }
            else {
                currentPlayer = Player1;
            }
        }
        SiradakiHamle();
    }

    function tahtayiYenile() {
        hucreler.forEach((hucreYeri) => {
            hucreYeri.textContent = Tahta[hucreYeri.dataset.satir][hucreYeri.dataset.sutun];
        });
    }

    function tahtaTemizle(){
        Tahta = [[,,], [,,], [,,]];
        TahtaSoyut = [[0,0,0], [0,0,0], [0,0,0]];
        currentPlayer = Player1;
        tahtayiYenile();
    }
    
    function cephePuaniHesapla(){
        let cephePuanlari=[0,0,0,0,0,0,0,0];
        for (let i = 0; i < 8; i++) {
            cephePuanlari[i]=TahtaSoyut[cepheler[i][0][0]][cepheler[i][0][1]]+TahtaSoyut[cepheler[i][1][0]][cepheler[i][1][1]]+TahtaSoyut[cepheler[i][2][0]][cepheler[i][2][1]];
        }
        return cephePuanlari;
    }
    function zaferKontrolu() {
        let cPuan=cephePuaniHesapla();
        for (let i = 0; i < 8; i++) {
            if (Math.abs(cPuan[i])===3)
            {
                alert(currentPlayer.isim + ". oyuncu kazandı.");
            }
        }
    }
    function getMax(a) {
        return Math.max(...a.map(e => Array.isArray(e) ? getMax(e) : e));
     }
     
    function hucreDegerleme(){
        let cPuan=cephePuaniHesapla();
        let degerArray=[[0,0,0],[0,0,0],[0,0,0]];
        let eniyiHamle=[];
        for (let i = 0; i < 8; i++) {
            degerArray[cepheler[i][0][0]][cepheler[i][0][1]]+=cPuan[i]+0.1;
            degerArray[cepheler[i][1][0]][cepheler[i][1][1]]+=cPuan[i]+0.1;
            degerArray[cepheler[i][2][0]][cepheler[i][2][1]]+=cPuan[i]+0.1;
        }
        for (let i = 0; i < boyut; i++) {            
            for (let j = 0; j < boyut; j++) {
                if (TahtaSoyut[i][j]!==0){
                    degerArray[i][j]=-100;
                }
            }
        }
        let maxDeger=getMax(degerArray);
        for (let i = 0; i < boyut; i++) {            
            for (let j = 0; j < boyut; j++) {
                if (degerArray[i][j]===maxDeger){
                //    document.querySelector(`[data-satir="${i}"][data-sutun="${j}"]`).classList.add('dusunulen');
                eniyiHamle.push([i,j]);
                }
            }
        }
        return eniyiHamle[Math.floor(Math.random() * eniyiHamle.length)]
    }
    
    function SiradakiHamle(){
    if (currentPlayer===PlayerAI){
        oyunyeri=hucreDegerleme();
        console.log(oyunyeri);
        Tahta[oyunyeri[0]][oyunyeri[1]] = PlayerAI.sembol;
        TahtaSoyut[oyunyeri[0]][oyunyeri[1]] = PlayerAI.soyut;
        tahtayiYenile();
        zaferKontrolu();
        currentPlayer=Player1;
    }};

    return {tahtaTemizle,SiradakiHamle};
})();

