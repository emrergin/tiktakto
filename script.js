
const tahtamiz = (function anaModul() {
    const grid = document.querySelector('#container');

    const playerFactory = (isim, sembol,soyut) => {
        return { isim, sembol ,soyut}
    };

    const Player1 = playerFactory(`1. Oyuncu`, `X`,1);
    const Player2 = playerFactory(`2. Oyuncu`, `O`,-1);
    const PlayerAI = playerFactory(`Bilgisayar`, `O`,-1);
    const rbs = document.getElementsByName('mod');
    const yenidenBaslat=document.getElementById(`temizle`);

    function modSec(){
    let selectedValue;
    for (const rb of rbs) {
        if (rb.checked) {
            selectedValue = rb.value;
            return (selectedValue);
        }
    }
    }

    let OyunModu=2;
    function yenidenBaslatDegistir(){
        OyunModu===1? yenidenBaslat.textContent=`Yeniden!` : yenidenBaslat.textContent=`Başlat!`;
    }
    let currentPlayer = Player1;
    let Tahta = [[,,], [,,], [,,]];
    let TahtaSoyut = [[0,0,0], [0,0,0], [0,0,0]];
    let cepheler = [[[0,0],[0,1],[0,2]],[[1,0],[1,1],[1,2]],[[2,0],[2,1],[2,2]],[[0,0],[1,0],[2,0]],[[0,1],[1,1],[2,1]],[[0,2],[1,2],[2,2]],[[0,0],[1,1],[2,2]],[[2,0],[1,1],[0,2]]];
    const boyut = 3;

    // TAHTA OLUSTUR
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

    // OYUNCULARIN ISARET KOYMASI=====================================
    function sekilkoy(e) {
        if (TahtaSoyut[e.target.dataset.satir][e.target.dataset.sutun] === 0 && OyunModu===1){
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
    // MEVCUT ARRAYin TAHTAYA YAZILMASI=====================================
    function tahtayiYenile() {
        hucreler.forEach((hucreYeri) => {
            hucreYeri.textContent = Tahta[hucreYeri.dataset.satir][hucreYeri.dataset.sutun];
        });
    }

    function tahtaTemizle(){
        Tahta = [[,,], [,,], [,,]];
        TahtaSoyut = [[0,0,0], [0,0,0], [0,0,0]];
        currentPlayer = Player1;
        OyunModu=1;
        yenidenBaslatDegistir();
        tahtayiYenile();
        grid.style.display=`flex`;
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
                oyunSonu(1);
                break;
            }
        }
    }

    function getMin(a) {
        return Math.min(...a.map(e => Array.isArray(e) ? getMin(e) : e));
    }
    
    // YAPAY ZEKA BURADA GIZLI====================================
    function eniyiHamleyiYap(tahta){
        let eniyiHamle=[];
        let enIyiDeger=1000;

        for (let i = 0; i < boyut; i++) {            
            for (let j = 0; j < boyut; j++) {
                if (tahta[i][j]===0){
                    tahta[i][j]=-1;
                    if (DegerHesaplama(tahta,-1)<enIyiDeger)
                    {
                        enIyiDeger=DegerHesaplama(tahta,-1,1);
                        eniyiHamle=[i,j];
                    }
                    tahta[i][j]=0;
                }
            }
        }
        return eniyiHamle;
    }

    function durumDegeri(sonTahta){
        for (let i = 0; i < 8; i++) {
            if(sonTahta[cepheler[i][0][0]][cepheler[i][0][1]]+sonTahta[cepheler[i][1][0]][cepheler[i][1][1]]+
                sonTahta[cepheler[i][2][0]][cepheler[i][2][1]]===3)
                {return 100;}
            else if (sonTahta[cepheler[i][0][0]][cepheler[i][0][1]]+sonTahta[cepheler[i][1][0]][cepheler[i][1][1]]+
                sonTahta[cepheler[i][2][0]][cepheler[i][2][1]]===-3)
                {return -100;}                
        }
        if (!((sonTahta[0].some(item => item === 0)||sonTahta[1].some(item => item === 0)||sonTahta[2].some(item => item === 0)))){
            return 0;
        }
    }

    function DegerHesaplama(mevcutTahta,kisi,num){
        let enOptDeger=-kisi*1000;
        if(durumDegeri(mevcutTahta)){
            return durumDegeri(mevcutTahta);
        }
        else {
            for (let i = 0; i < boyut; i++){
                for (let j = 0; j < boyut; j++){
                    if (mevcutTahta[i][j]===0){
                        mevcutTahta[i][j]=kisi;
                        if (kisi===1){
                            enOptDeger=Math.max(enOptDeger,DegerHesaplama(mevcutTahta,-kisi,num+1));
                        }
                        else{
                            enOptDeger=Math.min(enOptDeger,DegerHesaplama(mevcutTahta,-kisi,num+1));
                        }
                        mevcutTahta[i][j]=0;                    
                    }    
                }               
            }
        }
        return enOptDeger;
    }        

    
    function SiradakiHamle(){
        if (!((TahtaSoyut[0].some(item => item === 0)||TahtaSoyut[1].some(item => item === 0)||TahtaSoyut[2].some(item => item === 0)))&&OyunModu===1){
            oyunSonu(2);
            return;
        }
            
        if (currentPlayer===PlayerAI && OyunModu===1){
            let oyunyeri=eniyiHamleyiYap(TahtaSoyut);
            console.log(oyunyeri);
            Tahta[oyunyeri[0]][oyunyeri[1]] = PlayerAI.sembol;
            TahtaSoyut[oyunyeri[0]][oyunyeri[1]] = PlayerAI.soyut;
            tahtayiYenile();
            zaferKontrolu();
            currentPlayer=Player1;
        }
    };

    function oyunSonu(num){
        switch(num){
            case 1:
                alert(currentPlayer.isim + " kazandı.");
                break;
            case 2:
                alert("Berabere! Yenişemediniz!");
                break;
        }
        OyunModu=2;
        yenidenBaslatDegistir();
    }

    return {tahtaTemizle,DegerHesaplama,TahtaSoyut,eniyiHamleyiYap};
})();

