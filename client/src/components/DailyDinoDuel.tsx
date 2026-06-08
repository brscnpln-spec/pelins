import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Star, Shield, RotateCcw } from "lucide-react";

interface Duel {
  id: string;
  dinoA: string;
  dinoB: string;
  winner: string;
  explanationCorrect: string;
  explanationWrong: string;
  funFact: string;
}

const DUELS: Duel[] = [
  {
    id: "trex-vs-diplodocus",
    dinoA: "T. rex", dinoB: "Diplodocus", winner: "T. rex",
    explanationCorrect: "Harika! T. rex, güçlü çenesiyle bu düelloda üstünlük sağladı.",
    explanationWrong: "İyi deneme! Diplodocus devasa büyüklükteydi, ama T. rex bugün daha güçlüydü.",
    funFact: "T. rex'in ısırma gücü, karada yaşamış en güçlü ısırıklardan biriydi.",
  },
  {
    id: "ankylosaurus-vs-allosaurus",
    dinoA: "Ankylosaurus", dinoB: "Allosaurus", winner: "Ankylosaurus",
    explanationCorrect: "Mükemmel! Ankylosaurus'un zırhı ve güçlü kuyruğu onu korudu.",
    explanationWrong: "Güzel deneme! Allosaurus hızlıydı, ama Ankylosaurus'un zırhı çok güçlüydü.",
    funFact: "Ankylosaurus'un kuyruk tokmağı bir araba kadar ağırdı.",
  },
  {
    id: "triceratops-vs-velociraptor",
    dinoA: "Triceratops", dinoB: "Velociraptor", winner: "Triceratops",
    explanationCorrect: "Süper! Triceratops'un üç boynuzu ve kalkan kafası onu kazandırdı.",
    explanationWrong: "İyi fikir! Velociraptor zekiydi, ama Triceratops çok daha büyüktü.",
    funFact: "Triceratops'un kafasındaki kalkan 2 metre genişliğe ulaşabilirdi.",
  },
  {
    id: "spinosaurus-vs-carnotaurus",
    dinoA: "Spinosaurus", dinoB: "Carnotaurus", winner: "Spinosaurus",
    explanationCorrect: "Harika! Spinosaurus boyutu ve gücüyle bu düelloda öne geçti.",
    explanationWrong: "Güzel deneme! Carnotaurus hızlıydı, ama Spinosaurus çok daha büyüktü.",
    funFact: "Spinosaurus, T. rex'ten daha uzun olan en büyük etçil dinozordu.",
  },
  {
    id: "stegosaurus-vs-ceratosaurus",
    dinoA: "Stegosaurus", dinoB: "Ceratosaurus", winner: "Stegosaurus",
    explanationCorrect: "Bravo! Stegosaurus'un dikenli kuyruğu Ceratosaurus'u uzak tuttu.",
    explanationWrong: "İyi deneme! Ceratosaurus cesurdu, ama Stegosaurus'un dikenleri çok tehlikeliydi.",
    funFact: "Stegosaurus'un sırtındaki levhalar vücut ısısını düzenlemesine yardımcı oluyordu.",
  },
  {
    id: "brachiosaurus-vs-velociraptor",
    dinoA: "Brachiosaurus", dinoB: "Velociraptor", winner: "Brachiosaurus",
    explanationCorrect: "Mükemmel! Brachiosaurus devasa büyüklüğüyle bu düelloyu kazandı.",
    explanationWrong: "Güzel fikir! Velociraptor çevikti, ama Brachiosaurus çok daha büyüktü.",
    funFact: "Brachiosaurus boynu sayesinde diğer dinozorlara ulaşılamayan yüksek dalları yiyordu.",
  },
  {
    id: "utahraptor-vs-gallimimus",
    dinoA: "Utahraptor", dinoB: "Gallimimus", winner: "Utahraptor",
    explanationCorrect: "Harika! Utahraptor güçlü pençeleriyle bu düelloda üstün geldi.",
    explanationWrong: "Güzel deneme! Gallimimus çok hızlıydı, ama Utahraptor onu yakaladı.",
    funFact: "Utahraptor, raptor ailesinin en büyük üyelerinden biriydi.",
  },
  {
    id: "pachycephalosaurus-vs-troodon",
    dinoA: "Pachycephalosaurus", dinoB: "Troodon", winner: "Pachycephalosaurus",
    explanationCorrect: "Süper! Pachycephalosaurus kafasıyla güçlü bir savunma yaptı.",
    explanationWrong: "İyi fikir! Troodon zekiydi, ama Pachycephalosaurus kafası daha güçlüydü.",
    funFact: "Pachycephalosaurus'un kafası 25 cm kalınlığında kemikle kaplıydı.",
  },
  {
    id: "iguanodon-vs-dilophosaurus",
    dinoA: "Iguanodon", dinoB: "Dilophosaurus", winner: "Iguanodon",
    explanationCorrect: "Bravo! Iguanodon'un başparmak dikeni onu korudu.",
    explanationWrong: "Güzel deneme! Dilophosaurus ataktı, ama Iguanodon çok daha büyüktü.",
    funFact: "Iguanodon, başparmağında keskin bir diken taşıyan ilk keşfedilen dinozorlardan biriydi.",
  },
  {
    id: "kentrosaurus-vs-allosaurus",
    dinoA: "Kentrosaurus", dinoB: "Allosaurus", winner: "Kentrosaurus",
    explanationCorrect: "Harika! Kentrosaurus'un sivri dikenleri Allosaurus'u püskürttü.",
    explanationWrong: "İyi deneme! Allosaurus güçlüydü, ama Kentrosaurus'un dikenleri çok etkindi.",
    funFact: "Kentrosaurus'un omuzlarından çıkan uzun dikenleri mükemmel bir savunmaydı.",
  },
  {
    id: "parasaurolophus-vs-velociraptor",
    dinoA: "Parasaurolophus", dinoB: "Velociraptor", winner: "Parasaurolophus",
    explanationCorrect: "Süper! Parasaurolophus büyüklüğüyle bu düelloyu kazandı.",
    explanationWrong: "Güzel fikir! Velociraptor çabuktu, ama Parasaurolophus çok daha büyüktü.",
    funFact: "Parasaurolophus'un ibik şeklindeki başlığı ses çıkarmak için kullanılıyordu.",
  },
  {
    id: "giganotosaurus-vs-stegosaurus",
    dinoA: "Giganotosaurus", dinoB: "Stegosaurus", winner: "Giganotosaurus",
    explanationCorrect: "Mükemmel! Giganotosaurus'un avlanma gücü bu düelloda üstün geldi.",
    explanationWrong: "Güzel deneme! Stegosaurus iyi savunma yaptı, ama Giganotosaurus çok güçlüydü.",
    funFact: "Giganotosaurus, Güney Amerika'da yaşamış en büyük etçil dinozorlardan biriydi.",
  },
  {
    id: "carnotaurus-vs-ankylosaurus",
    dinoA: "Carnotaurus", dinoB: "Ankylosaurus", winner: "Ankylosaurus",
    explanationCorrect: "Bravo! Ankylosaurus'un zırhı her saldırıya karşı koydu.",
    explanationWrong: "İyi fikir! Carnotaurus hızlıydı, ama Ankylosaurus'un zırhı yenilmezdi.",
    funFact: "Ankylosaurus'un zırhı tank gibi sağlamdı ve neredeyse delilmezdi.",
  },
  {
    id: "deinonychus-vs-gallimimus",
    dinoA: "Deinonychus", dinoB: "Gallimimus", winner: "Deinonychus",
    explanationCorrect: "Harika! Deinonychus zekice bir avlanma stratejisiyle kazandı.",
    explanationWrong: "Güzel deneme! Gallimimus çok hızlıydı, ama Deinonychus daha zekiceydi.",
    funFact: "Deinonychus, sürü halinde avlanması nedeniyle son derece etkili bir avcıydı.",
  },
  {
    id: "styracosaurus-vs-dilophosaurus",
    dinoA: "Styracosaurus", dinoB: "Dilophosaurus", winner: "Styracosaurus",
    explanationCorrect: "Süper! Styracosaurus'un boynuzları ve kalkanı onu korudu.",
    explanationWrong: "İyi deneme! Dilophosaurus ataktı, ama Styracosaurus'un boynuzları daha güçlüydü.",
    funFact: "Styracosaurus'un kafasında 6 uzun boynuz ve büyük bir burun boynuzu vardı.",
  },
  {
    id: "baryonyx-vs-iguanodon",
    dinoA: "Baryonyx", dinoB: "Iguanodon", winner: "Baryonyx",
    explanationCorrect: "Mükemmel! Baryonyx'in kanca şeklindeki pençesi bu düelloda belirleyiciydi.",
    explanationWrong: "Güzel deneme! Iguanodon iyi savundu, ama Baryonyx'in pençesi çok güçlüydü.",
    funFact: "Baryonyx, kanca şeklindeki büyük tırnağıyla balık avlamakta ustaydı.",
  },
  {
    id: "suchomimus-vs-carnotaurus",
    dinoA: "Suchomimus", dinoB: "Carnotaurus", winner: "Suchomimus",
    explanationCorrect: "Bravo! Suchomimus boyutu ve uzun çeneleriyle galip geldi.",
    explanationWrong: "İyi fikir! Carnotaurus çevikti, ama Suchomimus çok daha büyüktü.",
    funFact: "Suchomimus'un çenesi timsah çenesine çok benziyordu.",
  },
  {
    id: "albertosaurus-vs-protoceratops",
    dinoA: "Albertosaurus", dinoB: "Protoceratops", winner: "Albertosaurus",
    explanationCorrect: "Harika! Albertosaurus güçlü avlanma yeteneğiyle kazandı.",
    explanationWrong: "Güzel deneme! Protoceratops savundu, ama Albertosaurus daha güçlüydü.",
    funFact: "Albertosaurus, T. rex'in daha küçük ama aynı ailede olan kuzeni sayılır.",
  },
  {
    id: "euoplocephalus-vs-ceratosaurus",
    dinoA: "Euoplocephalus", dinoB: "Ceratosaurus", winner: "Euoplocephalus",
    explanationCorrect: "Süper! Euoplocephalus'un zırhı ve kuyruk tokmağı onu korudu.",
    explanationWrong: "İyi deneme! Ceratosaurus cesurdu, ama Euoplocephalus'un zırhı çok güçlüydü.",
    funFact: "Euoplocephalus'un gözkapakları bile kemikle kaplıydı.",
  },
  {
    id: "majungasaurus-vs-ouranosaurus",
    dinoA: "Majungasaurus", dinoB: "Ouranosaurus", winner: "Majungasaurus",
    explanationCorrect: "Mükemmel! Majungasaurus güçlü avlanma gücüyle galip geldi.",
    explanationWrong: "Güzel fikir! Ouranosaurus büyüktü, ama Majungasaurus daha güçlü bir avcıydı.",
    funFact: "Majungasaurus, Madagaskar adasının en güçlü avcısıydı.",
  },
  {
    id: "acrocanthosaurus-vs-parasaurolophus",
    dinoA: "Acrocanthosaurus", dinoB: "Parasaurolophus", winner: "Acrocanthosaurus",
    explanationCorrect: "Bravo! Acrocanthosaurus'un gücü bu düelloda belirleyiciydi.",
    explanationWrong: "İyi deneme! Parasaurolophus büyüktü, ama Acrocanthosaurus daha güçlü bir avcıydı.",
    funFact: "Acrocanthosaurus sırtındaki uzun dikenleriyle çok etkileyici görünüyordu.",
  },
  {
    id: "torosaurus-vs-utahraptor",
    dinoA: "Torosaurus", dinoB: "Utahraptor", winner: "Torosaurus",
    explanationCorrect: "Harika! Torosaurus'un devasa boynuzları ve kalkanı onu kazandırdı.",
    explanationWrong: "Güzel deneme! Utahraptor pençeliydi, ama Torosaurus çok daha büyüktü.",
    funFact: "Torosaurus'un kafası, bilinen tüm kara hayvanları arasında en büyük kafalardan biriydi.",
  },
  {
    id: "dreadnoughtus-vs-allosaurus",
    dinoA: "Dreadnoughtus", dinoB: "Allosaurus", winner: "Dreadnoughtus",
    explanationCorrect: "Süper! Dreadnoughtus devasa büyüklüğüyle bu düelloyu kolayca kazandı.",
    explanationWrong: "İyi fikir! Allosaurus güçlüydü, ama Dreadnoughtus çok çok daha büyüktü.",
    funFact: "Dreadnoughtus, bilinen en ağır dinozorlardan biriydi — yaklaşık 65 ton!",
  },
  {
    id: "megalosaurus-vs-camptosaurus",
    dinoA: "Megalosaurus", dinoB: "Camptosaurus", winner: "Megalosaurus",
    explanationCorrect: "Mükemmel! Megalosaurus'un avlanma gücü galip gelmesini sağladı.",
    explanationWrong: "Güzel deneme! Camptosaurus savundu, ama Megalosaurus daha güçlüydü.",
    funFact: "Megalosaurus, bilim insanlarının keşfettiği ilk dinozordu.",
  },
  {
    id: "plateosaurus-vs-coelophysis",
    dinoA: "Plateosaurus", dinoB: "Coelophysis", winner: "Plateosaurus",
    explanationCorrect: "Bravo! Plateosaurus boyutu sayesinde bu düelloda üstün geldi.",
    explanationWrong: "İyi deneme! Coelophysis çevikti, ama Plateosaurus çok daha büyüktü.",
    funFact: "Plateosaurus, Triyas döneminin en büyük bitkisel beslenen dinozorlarından biriydi.",
  },
  {
    id: "sinraptor-vs-kentrosaurus",
    dinoA: "Sinraptor", dinoB: "Kentrosaurus", winner: "Kentrosaurus",
    explanationCorrect: "Harika! Kentrosaurus'un keskin dikenleri Sinraptor'u uzak tuttu.",
    explanationWrong: "İyi deneme! Sinraptor güçlüydü, ama Kentrosaurus'un dikenleri çok tehlikeliydi.",
    funFact: "Kentrosaurus'un ismi 'sivri uçlu kertenkele' anlamına gelir.",
  },
  {
    id: "tarbosaurus-vs-saurolophus",
    dinoA: "Tarbosaurus", dinoB: "Saurolophus", winner: "Tarbosaurus",
    explanationCorrect: "Süper! Tarbosaurus güçlü avcı özellikleriyle galip geldi.",
    explanationWrong: "Güzel deneme! Saurolophus büyüktü, ama Tarbosaurus daha güçlü bir avcıydı.",
    funFact: "Tarbosaurus, Asya'da yaşayan T. rex'in en yakın akrabasıydı.",
  },
  {
    id: "edmontosaurus-vs-troodon",
    dinoA: "Edmontosaurus", dinoB: "Troodon", winner: "Edmontosaurus",
    explanationCorrect: "Mükemmel! Edmontosaurus büyüklüğüyle bu düelloyu kazandı.",
    explanationWrong: "İyi fikir! Troodon zekiydi, ama Edmontosaurus çok daha büyüktü.",
    funFact: "Edmontosaurus sürüler halinde yaşardı, bu da onları daha güvende tutuyordu.",
  },
  {
    id: "therizinosaurus-vs-trex",
    dinoA: "Therizinosaurus", dinoB: "T. rex", winner: "T. rex",
    explanationCorrect: "Bravo! T. rex güçlü avlanma yeteneğiyle galip geldi.",
    explanationWrong: "Güzel deneme! Therizinosaurus devasa tırnaklara sahipti, ama T. rex bugün daha üstündü.",
    funFact: "Therizinosaurus'un tırnakları 1 metreyi aşıyordu — dinozorların en uzun tırnakları!",
  },
  {
    id: "quetzalcoatlus-vs-velociraptor",
    dinoA: "Quetzalcoatlus", dinoB: "Velociraptor", winner: "Quetzalcoatlus",
    explanationCorrect: "Harika! Quetzalcoatlus kanat açıklığı ve boyutuyla bu düelloyu kazandı.",
    explanationWrong: "İyi deneme! Velociraptor çevikti, ama Quetzalcoatlus çok daha büyüktü.",
    funFact: "Quetzalcoatlus'un kanat açıklığı küçük bir uçağa eşitti — yaklaşık 10-11 metre!",
  },

  // ── Jurassic Park / Jurassic World & Hybrid Duels ──────────────────────────
  {
    id: "indominus-rex-vs-trex",
    dinoA: "Indominus Rex", dinoB: "T. rex", winner: "Indominus Rex",
    explanationCorrect: "İnanılmaz! Indominus Rex'in hibrit güçleri ve zekâsı bu düelloda belirleyiciydi.",
    explanationWrong: "Güzel deneme! T. rex çok güçlüydü, ama Indominus Rex'in hibrit yetenekleri üstün geldi.",
    funFact: "Indominus Rex, Jurassic World'ün yarattığı ilk hibrit dinozordu — T. rex başta birçok türün DNA'sını taşıyordu.",
  },
  {
    id: "indoraptor-vs-velociraptor",
    dinoA: "Indoraptor", dinoB: "Velociraptor", winner: "Indoraptor",
    explanationCorrect: "Bravo! Indoraptor'un hibrit gücü ve büyüklüğü bu düelloyu kazandırdı.",
    explanationWrong: "İyi deneme! Velociraptor çok zekiydi, ama Indoraptor hem daha büyük hem daha güçlüydü.",
    funFact: "Indoraptor, Indominus Rex ve Velociraptor DNA'sından oluşturulan ikinci nesil hibrit dinozordu.",
  },
  {
    id: "mosasaurus-vs-indominus-rex",
    dinoA: "Mosasaurus", dinoB: "Indominus Rex", winner: "Mosasaurus",
    explanationCorrect: "Muhteşem! Mosasaurus'un kendi ortamında — suda — rakibi yoktur.",
    explanationWrong: "Güzel fikir! Indominus Rex karada çok güçlüydü, ama Mosasaurus onu suya çekti.",
    funFact: "Mosasaurus gerçek bir sürüngen değil, devasa bir deniz kertenkelesiydi — 18 metreyi aşıyordu.",
  },
  {
    id: "giganotosaurus-vs-trex-jp",
    dinoA: "Giganotosaurus", dinoB: "T. rex", winner: "Giganotosaurus",
    explanationCorrect: "Harika! Giganotosaurus biraz daha uzun ve ağır olduğu için bu düelloyu aldı.",
    explanationWrong: "Güzel deneme! T. rex çok güçlüydü, ama Giganotosaurus biraz daha büyük ve ağırdı.",
    funFact: "Jurassic World Dominion'da T. rex ile epik bir kapışma yaşayan Giganotosaurus, 13 metreye ulaşıyordu.",
  },
  {
    id: "indominus-rex-vs-ankylosaurus",
    dinoA: "Indominus Rex", dinoB: "Ankylosaurus", winner: "Indominus Rex",
    explanationCorrect: "İyi bildin! Indominus Rex'in hibrit güçleri Ankylosaurus'un zırhını devre dışı bıraktı.",
    explanationWrong: "İyi deneme! Ankylosaurus çok sağlam savunuyordu, ama Indominus Rex bugün daha üstündü.",
    funFact: "Jurassic World'de bu düello gerçekten yaşandı — Ankylosaurus çok iyi direndi ama yenildi.",
  },
  {
    id: "spinosaurus-vs-trex-jp3",
    dinoA: "Spinosaurus", dinoB: "T. rex", winner: "Spinosaurus",
    explanationCorrect: "Bravo! Spinosaurus boyutu ve güçlü çenesiyle bu düelloda öne geçti.",
    explanationWrong: "İyi deneme! T. rex çok güçlüydü, ama Spinosaurus biraz daha büyüktü ve kazandı.",
    funFact: "Jurassic Park III'te Spinosaurus ve T. rex arasındaki sahne filmin en çarpıcı anlarından biriydi.",
  },
  {
    id: "dilophosaurus-vs-compsognathus",
    dinoA: "Dilophosaurus", dinoB: "Compsognathus", winner: "Dilophosaurus",
    explanationCorrect: "Süper! Dilophosaurus'un boyutu ve özel savunması bu düelloda belirleyiciydi.",
    explanationWrong: "Güzel fikir! Compsognathus çevikti, ama Dilophosaurus çok daha büyük ve güçlüydü.",
    funFact: "Jurassic Park'taki Dilophosaurus boyun yelpazesini açarak rakibini şaşırtıyordu.",
  },
  {
    id: "carnotaurus-vs-stygimoloch",
    dinoA: "Carnotaurus", dinoB: "Stygimoloch", winner: "Stygimoloch",
    explanationCorrect: "İnanılmaz! Stygimoloch'un güçlü kafası Carnotaurus'u şaşırttı ve düelloyu kazandı.",
    explanationWrong: "Güzel deneme! Carnotaurus büyüktü, ama Stygimoloch'un kafası bu düelloda belirleyiciydi.",
    funFact: "Jurassic World: Fallen Kingdom'da Stygimoloch kafasıyla duvarları kırıyordu!",
  },
  {
    id: "baryonyx-vs-carnotaurus",
    dinoA: "Baryonyx", dinoB: "Carnotaurus", winner: "Baryonyx",
    explanationCorrect: "Harika! Baryonyx'in güçlü çeneleri ve pençeleri bu düelloyu kazandırdı.",
    explanationWrong: "İyi deneme! Carnotaurus hızlıydı, ama Baryonyx'in kanca pençesi daha etkindi.",
    funFact: "Jurassic World: Fallen Kingdom'da Baryonyx'in mavi-kırmızı renk deseni onu çok etkileyici kılıyordu.",
  },
  {
    id: "sinoceratops-vs-carnotaurus",
    dinoA: "Sinoceratops", dinoB: "Carnotaurus", winner: "Sinoceratops",
    explanationCorrect: "Bravo! Sinoceratops'un büyük boynuzu ve sağlam yapısı kazanmasını sağladı.",
    explanationWrong: "İyi fikir! Carnotaurus çevikti, ama Sinoceratops'un boynuzu daha güçlüydü.",
    funFact: "Sinoceratops, Jurassic World: Fallen Kingdom'da Owen Grady'nin yardımıyla tanındı.",
  },
  {
    id: "pteranodon-vs-dimorphodon",
    dinoA: "Pteranodon", dinoB: "Dimorphodon", winner: "Pteranodon",
    explanationCorrect: "Süper! Pteranodon'un daha büyük kanatları ve keskin gagası bu düelloyu kazandırdı.",
    explanationWrong: "Güzel deneme! Dimorphodon çevikti, ama Pteranodon daha büyük ve güçlüydü.",
    funFact: "Jurassic World'deki pterosaur saldırısında hem Pteranodon hem de Dimorphodon yer alıyordu.",
  },
  {
    id: "indoraptor-vs-carnotaurus",
    dinoA: "Indoraptor", dinoB: "Carnotaurus", winner: "Indoraptor",
    explanationCorrect: "Mükemmel! Indoraptor'un hibrit zekâsı ve gücü bu düelloda belirleyiciydi.",
    explanationWrong: "İyi deneme! Carnotaurus hızlıydı, ama Indoraptor hibrit yetenekleriyle üstün geldi.",
    funFact: "Indoraptor, Jurassic World: Fallen Kingdom'ın en tehlikeli ve akıllı yaratığı olarak tasarlanmıştı.",
  },
  {
    id: "therizinosaurus-vs-giganotosaurus",
    dinoA: "Therizinosaurus", dinoB: "Giganotosaurus", winner: "Therizinosaurus",
    explanationCorrect: "İnanılmaz! Therizinosaurus'un 1 metrelik tırnakları Giganotosaurus'u geri püskürttü.",
    explanationWrong: "Güzel fikir! Giganotosaurus büyüktü, ama Therizinosaurus'un devasa tırnakları daha etkindi.",
    funFact: "Jurassic World Dominion'da Therizinosaurus'un tırnak sahnesi izleyicileri büyüledi.",
  },
  {
    id: "pyroraptor-vs-velociraptor",
    dinoA: "Pyroraptor", dinoB: "Velociraptor", winner: "Pyroraptor",
    explanationCorrect: "Bravo! Pyroraptor'un daha büyük bedeni ve keskin tırnakları kazanmasını sağladı.",
    explanationWrong: "Güzel deneme! Velociraptor zekiydi, ama Pyroraptor bu düelloda biraz daha güçlüydü.",
    funFact: "Pyroraptor, Jurassic World Dominion'da buz üzerinde yürüyen ve yüzen sahnesiyle akıllarda kaldı.",
  },
  {
    id: "scorpios-rex-vs-velociraptor",
    dinoA: "Scorpios Rex", dinoB: "Velociraptor", winner: "Scorpios Rex",
    explanationCorrect: "Süper! Scorpios Rex'in hibrit özellikleri ve saldırganlığı bu düelloyu kazandırdı.",
    explanationWrong: "İyi deneme! Velociraptor zekiydi, ama Scorpios Rex hibrit gücüyle üstün geldi.",
    funFact: "Scorpios Rex, Jurassic World: Camp Cretaceous'ta çocuklar tarafından keşfedilen ilk hibrit dinozordu.",
  },
  {
    id: "dreadnoughtus-vs-giganotosaurus",
    dinoA: "Dreadnoughtus", dinoB: "Giganotosaurus", winner: "Dreadnoughtus",
    explanationCorrect: "Harika! Dreadnoughtus'un devasa boyutu bu düelloda belirleyiciydi.",
    explanationWrong: "İyi fikir! Giganotosaurus güçlü bir avcıydı, ama Dreadnoughtus çok çok daha ağırdı.",
    funFact: "Dreadnoughtus, Jurassic World Dominion'da görülen gerçek bir sauropod türüydü — 65 ton!",
  },
  {
    id: "allosaurus-vs-baryonyx",
    dinoA: "Allosaurus", dinoB: "Baryonyx", winner: "Allosaurus",
    explanationCorrect: "Mükemmel! Allosaurus'un güçlü çeneleri ve pençeleri bu düelloyu kazandırdı.",
    explanationWrong: "Güzel deneme! Baryonyx çok yetenekliydi, ama Allosaurus bugün daha güçlüydü.",
    funFact: "Allosaurus, Jurassic World: Fallen Kingdom'da en dikkat çekici sahnelerden birinde yer aldı.",
  },
  {
    id: "mosasaurus-vs-kronosaurus",
    dinoA: "Mosasaurus", dinoB: "Kronosaurus", winner: "Mosasaurus",
    explanationCorrect: "İnanılmaz! Mosasaurus'un devasa boyutu ve güçlü çeneleri galip gelmesini sağladı.",
    explanationWrong: "İyi deneme! Kronosaurus çok güçlüydü, ama Mosasaurus çok daha büyüktü.",
    funFact: "Jurassic World'deki Mosasaurus, gerçekteki atalarından çok daha büyük gösterildi — bu onu efsanevi kıldı.",
  },
  {
    id: "trex-vs-indoraptor",
    dinoA: "T. rex", dinoB: "Indoraptor", winner: "T. rex",
    explanationCorrect: "Bravo! T. rex'in ham gücü ve ısırma kuvveti bu düelloda belirleyiciydi.",
    explanationWrong: "Güzel fikir! Indoraptor çok zekiydi, ama T. rex'in boyutu ve gücü bugün üstün geldi.",
    funFact: "T. rex, Jurassic Park serisinin simgesi — her filmde bu efsanevi dinozor yer aldı.",
  },
  {
    id: "indominus-rex-vs-spinosaurus",
    dinoA: "Indominus Rex", dinoB: "Spinosaurus", winner: "Indominus Rex",
    explanationCorrect: "Süper! Indominus Rex'in hibrit zekâsı ve gizlenme yeteneği bu düelloyu kazandırdı.",
    explanationWrong: "İyi deneme! Spinosaurus boyutuyla etkileyiciydi, ama Indominus Rex hibrit avantajına sahipti.",
    funFact: "Indominus Rex termal görüşü engelleyebiliyor ve renk değiştirebiliyordu — inanılmaz hibrit özellikler!",
  },
  {
    id: "scorpios-rex-vs-carnotaurus",
    dinoA: "Scorpios Rex", dinoB: "Carnotaurus", winner: "Scorpios Rex",
    explanationCorrect: "Harika! Scorpios Rex'in hibrit gücü Carnotaurus'u geride bıraktı.",
    explanationWrong: "İyi fikir! Carnotaurus hızlıydı, ama Scorpios Rex'in hibrit özellikleri daha etkindi.",
    funFact: "Scorpios Rex, Dr. Wu'nun ilk hibrit deneyi olduğu için çok dengesiz ve öngörülemez bir yapıya sahipti.",
  },
  {
    id: "pteranodon-vs-quetzalcoatlus",
    dinoA: "Pteranodon", dinoB: "Quetzalcoatlus", winner: "Quetzalcoatlus",
    explanationCorrect: "Mükemmel! Quetzalcoatlus'un çok daha büyük boyutu bu düelloyu kazandırdı.",
    explanationWrong: "İyi deneme! Pteranodon çevikti, ama Quetzalcoatlus ona göre devasa büyüklükteydi.",
    funFact: "Quetzalcoatlus, Jurassic World Dominion'da etkileyici bir sahneyle filmin en büyük uçan yaratığı olarak göründü.",
  },
  {
    id: "giganotosaurus-vs-carnotaurus-jw",
    dinoA: "Giganotosaurus", dinoB: "Carnotaurus", winner: "Giganotosaurus",
    explanationCorrect: "Bravo! Giganotosaurus Carnotaurus'tan çok daha büyük ve ağır olduğu için kazandı.",
    explanationWrong: "Güzel deneme! Carnotaurus hızlıydı, ama Giganotosaurus çok daha büyük bir avcıydı.",
    funFact: "Giganotosaurus, Jurassic World Dominion'da T. rex'e meydan okuyan en güçlü avcıydı.",
  },
  {
    id: "dilophosaurus-vs-gallimimus",
    dinoA: "Dilophosaurus", dinoB: "Gallimimus", winner: "Dilophosaurus",
    explanationCorrect: "İnanılmaz! Dilophosaurus'un savunma yeteneği bu düelloda belirleyiciydi.",
    explanationWrong: "İyi fikir! Gallimimus çok hızlıydı, ama Dilophosaurus'un özel savunması onu geçti.",
    funFact: "Jurassic Park'ta Dilophosaurus'un boyun yelpazesini açarak Dennis Nedry'ye yaklaşması en ünlü sahnelerden biri.",
  },
  {
    id: "blue-vs-pteranodon",
    dinoA: "Velociraptor Blue", dinoB: "Pteranodon", winner: "Velociraptor Blue",
    explanationCorrect: "Süper! Velociraptor Blue'nun zekâsı ve pençeleri karada bu düelloyu kazandırdı.",
    explanationWrong: "İyi deneme! Pteranodon gökyüzünde daha üstündü, ama karada Velociraptor Blue daha güçlüydü.",
    funFact: "Blue, Jurassic World serisinin en sevilen karakteri oldu — Owen Grady ile derin bir bağ kurdu.",
  },
  {
    id: "pyroraptor-vs-compsognathus",
    dinoA: "Pyroraptor", dinoB: "Compsognathus", winner: "Pyroraptor",
    explanationCorrect: "Harika! Pyroraptor çok daha büyük ve güçlü olduğu için kolayca kazandı.",
    explanationWrong: "Güzel fikir! Compsognathus çevikti, ama Pyroraptor çok daha büyüktü.",
    funFact: "Pyroraptor, Jurassic World Dominion'da soğuk suda yüzüp buz üzerinde koşmasıyla herkesi şaşırttı.",
  },
  {
    id: "indominus-rex-vs-triceratops",
    dinoA: "Indominus Rex", dinoB: "Triceratops", winner: "Indominus Rex",
    explanationCorrect: "Bravo! Indominus Rex'in hibrit üstünlüğü bu düelloda belirleyiciydi.",
    explanationWrong: "İyi deneme! Triceratops boynuzlarıyla savaştı, ama Indominus Rex hibrit gücüyle üstün geldi.",
    funFact: "Jurassic World'de Indominus Rex, sürü halindeki dinosaurusları bile alt edecek kadar güçlüydü.",
  },
  {
    id: "indoraptor-vs-stygimoloch",
    dinoA: "Indoraptor", dinoB: "Stygimoloch", winner: "Indoraptor",
    explanationCorrect: "Mükemmel! Indoraptor'un hibrit gücü ve zekâsı bu düelloda galip gelmesini sağladı.",
    explanationWrong: "İyi fikir! Stygimoloch kafasıyla iyi savundu, ama Indoraptor çok daha güçlüydü.",
    funFact: "Jurassic World: Fallen Kingdom'da Stygimoloch ve Indoraptor aynı kalenin koridorlarında yer aldı.",
  },
  {
    id: "mosasaurus-vs-giganotosaurus",
    dinoA: "Mosasaurus", dinoB: "Giganotosaurus", winner: "Mosasaurus",
    explanationCorrect: "İnanılmaz! Mosasaurus denizin hükümdarı — kendi ortamında rakibi yok.",
    explanationWrong: "Güzel deneme! Giganotosaurus karada çok güçlüydü, ama Mosasaurus suya çekince kazandı.",
    funFact: "Mosasaurus, Jurassic World'ün en çarpıcı anlarından birinde Indominus Rex'i denize çekti.",
  },
  {
    id: "scorpios-rex-vs-indoraptor",
    dinoA: "Scorpios Rex", dinoB: "Indoraptor", winner: "Indoraptor",
    explanationCorrect: "Bravo! Indoraptor'un daha gelişmiş hibrit özellikleri bu düelloyu kazandırdı.",
    explanationWrong: "İyi deneme! Scorpios Rex vahşi ve güçlüydü, ama Indoraptor daha gelişmiş bir hibritti.",
    funFact: "Her ikisi de Dr. Wu'nun hibrit yaratıkları — Scorpios Rex birinci, Indoraptor ikinci nesil hibritti.",
  },
];

interface StoredResult {
  duelId: string;
  selected: string;
  winner: string;
  isCorrect: boolean;
  answeredAt: string;
}

type DuelState = "idle" | "animating" | "answered";

function getTodayKey(): string {
  return new Date().toLocaleDateString("en-CA");
}

function getStorageKey(): string {
  return `dino-duel-result-${getTodayKey()}`;
}

function getTodayDuel(): Duel {
  const todayKey = getTodayKey();
  const dayNumber = todayKey.replaceAll("-", "");
  const index = Number(dayNumber) % DUELS.length;
  return DUELS[index];
}

export default function DailyDinoDuel() {
  const duel = getTodayDuel();

  const [state, setState] = useState<DuelState>(() => {
    const stored = localStorage.getItem(getStorageKey());
    if (!stored) return "idle";
    const parsed: StoredResult = JSON.parse(stored);
    if (parsed.duelId !== duel.id) {
      localStorage.removeItem(getStorageKey());
      return "idle";
    }
    return "answered";
  });

  const [result, setResult] = useState<StoredResult | null>(() => {
    const stored = localStorage.getItem(getStorageKey());
    if (!stored) return null;
    const parsed: StoredResult = JSON.parse(stored);
    if (parsed.duelId !== duel.id) return null;
    return parsed;
  });

  const [selected, setSelected] = useState<string | null>(null);

  const handleChoice = useCallback((choice: string) => {
    if (state !== "idle") return;
    setSelected(choice);
    setState("animating");

    setTimeout(() => {
      const isCorrect = choice === duel.winner;
      const res: StoredResult = {
        duelId: duel.id,
        selected: choice,
        winner: duel.winner,
        isCorrect,
        answeredAt: new Date().toISOString(),
      };
      localStorage.setItem(getStorageKey(), JSON.stringify(res));
      setResult(res);
      setState("answered");
    }, 3500);
  }, [state, duel]);

  // Dev reset: press R to clear today's answer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        localStorage.removeItem(getStorageKey());
        setResult(null);
        setSelected(null);
        setState("idle");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
        border: "1px solid rgba(251,146,60,0.25)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
      data-testid="section-dino-duel"
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: "rgba(251,146,60,0.2)", background: "rgba(251,146,60,0.08)" }}
      >
        <Swords className="text-orange-400" style={{ width: 18, height: 18 }} />
        <span className="font-black text-orange-400 text-sm tracking-wide uppercase">
          Günlük Dino Düellosu
        </span>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">

          {/* ─── IDLE: choose a dino ─── */}
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-center text-stone-400 text-xs mb-3 tracking-wide uppercase">
                Bugün hangisi üstün gelir?
              </p>

              <div className="flex items-center gap-3">
                {/* Dino A button */}
                <DinoButton name={duel.dinoA} accent="#f97316" onClick={() => handleChoice(duel.dinoA)} />

                {/* VS divider */}
                <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
                  <div style={{ width: 1, height: 20, background: "rgba(251,146,60,0.3)" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "#f97316", letterSpacing: "0.1em" }}>VS</span>
                  <div style={{ width: 1, height: 20, background: "rgba(251,146,60,0.3)" }} />
                </div>

                {/* Dino B button */}
                <DinoButton name={duel.dinoB} accent="#fb923c" onClick={() => handleChoice(duel.dinoB)} />
              </div>

              <p className="text-center text-stone-500 text-xs mt-3">
                Seçimini yap!
              </p>
            </motion.div>
          )}

          {/* ─── ANIMATING: duel in progress ─── */}
          {state === "animating" && (
            <motion.div
              key="animating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-orange-400 font-black text-sm tracking-widest uppercase">
                Düello başladı!
              </p>

              <div className="flex items-center gap-2 w-full">
                {/* Dino A slides right */}
                <motion.div
                  className="flex-1 text-center"
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <DinoCard
                    name={duel.dinoA}
                    highlighted={selected === duel.dinoA}
                    accent="#f97316"
                  />
                </motion.div>

                {/* VS pulsing */}
                <motion.div
                  className="flex-shrink-0"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                >
                  <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fbbf24" }}>⚡</span>
                </motion.div>

                {/* Dino B slides left */}
                <motion.div
                  className="flex-1 text-center"
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <DinoCard
                    name={duel.dinoB}
                    highlighted={selected === duel.dinoB}
                    accent="#fb923c"
                  />
                </motion.div>
              </div>

              {/* Progress bar */}
              <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: "rgba(251,146,60,0.15)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #f97316, #fbbf24)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3.5, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}

          {/* ─── ANSWERED: show result ─── */}
          {state === "answered" && result && (
            <motion.div
              key="answered"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              {/* Correct / Wrong badge */}
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{
                  background: result.isCorrect
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(99,102,241,0.15)",
                  border: `1px solid ${result.isCorrect ? "rgba(34,197,94,0.35)" : "rgba(99,102,241,0.35)"}`,
                }}
              >
                {result.isCorrect
                  ? <Star style={{ width: 18, height: 18, color: "#22c55e" }} />
                  : <Shield style={{ width: 18, height: 18, color: "#818cf8" }} />
                }
                <p
                  className="font-black text-sm"
                  style={{ color: result.isCorrect ? "#22c55e" : "#818cf8" }}
                >
                  {result.isCorrect ? "Doğru bildin!" : "İyi deneme!"}
                </p>
              </div>

              {/* Explanation */}
              <p className="text-stone-300 text-xs leading-relaxed">
                {result.isCorrect ? duel.explanationCorrect : duel.explanationWrong}
              </p>

              {/* Result details row */}
              <div className="flex gap-2">
                <div
                  className="flex-1 rounded-xl p-2 text-center"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <p className="text-stone-500 text-[10px] uppercase tracking-wider mb-0.5">Seçimin</p>
                  <p className="text-white font-bold text-xs leading-tight">{result.selected}</p>
                </div>
                <div
                  className="flex-1 rounded-xl p-2 text-center"
                  style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
                >
                  <p className="text-stone-500 text-[10px] uppercase tracking-wider mb-0.5">Kazanan</p>
                  <p className="text-green-400 font-bold text-xs leading-tight">{result.winner}</p>
                </div>
              </div>

              {/* Fun fact */}
              <div
                className="rounded-xl px-3 py-2"
                style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.18)" }}
              >
                <p className="text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  Dino Bilgi
                </p>
                <p className="text-stone-400 text-xs leading-snug">{duel.funFact}</p>
              </div>

              {/* Next duel notice */}
              <div className="flex items-center justify-center gap-1">
                <RotateCcw style={{ width: 12, height: 12, color: "#57534e" }} />
                <p className="text-stone-600 text-[10px]">Yarın yeni bir düello seni bekliyor!</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

function DinoButton({ name, accent, onClick }: { name: string; accent: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-xl py-3 px-2 text-center transition-all active:scale-95 select-none cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${accent}22 0%, ${accent}11 100%)`,
        border: `1.5px solid ${accent}44`,
        minHeight: 64,
      }}
      data-testid={`button-duel-choice-${name.toLowerCase().replace(/[^a-z]/g, "-")}`}
    >
      <p className="font-black text-white text-sm leading-tight">{name}</p>
      <p style={{ color: accent, fontSize: "0.65rem", marginTop: 2, fontWeight: 600 }}>
        Seç!
      </p>
    </button>
  );
}

function DinoCard({ name, highlighted, accent }: { name: string; highlighted: boolean; accent: string }) {
  return (
    <div
      className="rounded-xl py-3 px-2"
      style={{
        background: highlighted ? `${accent}33` : "rgba(255,255,255,0.05)",
        border: `1.5px solid ${highlighted ? accent : "rgba(255,255,255,0.1)"}`,
        boxShadow: highlighted ? `0 0 16px ${accent}44` : "none",
        transition: "all 0.3s",
      }}
    >
      <p className="font-black text-white text-xs leading-tight">{name}</p>
    </div>
  );
}
