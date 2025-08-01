const key = "15664aa649a2a8e715e072b60293a990"
const open = document.querySelector(".open")
const close = document.querySelector(".close")
const mobile_menu = document.querySelector(".mobile-menu")
const pesquisa = document.querySelector('#pesquisa')

//Menu
open.addEventListener('click', () => {
    mobile_menu.classList.remove("hidden")
})

close.addEventListener('click', () => {
    mobile_menu.classList.add("hidden")
})

//Mudança do tema de acordo ao período do dia
var hora = new Date().getHours()
const boxes = document.querySelectorAll('.muda-preto')
const wTexts = document.querySelectorAll('.texto-branco')
const bTexts = document.querySelectorAll('.texto-preto')

if (hora < 12) {
    document.body.style.backgroundImage = "url(./src/assets/images/dia.jpg)"
} else if (hora < 18) {
    document.body.style.backgroundImage = "url(./src/assets/images/tarde.jpg)"
} else {
    document.body.style.backgroundImage = "url(./src/assets/images/noite.jpg)"
}

if (hora >= 12 && hora < 24) {
    boxes.forEach(box => {
        box.style.backgroundColor = "#00000080"
    });

    wTexts.forEach(wText => {
        wText.style.color = "#fff"
    })

    bTexts.forEach(bText => {
        bText.style.color = "#00000080"
    })
}

//Pesquisa da cidade e demonstração dos dados
const icone_search = document.querySelector('.icone-search')

icone_search.addEventListener('click', () => {
    request_climate_data()
})

pesquisa.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        request_climate_data()
    }
})

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const data = document.querySelector('.data')
var date = new Date()
data.innerHTML = dias[date.getDay()] + ', ' + (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()) + ' ' + meses[date.getUTCMonth()]

window.addEventListener('load', request_current_city = () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&lang=pt_br&appid=${key}`)

            const data = await request.json()
            show_data(data)
        })
    } else {
        console.log('Geolocation não está disponível no seu navegador!')
    }
})

const request_climate_data = async () => {
    const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${pesquisa.value}&units=metric&lang=pt_br&appid=${key}`)
    const data = await request.json()
    show_data(data)
}

let max = document.createElement('sup')
max.setAttribute('class', 'celsius')
max.innerHTML = 'º'

let min = document.createElement('sup')
min.setAttribute('class', 'celsius')
min.innerHTML = 'º'

const show_data = (climate_data) => {
    (async () => {
        document.querySelector('.cidade').innerHTML = climate_data['name']

        document.querySelector('.temperatura').innerHTML = Math.floor(climate_data['main']['temp'])

        document.querySelector('.icone-temp').setAttribute('src', `https://openweathermap.org/img/wn/${climate_data['weather']['0']['icon']}.png`)

        document.querySelector('.grupo-clima').innerHTML = climate_data['weather']['0']['main']

        document.querySelector('.descricao-clima').innerHTML = climate_data['weather']['0']['description']

        const maxima = document.querySelector('.maxima')
        maxima.innerHTML = Math.floor(climate_data['main']['temp_max'])
        maxima.appendChild(max)

        const minima = document.querySelector('.minima')
        minima.innerHTML = Math.floor(climate_data['main']['temp_min'])
        minima.appendChild(min)

        document.querySelector('.pressao-atmosferica').innerHTML = climate_data['main']['pressure'] + " hPa"

        document.querySelector('.humidade').innerHTML = climate_data['main']['humidity'] + " %"

        document.querySelector('.pressao-solo').innerHTML = climate_data['main']['sea_level'] + " hPa"

        document.querySelector('.vento').innerHTML = climate_data['wind']['speed'] + " m/s"

        document.querySelector('.nebulosidade').innerHTML = climate_data['clouds']['all'] + "%"

        document.querySelector('.sunrise').innerHTML = horaFormatada(climate_data['sys']['sunrise']) + " am"

        document.querySelector('.sunset').innerHTML = horaFormatada(climate_data['sys']['sunset']) + " pm"

        document.querySelector('.v-sensibilidade').innerHTML = Math.floor(climate_data['main']['feels_like'])
        recomendacaoClima(Math.floor(climate_data['main']['feels_like']), Math.floor(climate_data['main']['temp']))

        document.querySelector('.v-visibilidade').innerHTML = climate_data['visibility'] + "m"
        recomendacaoVisibilidade(climate_data['visibility'])

        document.querySelector('.sensibilidade-valor').innerHTML = Math.floor(climate_data['main']['feels_like'])

        document.querySelector('.visibilidade-valor').innerHTML = climate_data['visibility'] + "m"
    })()
}

function horaFormatada(segundos) {
    let data = new Date(segundos * 1000)
    let horas = data.getHours().toString().padStart(2, '0')
    let minutos = data.getMinutes().toString().padStart(2, '0')
    return `${horas}:${minutos}`
}

function recomendacaoClima(feels_like, temp) {
    if (feels_like > temp) {
        document.querySelector('.v-sensibilidade').setAttribute('title', 'Está mais quente do que parece! A sensação térmica está acima da temperatura real, o que pode deixar o dia mais abafado e desconfortável. Beba água e evite exposição prolongada ao sol.')

        document.querySelector('.recomendacao-s').innerHTML = 'Está mais quente do que parece! A sensação térmica está acima da temperatura real, o que pode deixar o dia mais abafado e desconfortável. Beba água e evite exposição prolongada ao sol.'
    } else if (feels_like < temp) {
        document.querySelector('.v-sensibilidade').setAttribute('title', 'Apesar da temperatura, o corpo sente mais frio. O vento ou a umidade podem estar a baixar a sensação térmica. Vista-se bem para se proteger do frio.')

        document.querySelector('.recomendacao-s').innerHTML = 'Apesar da temperatura, o corpo sente mais frio. O vento ou a umidade podem estar a baixar a sensação térmica. Vista-se bem para se proteger do frio.'
    } else {
        document.querySelector('.v-sensibilidade').setAttribute('title', 'O clima está estável — o que marca no termômetro é exatamente o que você sente!')

        document.querySelector('.recomendacao-s').innerHTML = 'O clima está estável — o que marca no termômetro é exatamente o que você sente!'
    }
}

function recomendacaoVisibilidade(distancia) {
    if (distancia >= 8000) {
        document.querySelector('.v-visibilidade').setAttribute('title', 'A visibilidade está excelente. O céu está limpo ou pouco encoberto, ideal para dirigir, caminhar ou fazer actividades ao ar livre com segurança.')

        document.querySelector('.recomendacao-v').innerHTML = 'A visibilidade está excelente. O céu está limpo ou pouco encoberto, ideal para dirigir, caminhar ou fazer actividades ao ar livre com segurança.'
    } else if (distancia > 3000 && distancia < 8000) {
        document.querySelector('.v-visibilidade').setAttribute('title', 'A visibilidade está reduzida. Pode haver neblina leve, chuva ou poeira no ar. Tenha atenção redobrada ao dirigir ou andar de moto ou bicicleta.')

        document.querySelector('.recomendacao-v').innerHTML = 'A visibilidade está reduzida. Pode haver neblina leve, chuva ou poeira no ar. Tenha atenção redobrada ao dirigir ou andar de moto ou bicicleta.'
    } else {
        document.querySelector('.v-visibilidade').setAttribute('title', 'A visibilidade está bastante comprometida. Provavelmente há neblina densa, fumaça ou chuva forte. Evite viagens longas e dirija com cautela.')

        document.querySelector('.recomendacao-v').innerHTML = 'A visibilidade está bastante comprometida. Provavelmente há neblina densa, fumaça ou chuva forte. Evite viagens longas e dirija com cautela.'
    }
}