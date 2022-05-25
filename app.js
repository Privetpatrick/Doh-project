window.addEventListener('DOMContentLoaded', () => {

    apiKey = '563492ad6f917000010000017164b7c493f14ca3a1f99c1cdaac75d7'

    async function getResponse(value) {
        let response = await fetch(`https://api.pexels.com/v1/search?query=${value}&orientation=landscape`, {
            method: 'GET',
            headers: { 'Authorization': apiKey }
        });
        // console.log(response);
        if (response.ok) {
            return await response.json();
        } else {
            searchPanel.innerHTML = '';
            searchPanel.style.display = 'none';
            // console.log('GET не сработал, это консоль лог');
            throw new Error(`GET не сработал этот ERROR`);
        };
    };

    async function post(json) {
        // console.log(json);
        let post = await fetch('http://localhost:3000/recipes', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: json
        });
        // console.log(post);
 
        if (!post.ok) {
            // console.log('POST не сработал, это консоль лог');
            throw new Error(`POST не сработал этот ERROR`);
        } else {
            resetForm();
            console.log(post);
        };

    };

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };



    function postForm() {

        // let obj = {
        //     name: form.elements.name.value,
        //     age: form.elements.age.value,
        //     url: form.elements.url.value
        // }
        // console.log(obj);

        let formData = new FormData(form);
        formData.append('id', randomNumber(1, 9999));
        // console.log(formData);

        let objForm = {};

        formData.forEach((value, key) => {
            if (!value) {
                erorrForm(key);
                return objForm = 0;
            };
        });

        if (!objForm) {
            throw new Error('форма не валидна, идет проверка');
        } else {
            formData.forEach((value, key) => {
                objForm[key] = value;
            });
            // for (const [key, value] of Object.entries(objForm)) {

            //     if (!value) {
            //         erorrForm(key);
            //     };
            // };

            let ingridients = [];
            let amounts = [];
            let measurements = [];

            for (key in objForm) {
                if (key.includes('ingridient')) {
                    ingridients.push(objForm[key]);
                    delete objForm[key];
                };
                if (key.includes('amount')) {
                    amounts.push(objForm[key]);
                    delete objForm[key];
                };
                if (key.includes('measurement')) {
                    measurements.push(objForm[key]);
                    delete objForm[key];
                };
            };
            let amountMeasure = amounts.map((value, key) => value + " " + measurements[key]);

            let ingridientsFull = ingridients.map((value, key) => {
                return { [value]: amountMeasure[key] };
            });

            objForm.ingridients = ingridientsFull;

            console.log(objForm);

            let json = JSON.stringify(objForm);
            console.log(json);
            post(json);
        };
    };

    function erorrForm(key) {
        // console.log(key); 
        // let anyNum = /[0-9]+/;
        // console.log(anyNum.test(key));
        // if (anyNum.test(key)) {
            
            let keyDom = document.querySelector(`.${key}`);
            // console.log(keyDom);
            keyDom.nextElementSibling.style.display = 'inline';

    }

    function creatCard(data) {
        // console.log(data.results);
        searchPanel.innerHTML = '';
        searchPanel.style.display = 'flex';

        console.log(data);

        for (let i = 0; i < 5; i++){
            // console.log(data.photos[i].src.medium)
            let div = document.createElement('div');
            div.classList.add('card');
            let img = document.createElement('img');
            img.src = data.photos[i].src.medium;
            div.append(img);
            searchPanel.append(div);

        };

        // data.results.forEach(elem => {
        //     // console.log(elem);
        //     if (!elem.poster_path) {
        //         return;
        //     }
            // let div = document.createElement('div');
            // div.classList.add('card');
            // let img = document.createElement('img');
            // img.src = `https://image.tmdb.org/t/p/w185${elem.poster_path}`;
            // div.append(img);
            // searchPanel.append(div);

        // });

        if (searchPanel.innerHTML == '') {
            searchPanel.style.display = 'none';
        };
    };

    function addIngridient() {
        // let nameInput = document.createElement('div');
        // nameInput.classList.add('new-ingridient');
        // nameInput.innerHTML = `Ingridient ${increment}: `;
        // let input = document.createElement('input');
        // input.setAttribute('name', `Ingridient${increment}`);

        // let amount = document.createElement('span');
        // amount.innerHTML = `Количество: `;
        // let inputAmount = document.createElement('input');
        // inputAmount.setAttribute('name', 'amount');
        // amount.append(inputAmount);

        // let measurement = document.createElement('span');
        // let inputMeasurement = document.createElement('input');
        // inputMeasurement.setAttribute('name', 'amount');
        // amount.append(inputAmount);


        // nameInput.append(input);
        // inputsDiv.append(nameInput);
        // nameInput.append(amount);

        let inputIngrid = temp.content.cloneNode(true);

        inputsDiv.append(inputIngrid);
        let fullingridient = document.querySelector('.new-ingridient');
        fullingridient.setAttribute('class', `new-ingridient${increment}`);
        let nameInput = document.querySelector('.ingridient');
        nameInput.setAttribute('class', `ingridient${increment}`);
        nameInput.setAttribute('name', `ingridient${increment}`);
        // console.log(nameInput);
        let amount = document.querySelector('.amount');
        amount.setAttribute('class', `amount${increment}`);
        amount.setAttribute('name', `amount${increment}`);
        let measurement = document.querySelector('.measurement');
        measurement.setAttribute('class', `measurement${increment}`);
        measurement.setAttribute('name', `measurement${increment}`);
        nameInput.before(`Ingridient ${increment}: `);
        // console.log(form);
        return increment++;
    };

    function resetForm() {

        let deletDivs = document.querySelectorAll('.new-ingridient');
        // console.log(deletDivs);
        deletDivs.forEach(div => div.remove());
        let form2 = document.forms.main;
        // console.log(form2.elements.name);
        form2.elements.name.value = '';
        form2.elements.age.value = '';
        inputUrl.value = '';
        increment--;
        while (increment > 0) {
            let lastIngridient = document.querySelector(`.new-ingridient${increment}`);
            lastIngridient.remove();
            increment--;
        }
        document.querySelectorAll('.error').forEach(value => value.style.display = 'none');
        form.deleteIngredient.style.display = 'none';

        return increment = 1;
    };

    let searchPanel = document.querySelector('.search-panel');
    let searchValue = document.querySelector('.search');
    let inputUrl = document.querySelector('.url');
    let form = document.forms.main;
    let inputsDiv = document.querySelector('.inputs');
    let temp = document.querySelector('.newIngridientTemp');
    let increment = 1;
    let resData;
    let divPoster;

    searchValue.addEventListener('input', (e) => {
        // console.log(e.target.value);
        getResponse(e.target.value)
            .then(data => {
                creatCard(data)
                return resData = data.photos;
            })
            .catch(err => new Error(`Так так, вот такая ошибка ${err}`))
    });

    searchPanel.addEventListener('dblclick', (e) => {
        // console.log(e);
        if (e.target.hasAttribute('src')) {
            inputUrl.value = e.target.src;
            searchPanel.innerHTML = '';
            searchPanel.style.display = 'none';
            searchValue.value = '';
        };
    });

    searchPanel.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        // console.log(e);
        if (e.target.hasAttribute('src')) {
            // console.log(resData);
            if (divPoster) {
                divPoster.remove();
                divPoster = 0;
            };
            resData.forEach(elem => {

                if (`https://image.tmdb.org/t/p/w185${elem.poster_path}` == e.target.getAttribute('src')) {
                    // console.log(elem);
                    divPoster = document.createElement('div');
                    divPoster.classList.add('poster');
                    divPoster.innerHTML = `<div class="close"><button>Close</button></div><h3>Название: ${validateRes(elem)}</h3><img src="https://image.tmdb.org/t/p/w185${elem.poster_path}"><br /><b>Стредняя оценка:</b> ${elem.vote_average}<br /><b>Всего голосов:</b> ${elem.vote_count}<h4>Описание фильма</h4><p>${elem.overview}</p>`;
                    document.body.prepend(divPoster);
                    window.addEventListener('keydown', e => {
                        if (e.code == 'Escape') {
                            if (divPoster) {
                                divPoster.remove();
                                divPoster = 0;
                            };
                        };
                    });
                    document.querySelector('.close').addEventListener('click', e => {
                        // console.log(e);
                        if (divPoster) {
                            divPoster.remove();
                            divPoster = 0;
                        };
                    });
                };
            });
            window.addEventListener('click', e => {
                if (e.target.parentElement === null) {
                    if (divPoster) {
                        divPoster.remove();
                        divPoster = 0;
                    };
                } else if (e.target.parentElement.classList.contains('poster') || e.target.classList.contains('poster')) {
                    return;
                } else {
                    if (divPoster) {
                        divPoster.remove();
                        divPoster = 0;
                    };
                };
            });
        };
    });

    function validateRes(elem) {
        if (!elem.original_title) {
            return elem.name;
        } else return elem.original_title;
    };

    form.elements.submit.addEventListener('click', (e) => {
        e.preventDefault();
        if (divPoster) {
            divPoster.remove();
            divPoster = 0;
        };
        postForm();
    });

    form.elements.newIngredient.addEventListener('click', (e) => {
        e.preventDefault();
        form.deleteIngredient.style.display = 'inline';
        if (divPoster) {
            divPoster.remove();
            divPoster = 0;
        };
        // console.log(e.target);
        addIngridient();
    });

    form.reset.addEventListener('click', e => {
        e.preventDefault();
        if (divPoster) {
            divPoster.remove();
            divPoster = 0;
        };
        resetForm();
    });

    window.addEventListener('keydown', e => {

        if (e.code == 'Escape') {
            if (searchPanel.style.display == 'flex' && !!divPoster) {
                divPoster.remove();
                divPoster = 0;
            } else searchPanel.style.display = 'none';
        };
    });

    form.deleteIngredient.addEventListener('click', e => {
        e.preventDefault();
        increment--;
        let lastIngridient = document.querySelector(`.new-ingridient${increment}`);
        lastIngridient.remove();
        if (increment == 1) {
            form.deleteIngredient.style.display = 'none';
        };
        return increment;
    });

    // window.addEventListener('keydown', e => {
    //     if (e.code == 'KeyA') {
    //         console.log(searchPanel.style.display == 'flex' && !!divPoster);
    //     };
    // });
});