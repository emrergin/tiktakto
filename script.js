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
    
    // YAPAY ZEKA BURADA GIZLI====================================
    function eniyiHamleyiYapStr(tahtaStr){
        let eniyiHamle=-1;
        let enIyiDeger=1000;
        for (let i = 0; i < 9; i++){           
            if (tahtaStr.charAt(i)===`-`){
                tahtaStr=tahtaStr.slice(0,i)+`O`+tahtaStr.slice(i+1);
                if (DegerHesaplamaStr(tahtaStr,1,1)<enIyiDeger){
                    enIyiDeger=DegerHesaplamaStr(tahtaStr,1,1);
                    eniyiHamle=i;
                }
                tahtaStr=tahtaStr.slice(0,i)+`-`+tahtaStr.slice(i+1);                
            }                  
        }
        return [Math.floor(eniyiHamle/3),eniyiHamle%3];
    }
    
    function HucreDegerlesene(tahtaStr){
        let HucreDegerleri=[[,,],[,,],[,,]];
        for (let i = 0; i < 9; i++){           
            if (tahtaStr.charAt(i)===`-`){
                tahtaStr=tahtaStr.slice(0,i)+`O`+tahtaStr.slice(i+1);
                HucreDegerleri[Math.floor(i/3)][i%3]=DegerHesaplamaStr(tahtaStr,-1,1);
                tahtaStr=tahtaStr.slice(0,i)+`-`+tahtaStr.slice(i+1);                
            }                  
        }
        return HucreDegerleri;
    }
    
    function DegerHesaplamaStr(mevcutTahta,kisi,num){
        let enOptDeger=-kisi*1000;
    
        if(typeof durumDegeriStr(mevcutTahta)==="number"){
            return durumDegeriStr(mevcutTahta)-kisi*10*num;
        }
        else {
            if (kisi===1){
                for (let i = 0; i < 9; i++){           
                    if (mevcutTahta.charAt(i)===`-`){
                        mevcutTahta=mevcutTahta.slice(0,i)+`X`+mevcutTahta.slice(i+1);
                        // console.log(mevcutTahta);
                        enOptDeger=Math.max(enOptDeger,DegerHesaplamaStr(mevcutTahta,-kisi,num+1));
                        mevcutTahta=mevcutTahta.slice(0,i)+`-`+mevcutTahta.slice(i+1);                
                    }                  
                }
            }
            if (kisi===-1){
                for (let i = 0; i < 9; i++){           
                    if (mevcutTahta.charAt(i)===`-`){
                        mevcutTahta=mevcutTahta.slice(0,i)+`O`+mevcutTahta.slice(i+1);
                        enOptDeger=Math.min(enOptDeger,DegerHesaplamaStr(mevcutTahta,-kisi,num+1));
                        mevcutTahta=mevcutTahta.slice(0,i)+`-`+mevcutTahta.slice(i+1);                
                    }                  
                }
            }
        
            return enOptDeger-kisi*10*num;
        }
    }    
    
    let cephelerStr=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    function durumDegeriStr(strTahta){    
        for (let i = 0; i < 8; i++) {
            if(strTahta.charAt(cephelerStr[i][0])===strTahta.charAt(cephelerStr[i][1])&& strTahta.charAt(cephelerStr[i][0])===strTahta.charAt(cephelerStr[i][2]) &&  strTahta.charAt(cephelerStr[i][0])===`X`){
                return 100;
            }                
            else if(strTahta.charAt(cephelerStr[i][0])===strTahta.charAt(cephelerStr[i][1])&& strTahta.charAt(cephelerStr[i][0])===strTahta.charAt(cephelerStr[i][2]) &&  strTahta.charAt(cephelerStr[i][0])===`O`){
                return -100;
            }                
        }
        if (strTahta.indexOf(`-`)===-1){
            return 0;
        }
    }
    function makeaString(stringOlmayan){
        let sonuc=``;
        for (let i = 0; i < 3; ++i){
            for (let j = 0; j < 3; ++j){
                if (stringOlmayan[i][j]===0){
                    sonuc+=`-`;
                }
                if (stringOlmayan[i][j]===1){
                    sonuc+=`X`;
                }
                if (stringOlmayan[i][j]===-1){
                    sonuc+=`O`;
                }
            }
        }
        return sonuc;
    }
    
    function SiradakiHamle(){
        if (!((TahtaSoyut[0].some(item => item === 0)||TahtaSoyut[1].some(item => item === 0)||TahtaSoyut[2].some(item => item === 0)))&&OyunModu===1){
            oyunSonu(2);
            return;
        }
            
        if (currentPlayer===PlayerAI && OyunModu===1){
            let oyunyeri=eniyiHamleyiYapStr(makeaString(TahtaSoyut));
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

    return {tahtaTemizle};
})();
