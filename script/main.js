const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";
const API_KEY = "b7e11c9b9ca94287321e3d78cd528523";
const SERVER = "https://api.themoviedb.org/3";
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list')
const tvShowsHead = document.querySelector('.tv-shows__head');
const modal = document.querySelector('.modal')
const tvShows = document.querySelector('.tv-shows')
const tvCardImg = document.querySelector ('.tv-card__img')
const modalTitle = document.querySelector('.modal__title')
const genresList = document.querySelector('.genres-list')
const rating = document.querySelector('.rating')
const description = document.querySelector('.description')
const modalLink = document.querySelector('.modal__link')
const searchForm = document.querySelector('.search__form')
const searchFormInput = document.querySelector('.search__form-input')
const loading = document.createElement('div');
const posterWrapper = document.querySelector('.poster__wrapper');
loading.className = 'loading';

const DBService = class {

    getData = async url => {
        const res = await fetch (url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error (`Не удалось получить данные по адресу ${url}`)
        }
    }
    getTestData = () => {
        return this.getData ('test.json')
    }
    getTestCard = () => {
        return this.getData ('card.json')
    }

    getSearchResult = query => {
        return this.getData (`${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-Ru`)
    }

    getTvShow = id => {
        return this.getData (`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-Ru`)
    }
}
const renderCard = response => {
    tvShowsList.textContent='';
    if (response.results.length) {
        tvShowsHead.textContent = 'Результат поиска';
        response.results.forEach(item => {
        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote, id
        } = item;
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>`: '';
        const card = document.createElement ('li');
        card.classList.add('tv-shows__item');
        card.innerHTML = ` <a href="#" data-id=${id} class="tv-card">   ${voteElem}
        <img class="tv-card__img" src="${posterIMG}"
            data-backdrop="${backdropIMG}" alt="${title}">
        <h4 class="tv-card__head">${title}</h4></a>`;
        loading.remove();
    tvShowsList.append(card);
  });
} else {
    loading.remove();
    tvShowsHead.textContent = 'По вашему запросу сериалов не найдено'
    }
}
//поиск и вывод результатов поиска

searchForm.addEventListener ('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if (value) {
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
})

//Menu

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
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});
// swap picture
const swapAttrs = elem => {
    const card = event.target.closest('.tv-shows__item');
    if (card) {
        const img = card.querySelector('.tv-card__img');
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]
        }
    }
}
tvShowsList.addEventListener('mouseover', swapAttrs);
tvShowsList.addEventListener('mouseout', swapAttrs);
// on modal window
tvShowsList.addEventListener('click', event => {
    event.preventDefault()
    const target = event.target
    const card = target.closest('.tv-card')
    if (card) {
        tvShows.append(loading);
        new DBService().getTvShow(card.dataset.id)
            .then(response => {

                if (response.backdrop_path) {
                    tvCardImg.src = IMG_URL + response.poster_path;
                    tvCardImg.alt = response.name;
                    posterWrapper.classList.remove('hide');
                } else{
                    posterWrapper.classList.add('hide');
                }
                modalTitle.textContent = response.name;
                genresList.innerHTML = '';
                for (const item of response.genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`
                };
                rating.textContent = response.vote_average;
                description.textContent= response.overview;
                modalLink.href = response.homepage;

            })
            .then(() => {
                loading.remove();
                modal.style.backgroundColor = 'rgba(0,0,0,0.8)'
                document.body.style.overfow='hidden'
                modal.classList.remove('hide')

            })
    }
})
// on modal window
modal.addEventListener('click', event => {
    if (event.target.closest('.cross') ||
        event.target.classList.contains('modal')) {
        document.body.style.overflow=''
        modal.classList.add('hide')
    }
})