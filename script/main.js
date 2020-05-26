/*
ДЗ №1 строка 32
*/

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvList = document.querySelector('.tv-shows__list');

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    
});

document.body.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

tvList.addEventListener('mouseover', event => {
   const target = event.target;
   const tvCard = target.closest('.tv-card');
   const tvCardImg = target.closest('.tv-card__img');
   if (tvCard && tvCardImg) {
       const origSrc = tvCardImg.src;
       const newScr = tvCardImg.dataset.backdrop;
       if (newScr) {
           tvCardImg.src = newScr;
           tvCard.addEventListener('mouseout', () => {
            tvCardImg.src = origSrc;
           });
        }
   }
});
