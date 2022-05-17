window.addEventListener('DOMContentLoaded', () => {

    async function getResponse(value) {
        let response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=b1625996a2671911894f6d328d58325e&language=en-US&query=${value}&page=1&include_adult=false`)
        console.log(response);
        if (response.ok) {
            return await response.json();
        } else {
            searchPanel.innerHTML = '';
            searchPanel.style.display = 'none';
            console.log('GET не сработал, это консоль лог');
            throw new Error(`GET не сработал этот ERROR`);
        };
    };

    async function post(json) {
        // console.log(json);
        let post = await fetch('some-url', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: json
        });
        // console.log(post)
        if (!post.ok) {
            console.log('POST не сработал, это консоль лог');
            throw new Error(`POST не сработал этот ERROR`);
        };
    };

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };



    function postForm(e) {
        e.preventDefault();

        // let obj = {
        //     name: form.elements.name.value,
        //     age: form.elements.age.value,
        //     url: form.elements.url.value
        // }
        // console.log(obj);

        let formData = new FormData(form);
        // formData.append('id', randomNumber(1, 9999));
        // console.log(formData);

        let objForm = {};

        formData.forEach((value, key) => {
            objForm[key] = value;
        });

        let ingridients = [];
        let amoumts = [];
        let measurements = [];

        for (key in objForm) {
            if (key.includes('ingridient')) {
                ingridients.push(objForm[key]);
                delete objForm[key];
            };
            if (key.includes('amoumt')) {
                amoumts.push(objForm[key]);
                delete objForm[key];
            };
            if (key.includes('measurement')) {
                measurements.push(objForm[key]);
                delete objForm[key];
            };
        };
        let amountMeasure = amoumts.map((value, key) => value + " " + measurements[key]);

        let ingridientsFull = ingridients.map((value, key) => {
            return { [value]: amountMeasure[key] };
        });

        objForm.ingridients = ingridientsFull;

        console.log(objForm);

        let json = JSON.stringify(objForm);

        post(json);
    };

    function creatCard(data) {
        // console.log(data.results);
        searchPanel.innerHTML = '';
        searchPanel.style.display = 'flex';

        data.results.forEach(elem => {
            // console.log(elem);
            if (!elem.poster_path) {
                return;
            }
            let div = document.createElement('div');
            div.classList.add('card');
            let img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w185${elem.poster_path}`;
            div.append(img);
            searchPanel.append(div);

        });

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
        // inputAmount.setAttribute('name', 'amoumt');
        // amount.append(inputAmount);

        // let measurement = document.createElement('span');
        // let inputMeasurement = document.createElement('input');
        // inputMeasurement.setAttribute('name', 'amoumt');
        // amount.append(inputAmount);


        // nameInput.append(input);
        // inputsDiv.append(nameInput);
        // nameInput.append(amount);

        let inputIngrid = temp.content.cloneNode(true);

        let input = document.querySelector('input');
        // console.log(input);
        // input.setAttribute('name', `Ingridient${increment}`);
        // console.log(inputIngrid);
        inputsDiv.append(inputIngrid);
        let nameInput = document.querySelector('.inputName');
        nameInput.setAttribute('class', `inputName${increment}`);
        nameInput.setAttribute('name', `ingridient${increment}`);
        // console.log(nameInput);
        let amount = document.querySelector('.amoumt');
        amount.setAttribute('class', `amoumt${increment}`);
        amount.setAttribute('name', `amoumt${increment}`);
        let measurement = document.querySelector('.measurement');
        measurement.setAttribute('class', `measurement${increment}`);
        measurement.setAttribute('name', `measurement${increment}`);
        nameInput.before(`Ingridient ${increment}: `);
        console.log(form);
        return increment++;
    };

    function resetForm() {

        let deletDivs = document.querySelectorAll('.new-ingridient');
        // console.log(deletDivs);
        deletDivs.forEach(div => div.remove());
        let form2 = document.forms.main;
        console.log(form2.elements.name);
        form2.elements.name.value = '';
        form2.elements.age.value = '';
        return increment = 1;
    };

    let searchPanel = document.querySelector('.search-panel');
    let inputUrl = document.querySelector('.readonly');
    let form = document.forms.main;
    let inputsDiv = document.querySelector('.inputs');
    let temp = document.querySelector('.newIngridientTemp');
    let increment = 1;

    document.querySelector('.search').addEventListener('input', (e) => {
        // console.log(e.target.value);
        getResponse(e.target.value)
            .then(data => creatCard(data))
            .catch(err => new Error(`Так так, вот такая ошибка ${err}`))
    });

    form.elements.submit.addEventListener('click', (e) => {
        postForm(e);
    });

    form.elements.newIngredient.addEventListener('click', (e) => {
        e.preventDefault();
        // console.log(e.target);
        addIngridient();
    });

    searchPanel.addEventListener('click', (e) => {
        // console.log(e);
        if (e.target.hasAttribute('src')) {
            inputUrl.value = e.target.src;
            searchPanel.innerHTML = '';
            searchPanel.style.display = 'none';
        };
    });
    form.reset.addEventListener('click', e => {
        e.preventDefault();
        resetForm();
    });
});