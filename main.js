document.addEventListener("DOMContentLoaded", () => {
    // document.querySelector("#currency-converter").addEventListener("submit", (event) => {
    document.querySelector("#currency-converter").addEventListener("submit", async (event) => {
        event.preventDefault();

        const { target: { to, from, amount } } = event;
        let myHeaders = new Headers();
        myHeaders.append("apikey", "wIUNmwLAjl3ULVPMwjup1F7zSDJEt80t");

        const requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };
        // old way

        // fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to.value}&from=${from.value}&amount=${amount.valueAsNumber}`, requestOptions)
        //     .then(response => response.json())
        //     .then(data => {
        //         let { info, date, query:{from, to}, result } = data;
        //         document.querySelector(".result").textContent = 
        //         `rate: ${info.rate.toFixed(2)}
        //          date: ${date}
        //          from: ${from}
        //          to: ${to}
        //          result: ${result.toFixed(2)}`;

        // new way of api with try cath 
        try{
            let response = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to.value}&from=${from.value}&amount=${amount.valueAsNumber}`, requestOptions)
            const data = await response.json();
            console.log(data);
            let { info, date, query, result } = data
            document.querySelector(".result").textContent =
                `rate: ${info.rate.toFixed(2)}
                date: ${date}
                from: ${query.from}
                to: ${query.to}
                result: ${result.toFixed(2)}`;
        }
        catch(error){
            console.log(error);
        }
        finally{
            console.log("finally block");
        }
    })
})  