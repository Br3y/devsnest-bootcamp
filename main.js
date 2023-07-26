document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#currency-converter").addEventListener("submit", (event) => {
        event.preventDefault();

        const { target: { to, from, amount } } = event;
        let myHeaders = new Headers();
        myHeaders.append("apikey", "wIUNmwLAjl3ULVPMwjup1F7zSDJEt80t");

        const requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to.value}&from=${from.value}&amount=${amount.valueAsNumber}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                let { info, date, query:{from, to}, result } = data;
                document.querySelector(".result").textContent = 
                `rate: ${info.rate.toFixed(2)}
                 date: ${date}
                 from: ${from}
                 to: ${to}
                 result: ${result.toFixed(2)}`;

                //  console.log(data);
            })
            .catch(error => console.log('error', error));
    })
})